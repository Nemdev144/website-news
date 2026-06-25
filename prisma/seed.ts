import "dotenv/config";
import bcrypt from "bcryptjs";
import { ArticleStatus } from "../src/generated/prisma/client";
import { createPrismaClient } from "../src/lib/prisma";

const prisma = createPrismaClient();

type SeedCategory = {
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
};

type SeedArticle = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  source: string;
  categorySlug: string;
  isFeatured?: boolean;
  isHot?: boolean;
  isMostRead?: boolean;
  viewCount: number;
  publishedAt: Date;
};

const categories: SeedCategory[] = [
  {
    name: "World",
    slug: "world",
    description:
      "Global affairs, diplomacy, and international developments from every continent.",
    sortOrder: 1,
  },
  {
    name: "Politics",
    slug: "politics",
    description:
      "Policy, elections, governance, and the decisions shaping public life.",
    sortOrder: 2,
  },
  {
    name: "Business",
    slug: "business",
    description:
      "Markets, companies, economics, and the forces driving global commerce.",
    sortOrder: 3,
  },
  {
    name: "Technology",
    slug: "technology",
    description:
      "Innovation, digital society, science, and the future of connected life.",
    sortOrder: 4,
  },
  {
    name: "Society",
    slug: "society",
    description:
      "Communities, social change, health, education, and everyday life.",
    sortOrder: 5,
  },
  {
    name: "Culture",
    slug: "culture",
    description:
      "Arts, entertainment, ideas, and the stories that define our times.",
    sortOrder: 6,
  },
  {
    name: "Opinion",
    slug: "opinion",
    description:
      "Editorials, columns, and perspectives from our writers and contributors.",
    sortOrder: 7,
  },
  {
    name: "Multimedia",
    slug: "multimedia",
    description:
      "Photo essays, video reports, and visual storytelling from our newsroom.",
    sortOrder: 8,
  },
];

function buildContent(excerpt: string, title: string): string {
  return [
    excerpt,
    `Reporting teams across Website News have been tracking developments around "${title}" as officials, analysts, and residents respond to a fast-moving story with wide-ranging implications.`,
    "Sources familiar with the matter say conversations remain active at senior levels, with stakeholders weighing short-term responses against longer-term structural changes that could reshape policy for years to come.",
    "In public forums and editorial pages alike, debate has intensified over transparency, accountability, and the pace of decision-making in an environment defined by rapid information flows.",
    "Community leaders emphasized the need for clear communication, while international observers continue monitoring signals from markets, institutions, and diplomatic channels.",
    "Website News will continue to update this story as verified information becomes available.",
  ].join("\n\n");
}

