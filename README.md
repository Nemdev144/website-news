# The Herald

**Independent journalism. Clear perspectives.**

English-language news platform built with **Next.js 16** and **MySQL**. Includes a public news website and a password-protected admin CMS for categories and articles.

---

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Requirements](#requirements)
- [Quick start](#quick-start)
- [Environment variables](#environment-variables)
- [Database](#database)
- [Default admin login](#default-admin-login)
- [npm scripts](#npm-scripts)
- [Project structure](#project-structure)
- [Routes](#routes)
- [API reference](#api-reference)
- [Article content format](#article-content-format)
- [Branding & SEO](#branding--seo)
- [Production](#production)
- [License](#license)

---

## Features

### Public site

| Area | Description |
|------|-------------|
| **Homepage** | Hero carousel, hot-news ticker, quick news grid, category sections (all active categories with articles), multimedia block, Most Read sidebar |
| **Category** | `/category/[slug]` — spotlight layout (1 lead + 2 side stories), list rows with thumbnail + excerpt, pagination |
| **Article** | `/article/[slug]` — title, excerpt, metadata, block-based body, like button, related articles |
| **Search** | `/search?q=...` — full-text search on published articles |

- Only articles with status **`PUBLISHED`** appear on the public site.
- Navigation and footer categories are loaded from the database (`isActive: true`).
- **`coverImage`** is used on cards and listings only — it is **not** rendered inside the article body.

### Admin CMS (`/admin`)

| Section | Path | Capabilities |
|---------|------|--------------|
| Dashboard | `/admin/dashboard` | Overview stats and recent activity |
| Articles | `/admin/articles` | List, search, filter, create, edit, delete |
| Categories | `/admin/categories` | CRUD, toggle active/inactive, slug validation |

**Article editor**

- **Cover image** — separate field for thumbnails and listing cards
- **Block content** — text and image blocks stored as JSON in `Article.content`
- **Image upload** — `POST /api/admin/uploads` → `public/uploads/` (max 6 MB; JPEG, PNG, WebP, GIF, AVIF)
- **Flags:** Featured · Hot · Most Read
- **Status:** `DRAFT` · `PUBLISHED` · `ARCHIVED`

Admin UI labels are in **Vietnamese**; the public site is in **English**.

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| UI | React 19, Tailwind CSS 4 |
| Database | MySQL / MariaDB |
| ORM | Prisma 7 (`@prisma/adapter-mariadb`) |
| Auth | JWT (httpOnly cookie), bcryptjs |
| Validation | Zod |
| Icons | lucide-react |

---

## Requirements

- **Node.js** 20+
- **MySQL** 8+ or **MariaDB** 10.6+
- **npm** 9+

---

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Create .env in the project root (see Environment variables)

# 3. Set up the database
npm run db:generate
npm run db:migrate
npm run db:seed

# 4. Start development server
npm run dev
```

| URL | Purpose |
|-----|---------|
| http://localhost:3000 | Public website |
| http://localhost:3000/login | Admin login |
| http://localhost:3000/admin | CMS (after login) |

Verify the database connection:

```bash
npm run db:check
```

---

## Environment variables

Create a `.env` file in the project root:

```env
# Required — MySQL connection string
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/the_herald"

# Required in production — used to sign admin JWT cookies
JWT_SECRET="change-me-to-a-long-random-string"

# Optional — base URL for server-side fetches (defaults to http://localhost:3000)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | MySQL connection URL |
| `JWT_SECRET` | Production | Secret for signing admin session tokens |
| `NEXT_PUBLIC_APP_URL` | No | Public origin for internal API calls |

---

## Database

### Schema overview

| Model | Purpose |
|-------|---------|
| **User** | Admin accounts |
| **Category** | Sections (name, slug, description, sort order, active flag) |
| **Article** | News items (content, cover, flags, views, likes, publish date) |

Prisma client is generated to `src/generated/prisma/` after `npm run db:generate`.

### Useful commands

```bash
npm run db:generate   # Regenerate Prisma client
npm run db:migrate    # Apply migrations (development)
npm run db:push       # Push schema without migration files
npm run db:seed       # Seed admin user, categories, sample articles
npm run db:studio     # Open Prisma Studio GUI
```

Re-run seed to refresh sample data (does not remove existing rows unless seed logic handles it):

```bash
npm run db:seed
```

---

## Default admin login

Credentials created by `prisma/seed.ts`:

| Field | Value |
|-------|-------|
| Username | `admin` |
| Password | `admin123456` |

Change the password after first login in production.

---

## npm scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Next.js dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run `prisma migrate dev` |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed database |
| `npm run db:check` | Check migration status + connection |
| `npm run db:studio` | Open Prisma Studio |

---

## Project structure

```
src/
├── app/
│   ├── page.tsx                  # Homepage
│   ├── search/                   # Search results
│   ├── article/[slug]/           # Article detail
│   ├── category/[slug]/          # Category listing
│   ├── login/                    # Admin login
│   ├── admin/                    # CMS (protected)
│   └── api/
│       ├── auth/                 # Login, logout, session
│       ├── admin/                # Categories, articles, uploads
│       └── public/               # Home, categories, articles, search, like
├── components/
│   ├── public/                   # Public layout & news UI
│   └── admin/                    # CMS shell, forms, dashboard
├── lib/
│   ├── site.ts                   # Brand name, logo paths, SEO copy
│   ├── prisma.ts                 # Prisma client
│   ├── auth.ts                   # JWT helpers
│   ├── public-articles.ts        # Public data queries
│   ├── article-blocks.ts         # Block content parse/serialize
│   └── article-mapper.ts         # DB → public types
├── generated/prisma/             # Generated Prisma client
└── middleware.ts                 # Protects /admin and /api/admin

prisma/
├── schema.prisma
├── seed.ts
└── migrations/

public/
├── logo.png                      # Full wordmark
├── icon.png                      # H mark (favicon)
└── uploads/                      # Uploaded images (runtime)
```

---

## Routes

### Public

| Path | Page |
|------|------|
| `/` | Homepage |
| `/category/[slug]` | Category |
| `/article/[slug]` | Article |
| `/search?q=` | Search |

### Admin

| Path | Page |
|------|------|
| `/login` | Login |
| `/admin/dashboard` | Dashboard |
| `/admin/articles` | Article list |
| `/admin/articles/new` | Create article |
| `/admin/articles/[id]/edit` | Edit article |
| `/admin/categories` | Categories |

---

## API reference

### Auth

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/auth/login` | Authenticate; sets httpOnly cookie |
| `POST` | `/api/auth/logout` | Clear session cookie |
| `GET` | `/api/auth/me` | Current admin user |

Session cookie: `theherald_admin_token`

### Admin (authenticated)

| Method | Path | Description |
|--------|------|-------------|
| `GET` / `POST` | `/api/admin/categories` | List / create |
| `GET` / `PATCH` / `DELETE` | `/api/admin/categories/[id]` | Read / update / delete |
| `GET` / `POST` | `/api/admin/articles` | List / create |
| `GET` / `PATCH` / `DELETE` | `/api/admin/articles/[id]` | Read / update / delete |
| `POST` | `/api/admin/uploads` | Upload image |

### Public

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/public/home` | Homepage payload |
| `GET` | `/api/public/categories/[slug]` | Category page data |
| `GET` | `/api/public/articles/[slug]` | Article detail (increments views) |
| `GET` | `/api/public/search?q=` | Search published articles |
| `POST` | `/api/public/articles/[slug]/like` | Increment like count |

---

## Article content format

`Article.content` supports two formats:

**Block JSON (recommended)**

```json
[
  { "type": "text", "value": "Paragraph text…" },
  {
    "type": "image",
    "url": "/uploads/example.jpg",
    "title": "Optional title",
    "caption": "Caption shown below the image"
  }
]
```

**Legacy plain text** — paragraphs separated by `\n\n` (still rendered correctly).

---

## Branding & SEO

Central configuration: [`src/lib/site.ts`](src/lib/site.ts)

| Constant | Purpose |
|----------|---------|
| `SITE_NAME` | Site title |
| `SITE_TAGLINE` | Tagline (browser title suffix, logo) |
| `SITE_DESCRIPTION` | Meta description |
| `SITE_LOGO_PATH` | Full logo (`/logo.png`) |
| `SITE_ICON_PATH` | H icon / favicon (`/icon.png`) |
| `SITE_EMAIL` | Contact email in footer |

Metadata is applied in [`src/app/layout.tsx`](src/app/layout.tsx).

---

## Production

1. Set a strong `JWT_SECRET`.
2. Point `DATABASE_URL` to your production MySQL instance.
3. Run migrations and (optionally) seed:

   ```bash
   npm run db:generate
   npx prisma migrate deploy
   npm run build
   npm run start
   ```

4. **Uploads** — files are stored in `public/uploads/`. Back up this directory or move to object storage for multi-instance deployments.
5. Serve over HTTPS so httpOnly auth cookies are secure.

---

## License

Private project — all rights reserved.
