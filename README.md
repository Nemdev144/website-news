# Website News

English online newspaper built with Next.js, inspired by the layout structure of [congluan.vn](https://congluan.vn). The project includes a public news site and an admin CMS for managing categories, articles, and media.

## Features

### Public website

- **Homepage** — featured stories, hot ticker, latest news, category sections, most read, editor picks, multimedia
- **Category pages** — `/category/[slug]`
- **Article detail** — `/article/[slug]` with cover image, block-based body (text + inline images with captions), related articles, like button
- **Search** — `/search?q=...`
- Only **PUBLISHED** articles appear publicly; category navigation shows **active** categories from the database (falls back to mock data if DB is unavailable)

### Admin CMS

Protected under `/admin` (login at `/login`).

| Section | Path | Capabilities |
|--------|------|--------------|
| Dashboard | `/admin/dashboard` | Stats, status/category charts, latest & most-read articles |
| Articles | `/admin/articles` | List, search, filter by status/category, create, edit, delete |
| Categories | `/admin/categories` | CRUD, toggle active/inactive, slug validation |
| Media | `/admin/media` | Media library CRUD (standalone assets, not tied to article body) |

**Article editor**

- **Cover image** (`coverImage`) — separate field for thumbnail / hero on listings and article header
- **Block content** — alternating text and image blocks stored as JSON in `Article.content`
- **Image upload** — upload to `public/uploads/` via `/api/admin/uploads` (max 6MB, JPEG/PNG/WebP/GIF/AVIF)
- Flags: Featured, Hot, Most Read
- Status: `DRAFT`, `PUBLISHED`, `ARCHIVED`

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI | React 19, Tailwind CSS 4 |
| Database | MySQL (via Prisma + `@prisma/adapter-mariadb`) |
| ORM | Prisma 7 |
| Auth | JWT in httpOnly cookie, bcryptjs |
| Icons | lucide-react |

## Project structure

```
src/
├── app/
│   ├── page.tsx                 # Homepage
│   ├── search/                  # Search page
│   ├── article/[slug]/          # Article detail
│   ├── category/[slug]/         # Category page
│   ├── login/                   # Admin login
│   ├── admin/                   # CMS (protected)
│   └── api/
│       ├── auth/                # login, logout, me
│       ├── admin/               # categories, articles, media, uploads
│       └── public/              # home, categories, articles, search, like
├── components/
│   ├── public/                  # Public layout & news UI
│   └── admin/                   # CMS shell, forms, dashboard
├── lib/
│   ├── prisma.ts                # Prisma client (MariaDB adapter)
│   ├── auth.ts                  # JWT & cookie helpers
│   ├── public-articles.ts       # Public data queries
│   ├── article-blocks.ts        # Block content parse/serialize
│   └── article-mapper.ts        # DB → public API shapes
├── generated/prisma/            # Generated Prisma client (after db:generate)
└── middleware.ts                # Protects /admin and /api/admin
prisma/
├── schema.prisma
├── seed.ts                      # Admin user + sample categories/articles
└── migrations/
public/
└── uploads/                     # Uploaded images (created at runtime)
```

## Database

MySQL database name: **`website_news`** (configure via `DATABASE_URL`).

### Models

- **User** — admin accounts
- **Category** — name, slug, description, sortOrder, isActive
- **Article** — title, slug, excerpt, content (JSON blocks or legacy plain text), coverImage, author, source, status, flags, viewCount, likeCount, publishedAt
- **Media** — standalone media library entries (url, title, caption, type)

Prisma client is generated to `src/generated/prisma/`.

## Requirements

- Node.js 20+
- MySQL or MariaDB
- npm

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Create a `.env` file in the project root:

```env
# MySQL connection string
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/website_news"

# Required in production
JWT_SECRET="your-secret-key"

# Optional — base URL for server-side public API fetches (defaults to http://localhost:3000)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Database

Create the database, then apply schema and seed:

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

Verify connection and tables:

```bash
npm run db:check
```

### 4. Run development server

```bash
npm run dev
```

- Public site: [http://localhost:3000](http://localhost:3000)
- Admin login: [http://localhost:3000/login](http://localhost:3000/login)

## Admin login

Default credentials (from `prisma/seed.ts`):

| Field | Value |
|-------|-------|
| Username | `admin` |
| Password | `admin123456` |

After login you are redirected to `/admin` → `/admin/dashboard`.

To reset seed data:

```bash
npm run db:seed
```

## npm scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run migrations (`prisma migrate dev`) |
| `npm run db:push` | Push schema without migration |
| `npm run db:seed` | Seed admin, categories, articles |
| `npm run db:check` | Verify DB connection and row counts |
| `npm run db:studio` | Open Prisma Studio |

## API overview

### Auth

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/login` | Login, set JWT cookie |
| POST | `/api/auth/logout` | Clear cookie |
| GET | `/api/auth/me` | Current admin info |

Cookie name: `website_news_admin_token`

### Admin (requires auth)

| Path | Description |
|------|-------------|
| `/api/admin/categories` | List / create categories |
| `/api/admin/categories/[id]` | Get / update / delete / toggle active |
| `/api/admin/articles` | List / create articles |
| `/api/admin/articles/[id]` | Get / update / delete article |
| `/api/admin/media` | List / create media library items |
| `/api/admin/media/[id]` | Get / update / delete media |
| `/api/admin/uploads` | Upload image file |

### Public

| Path | Description |
|------|-------------|
| `/api/public/home` | Homepage payload |
| `/api/public/categories/[slug]` | Category page data |
| `/api/public/articles/[slug]` | Article detail (+ view increment) |
| `/api/public/search?q=` | Search published articles |
| `/api/public/articles/[slug]/like` | Increment like count |

## Article content format

Article body is stored in `Article.content`:

- **New format** — JSON array of blocks:
  ```json
  [
    { "type": "text", "value": "Paragraph text..." },
    { "type": "image", "url": "/uploads/abc.jpg", "title": "Optional", "caption": "Caption below image" }
  ]
  ```
- **Legacy format** — plain text with `\n\n` between paragraphs; old `Media` rows linked to the article are merged when editing

**Cover image** (`coverImage`) is stored separately and used for cards, homepage, and the hero image on the article page — not mixed into body blocks.

## Production notes

- Set a strong `JWT_SECRET` in production
- Ensure `DATABASE_URL` points to your production MySQL instance
- Run `npm run build && npm run start`
- Uploaded files are saved under `public/uploads/` — back up or use external storage for production if needed

## License

Private project.