const articles: SeedArticle[] = [
  {
    title: "Global Leaders Gather for Emergency Climate Summit in Geneva",
    slug: "global-leaders-climate-summit-geneva",
    excerpt:
      "Representatives from 140 nations convene to negotiate accelerated emissions targets amid record-breaking temperatures.",
    categorySlug: "world",
    coverImage: "/images/placeholders/world-1.jpg",
    author: "Sarah Mitchell",
    source: "Website News World Desk",
    isFeatured: true,
    isHot: true,
    isMostRead: true,
    viewCount: 48200,
    publishedAt: new Date("2026-06-25T08:00:00Z"),
  },
  {
    title: "Central Banks Signal Coordinated Response to Market Volatility",
    slug: "central-banks-market-volatility-response",
    excerpt:
      "Finance ministers hint at synchronized policy adjustments as investors react to shifting trade dynamics.",
    categorySlug: "business",
    coverImage: "/images/placeholders/business-1.jpg",
    author: "James Whitfield",
    source: "Markets Desk",
    isHot: true,
    isMostRead: true,
    viewCount: 35600,
    publishedAt: new Date("2026-06-25T07:30:00Z"),
  },
  {
    title: "Parliament Debates Landmark Digital Privacy Bill",
    slug: "parliament-digital-privacy-bill-debate",
    excerpt:
      "Lawmakers weigh stricter data protection standards that could reshape how tech companies handle user information.",
    categorySlug: "politics",
    coverImage: "/images/placeholders/politics-1.jpg",
    author: "Elena Rodriguez",
    source: "Capitol Bureau",
    isHot: true,
    isMostRead: true,
    viewCount: 28900,
    publishedAt: new Date("2026-06-25T06:45:00Z"),
  },
  {
    title: "Breakthrough in Quantum Computing Raises New Security Questions",
    slug: "quantum-computing-security-questions",
    excerpt:
      "Researchers demonstrate a stable 512-qubit processor, prompting governments to reassess encryption standards.",
    categorySlug: "technology",
    coverImage: "/images/placeholders/technology-1.jpg",
    author: "David Chen",
    source: "Innovation Lab",
    isHot: true,
    isMostRead: true,
    viewCount: 41200,
    publishedAt: new Date("2026-06-24T18:20:00Z"),
  },
  {
    title: "Urban Housing Crisis Spurs Debate Over Rent Control Expansion",
    slug: "urban-housing-rent-control-debate",
    excerpt:
      "City councils consider new tenant protections as median rents climb for the fifth consecutive year.",
    categorySlug: "society",
    coverImage: "/images/placeholders/society-1.jpg",
    author: "Amanda Foster",
    source: "Urban Affairs",
    isMostRead: true,
    viewCount: 22400,
    publishedAt: new Date("2026-06-24T16:00:00Z"),
  },
  {
    title: "International Film Festival Opens with Focus on Emerging Voices",
    slug: "international-film-festival-emerging-voices",
    excerpt:
      "Directors from 42 countries premiere works exploring migration, identity, and digital storytelling.",
    categorySlug: "culture",
    coverImage: "/images/placeholders/culture-1.jpg",
    author: "Thomas Berger",
    source: "Culture Desk",
    viewCount: 18700,
    publishedAt: new Date("2026-06-24T14:30:00Z"),
  },
  {
    title: "Why Public Trust in Institutions Is at a Crossroads",
    slug: "public-trust-institutions-crossroads",
    excerpt:
      "A columnist examines the erosion of confidence in media, government, and corporations.",
    categorySlug: "opinion",
    coverImage: "/images/placeholders/opinion-1.jpg",
    author: "Margaret Hayes",
    source: "Opinion",
    isMostRead: true,
    viewCount: 15300,
    publishedAt: new Date("2026-06-24T12:00:00Z"),
  },
  {
    title: "Renewable Energy Investment Surpasses Fossil Fuels for First Time",
    slug: "renewable-energy-investment-surpasses-fossil",
    excerpt:
      "Global clean energy spending hits $1.8 trillion as solar and wind projects accelerate worldwide.",
    categorySlug: "business",
    coverImage: "/images/placeholders/business-2.jpg",
    author: "James Whitfield",
    source: "Energy Markets",
    isHot: true,
    viewCount: 33100,
    publishedAt: new Date("2026-06-24T10:15:00Z"),
  },
  {
    title: "NATO Allies Announce Expanded Cyber Defense Framework",
    slug: "nato-cyber-defense-framework",
    excerpt:
      "Member states agree on shared protocols to counter state-sponsored attacks on critical infrastructure.",
    categorySlug: "world",
    coverImage: "/images/placeholders/world-2.jpg",
    author: "Sarah Mitchell",
    source: "Security Watch",
    viewCount: 27800,
    publishedAt: new Date("2026-06-24T09:00:00Z"),
  },
  {
    title: "AI Assistants in Classrooms: Promise or Peril for Education?",
    slug: "ai-assistants-classrooms-education",
    excerpt:
      "School districts pilot intelligent tutoring tools while teachers debate boundaries for machine-led learning.",
    categorySlug: "technology",
    coverImage: "/images/placeholders/technology-2.jpg",
    author: "David Chen",
    source: "EdTech Report",
    isMostRead: true,
    viewCount: 36500,
    publishedAt: new Date("2026-06-23T20:00:00Z"),
  },
  {
    title: "Election Reform Proposals Gain Momentum in Key Swing States",
    slug: "election-reform-swing-states",
    excerpt:
      "Bipartisan groups push for updated voting infrastructure and transparent ballot auditing procedures.",
    categorySlug: "politics",
    coverImage: "/images/placeholders/politics-2.jpg",
    author: "Elena Rodriguez",
    source: "Election Desk",
    viewCount: 24100,
    publishedAt: new Date("2026-06-23T17:45:00Z"),
  },
  {
    title: "Community Gardens Flourish as Cities Rethink Green Space Policy",
    slug: "community-gardens-green-space-policy",
    excerpt:
      "Neighborhood-led initiatives transform vacant lots into productive gardens and cooling green corridors.",
    categorySlug: "society",
    coverImage: "/images/placeholders/society-2.jpg",
    author: "Amanda Foster",
    source: "Community Report",
    viewCount: 12800,
    publishedAt: new Date("2026-06-23T15:30:00Z"),
  },
  {
    title: "Major Museums Digitize Collections for Global Public Access",
    slug: "museums-digitize-collections-access",
    excerpt:
      "Institutions launch open digital archives spanning centuries of art, artifacts, and manuscripts.",
    categorySlug: "culture",
    coverImage: "/images/placeholders/culture-2.jpg",
    author: "Thomas Berger",
    source: "Arts & Heritage",
    viewCount: 9600,
    publishedAt: new Date("2026-06-23T13:00:00Z"),
  },
  {
    title: "Supply Chain Shifts Reshape Global Manufacturing Hubs",
    slug: "supply-chain-manufacturing-hubs",
    excerpt:
      "Companies diversify production locations as geopolitical tensions and logistics costs rise.",
    categorySlug: "business",
    coverImage: "/images/placeholders/business-3.jpg",
    author: "James Whitfield",
    source: "Industry Watch",
    viewCount: 21400,
    publishedAt: new Date("2026-06-23T11:00:00Z"),
  },
  {
    title: "Refugee Resettlement Programs Face Funding Shortfalls",
    slug: "refugee-resettlement-funding-shortfalls",
    excerpt:
      "Humanitarian agencies warn that reduced international aid could leave thousands without support.",
    categorySlug: "world",
    coverImage: "/images/placeholders/world-3.jpg",
    author: "Sarah Mitchell",
    source: "Global Aid Monitor",
    viewCount: 17200,
    publishedAt: new Date("2026-06-22T19:00:00Z"),
  },
  {
    title: "Next-Generation Batteries Could Double Electric Vehicle Range",
    slug: "next-gen-batteries-ev-range",
    excerpt:
      "Solid-state prototypes show promising results as automakers race toward commercial models by 2028.",
    categorySlug: "technology",
    coverImage: "/images/placeholders/technology-3.jpg",
    author: "David Chen",
    source: "Auto Future",
    viewCount: 29800,
    publishedAt: new Date("2026-06-22T16:30:00Z"),
  },
  {
    title: "Mental Health Services Expand in Rural Communities",
    slug: "mental-health-rural-communities",
    excerpt:
      "Telehealth platforms and mobile clinics aim to close the care gap outside major cities.",
    categorySlug: "society",
    coverImage: "/images/placeholders/society-3.jpg",
    author: "Amanda Foster",
    source: "Health Desk",
    viewCount: 11500,
    publishedAt: new Date("2026-06-22T14:00:00Z"),
  },
  {
    title: "The Case for Slow Journalism in an Age of Instant Updates",
    slug: "slow-journalism-instant-updates",
    excerpt:
      "Editors argue that depth and context matter more than ever when news cycles compress complex stories.",
    categorySlug: "opinion",
    coverImage: "/images/placeholders/opinion-2.jpg",
    author: "Margaret Hayes",
    source: "Editorial Board",
    viewCount: 8900,
    publishedAt: new Date("2026-06-22T10:00:00Z"),
  },
  {
    title: "Photo Essay: Life Along the World's Changing Coastlines",
    slug: "photo-essay-changing-coastlines",
    excerpt:
      "A visual journey through communities adapting to rising seas and shifting shorelines.",
    categorySlug: "multimedia",
    coverImage: "/images/placeholders/multimedia-1.jpg",
    author: "Photo Desk",
    source: "Visual Stories",
    viewCount: 25600,
    publishedAt: new Date("2026-06-21T18:00:00Z"),
  },
  {
    title: "Documentary Explores the Human Side of Space Exploration",
    slug: "documentary-human-side-space-video",
    excerpt:
      "Filmmakers follow astronaut crews through training, launch, and return.",
    categorySlug: "multimedia",
    coverImage: "/images/placeholders/multimedia-2.jpg",
    author: "Video Desk",
    source: "Video Unit",
    viewCount: 19300,
    publishedAt: new Date("2026-06-21T12:00:00Z"),
  },
  {
    title: "Trade Ministers Meet to Resolve Tariff Disputes Before Deadline",
    slug: "trade-ministers-tariff-disputes",
    excerpt:
      "Negotiators from major economies seek a framework agreement before export deadlines bite.",
    categorySlug: "world",
    coverImage: "/images/placeholders/world-4.jpg",
    author: "Sarah Mitchell",
    source: "Trade Watch",
    isHot: true,
    viewCount: 16800,
    publishedAt: new Date("2026-06-25T05:00:00Z"),
  },
  {
    title: "Startup Funding Slows as Investors Demand Path to Profitability",
    slug: "startup-funding-slows-profitability",
    excerpt:
      "Venture capital firms tighten due diligence and prioritize sustainable business models.",
    categorySlug: "business",
    coverImage: "/images/placeholders/business-4.jpg",
    author: "James Whitfield",
    source: "Venture Brief",
    viewCount: 14200,
    publishedAt: new Date("2026-06-24T08:00:00Z"),
  },
  {
    title: "New Open-Source AI Model Challenges Proprietary Systems",
    slug: "open-source-ai-model-challenge",
    excerpt:
      "A university consortium releases a competitive language model, sparking debate over open research.",
    categorySlug: "technology",
    coverImage: "/images/placeholders/technology-4.jpg",
    author: "David Chen",
    source: "AI Lab",
    isHot: true,
    viewCount: 26700,
    publishedAt: new Date("2026-06-24T07:00:00Z"),
  },
  {
    title: "Public Transit Ridership Rebounds in Major Cities",
    slug: "public-transit-ridership-rebounds",
    excerpt:
      "Metro systems report rising passenger numbers as hybrid work and fuel costs reshape commuting.",
    categorySlug: "society",
    coverImage: "/images/placeholders/society-4.jpg",
    author: "Amanda Foster",
    source: "Transit Monitor",
    viewCount: 9800,
    publishedAt: new Date("2026-06-23T09:00:00Z"),
  },
  {
    title: "Senate Committee Advances Infrastructure Spending Package",
    slug: "senate-infrastructure-spending-package",
    excerpt:
      "A bipartisan bill allocates funds for roads, bridges, and broadband expansion.",
    categorySlug: "politics",
    coverImage: "/images/placeholders/politics-3.jpg",
    author: "Elena Rodriguez",
    source: "Policy Wire",
    isHot: true,
    viewCount: 19500,
    publishedAt: new Date("2026-06-25T04:00:00Z"),
  },
  {
    title: "Visual Report: Climate Data Charts That Tell the Story",
    slug: "climate-data-visual-report-charts",
    excerpt:
      "Interactive charts map temperature trends, emissions trajectories, and regional impacts.",
    categorySlug: "multimedia",
    coverImage: "/images/placeholders/multimedia-3.jpg",
    author: "Data Desk",
    source: "Visual Journalism",
    viewCount: 17400,
    publishedAt: new Date("2026-06-20T16:00:00Z"),
  },
].map((article) => ({
  ...article,
  content: buildContent(article.excerpt, article.title),
}));

async function main() {
  console.log("Seeding database...");

  await prisma.media.deleteMany();
  await prisma.article.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("admin123456", 10);

  await prisma.user.create({
    data: {
      username: "admin",
      passwordHash,
      fullName: "Website News Admin",
      email: "admin@websitenews.com",
      isActive: true,
    },
  });

  const categoryMap = new Map<string, string>();

  for (const category of categories) {
    const created = await prisma.category.create({
      data: {
        name: category.name,
        slug: category.slug,
        description: category.description,
        sortOrder: category.sortOrder,
        isActive: true,
      },
    });
    categoryMap.set(category.slug, created.id);
  }

  for (const article of articles) {
    const categoryId = categoryMap.get(article.categorySlug);
    if (!categoryId) continue;

    await prisma.article.create({
      data: {
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        coverImage: article.coverImage,
        author: article.author,
        source: article.source,
        status: ArticleStatus.PUBLISHED,
        categoryId,
        isFeatured: article.isFeatured ?? false,
        isHot: article.isHot ?? false,
        isMostRead: article.isMostRead ?? false,
        viewCount: 0,
        publishedAt: article.publishedAt,
      },
    });
  }

  console.log(`Seeded ${categories.length} categories and ${articles.length} articles.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
