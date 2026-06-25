import type { Article, Category, MultimediaItem, TrendingTopic } from "@/types/news";

export const categories: Category[] = [
  {
    name: "World",
    slug: "world",
    description: "Global affairs, diplomacy, and international developments from every continent.",
  },
  {
    name: "Politics",
    slug: "politics",
    description: "Policy, elections, governance, and the decisions shaping public life.",
  },
  {
    name: "Business",
    slug: "business",
    description: "Markets, companies, economics, and the forces driving global commerce.",
  },
  {
    name: "Technology",
    slug: "technology",
    description: "Innovation, digital society, science, and the future of connected life.",
  },
  {
    name: "Society",
    slug: "society",
    description: "Communities, social change, health, education, and everyday life.",
  },
  {
    name: "Culture",
    slug: "culture",
    description: "Arts, entertainment, ideas, and the stories that define our times.",
  },
  {
    name: "Opinion",
    slug: "opinion",
    description: "Editorials, columns, and perspectives from our writers and contributors.",
  },
  {
    name: "Multimedia",
    slug: "multimedia",
    description: "Photo essays, video reports, and visual storytelling from our newsroom.",
  },
];

export const articles: Article[] = [
  {
    id: "1",
    title: "Global Leaders Gather for Emergency Climate Summit in Geneva",
    slug: "global-leaders-climate-summit-geneva",
    excerpt:
      "Representatives from 140 nations convene to negotiate accelerated emissions targets amid record-breaking temperatures across three continents.",
    category: "world",
    image: "/placeholder-news.jpg",
    author: "Sarah Mitchell",
    publishedAt: "2026-06-25T08:00:00Z",
    viewCount: 48200,
    isHot: true,
    isFeatured: true,
    isMostRead: true,
  },
  {
    id: "2",
    title: "Central Banks Signal Coordinated Response to Market Volatility",
    slug: "central-banks-market-volatility-response",
    excerpt:
      "Finance ministers hint at synchronized policy adjustments as investors react to shifting trade dynamics and energy price fluctuations.",
    category: "business",
    image: "/placeholder-news.jpg",
    author: "James Whitfield",
    publishedAt: "2026-06-25T07:30:00Z",
    viewCount: 35600,
    isHot: true,
    isFeatured: false,
    isMostRead: true,
  },
  {
    id: "3",
    title: "Parliament Debates Landmark Digital Privacy Bill",
    slug: "parliament-digital-privacy-bill-debate",
    excerpt:
      "Lawmakers weigh stricter data protection standards that could reshape how tech companies handle user information across borders.",
    category: "politics",
    image: "/placeholder-news.jpg",
    author: "Elena Rodriguez",
    publishedAt: "2026-06-25T06:45:00Z",
    viewCount: 28900,
    isHot: true,
    isFeatured: false,
    isMostRead: true,
  },
  {
    id: "4",
    title: "Breakthrough in Quantum Computing Raises New Security Questions",
    slug: "quantum-computing-security-questions",
    excerpt:
      "Researchers demonstrate a stable 512-qubit processor, prompting governments to reassess encryption standards for critical infrastructure.",
    category: "technology",
    image: "/placeholder-news.jpg",
    author: "David Chen",
    publishedAt: "2026-06-24T18:20:00Z",
    viewCount: 41200,
    isHot: true,
    isFeatured: false,
    isMostRead: true,
  },
  {
    id: "5",
    title: "Urban Housing Crisis Spurs Debate Over Rent Control Expansion",
    slug: "urban-housing-rent-control-debate",
    excerpt:
      "City councils across major metros consider new tenant protections as median rents climb for the fifth consecutive year.",
    category: "society",
    image: "/placeholder-news.jpg",
    author: "Amanda Foster",
    publishedAt: "2026-06-24T16:00:00Z",
    viewCount: 22400,
    isHot: false,
    isFeatured: false,
    isMostRead: true,
  },
  {
    id: "6",
    title: "International Film Festival Opens with Focus on Emerging Voices",
    slug: "international-film-festival-emerging-voices",
    excerpt:
      "Directors from 42 countries premiere works exploring migration, identity, and the changing nature of storytelling in the digital age.",
    category: "culture",
    image: "/placeholder-news.jpg",
    author: "Thomas Berger",
    publishedAt: "2026-06-24T14:30:00Z",
    viewCount: 18700,
    isHot: false,
    isFeatured: false,
    isMostRead: false,
  },
  {
    id: "7",
    title: "Why Public Trust in Institutions Is at a Crossroads",
    slug: "public-trust-institutions-crossroads",
    excerpt:
      "A columnist examines the erosion of confidence in media, government, and corporations — and what rebuilding credibility might require.",
    category: "opinion",
    image: "/placeholder-news.jpg",
    author: "Margaret Hayes",
    publishedAt: "2026-06-24T12:00:00Z",
    viewCount: 15300,
    isHot: false,
    isFeatured: false,
    isMostRead: true,
  },
  {
    id: "8",
    title: "Renewable Energy Investment Surpasses Fossil Fuels for First Time",
    slug: "renewable-energy-investment-surpasses-fossil",
    excerpt:
      "Global clean energy spending hits $1.8 trillion as solar and wind projects accelerate in Asia, Europe, and North America.",
    category: "business",
    image: "/placeholder-news.jpg",
    author: "James Whitfield",
    publishedAt: "2026-06-24T10:15:00Z",
    viewCount: 33100,
    isHot: true,
    isFeatured: false,
    isMostRead: false,
  },
  {
    id: "9",
    title: "NATO Allies Announce Expanded Cyber Defense Framework",
    slug: "nato-cyber-defense-framework",
    excerpt:
      "Member states agree on shared protocols to counter state-sponsored attacks targeting energy grids and financial systems.",
    category: "world",
    image: "/placeholder-news.jpg",
    author: "Sarah Mitchell",
    publishedAt: "2026-06-24T09:00:00Z",
    viewCount: 27800,
    isHot: false,
    isFeatured: false,
    isMostRead: false,
  },
  {
    id: "10",
    title: "AI Assistants in Classrooms: Promise or Peril for Education?",
    slug: "ai-assistants-classrooms-education",
    excerpt:
      "School districts pilot intelligent tutoring tools while teachers and parents debate appropriate boundaries for machine-led learning.",
    category: "technology",
    image: "/placeholder-news.jpg",
    author: "David Chen",
    publishedAt: "2026-06-23T20:00:00Z",
    viewCount: 36500,
    isHot: false,
    isFeatured: false,
    isMostRead: true,
  },
  {
    id: "11",
    title: "Election Reform Proposals Gain Momentum in Key Swing States",
    slug: "election-reform-swing-states",
    excerpt:
      "Bipartisan groups push for updated voting infrastructure and transparent ballot auditing procedures ahead of the next cycle.",
    category: "politics",
    image: "/placeholder-news.jpg",
    author: "Elena Rodriguez",
    publishedAt: "2026-06-23T17:45:00Z",
    viewCount: 24100,
    isHot: false,
    isFeatured: false,
    isMostRead: false,
  },
  {
    id: "12",
    title: "Community Gardens Flourish as Cities Rethink Green Space Policy",
    slug: "community-gardens-green-space-policy",
    excerpt:
      "Neighborhood-led initiatives transform vacant lots into productive gardens, addressing food access and urban heat islands.",
    category: "society",
    image: "/placeholder-news.jpg",
    author: "Amanda Foster",
    publishedAt: "2026-06-23T15:30:00Z",
    viewCount: 12800,
    isHot: false,
    isFeatured: false,
    isMostRead: false,
  },
  {
    id: "13",
    title: "Major Museums Digitize Collections for Global Public Access",
    slug: "museums-digitize-collections-access",
    excerpt:
      "Institutions launch open digital archives, allowing scholars and enthusiasts to explore centuries of art and artifacts online.",
    category: "culture",
    image: "/placeholder-news.jpg",
    author: "Thomas Berger",
    publishedAt: "2026-06-23T13:00:00Z",
    viewCount: 9600,
    isHot: false,
    isFeatured: false,
    isMostRead: false,
  },
  {
    id: "14",
    title: "Supply Chain Shifts Reshape Global Manufacturing Hubs",
    slug: "supply-chain-manufacturing-hubs",
    excerpt:
      "Companies diversify production locations as geopolitical tensions and logistics costs drive a new era of regionalization.",
    category: "business",
    image: "/placeholder-news.jpg",
    author: "James Whitfield",
    publishedAt: "2026-06-23T11:00:00Z",
    viewCount: 21400,
    isHot: false,
    isFeatured: false,
    isMostRead: false,
  },
  {
    id: "15",
    title: "Refugee Resettlement Programs Face Funding Shortfalls",
    slug: "refugee-resettlement-funding-shortfalls",
    excerpt:
      "Humanitarian agencies warn that reduced international aid could leave thousands without housing and employment support.",
    category: "world",
    image: "/placeholder-news.jpg",
    author: "Sarah Mitchell",
    publishedAt: "2026-06-22T19:00:00Z",
    viewCount: 17200,
    isHot: false,
    isFeatured: false,
    isMostRead: false,
  },
  {
    id: "16",
    title: "Next-Generation Batteries Could Double Electric Vehicle Range",
    slug: "next-gen-batteries-ev-range",
    excerpt:
      "Solid-state prototypes show promising results in lab tests, with automakers racing to bring commercial models to market by 2028.",
    category: "technology",
    image: "/placeholder-news.jpg",
    author: "David Chen",
    publishedAt: "2026-06-22T16:30:00Z",
    viewCount: 29800,
    isHot: false,
    isFeatured: false,
    isMostRead: false,
  },
  {
    id: "17",
    title: "Mental Health Services Expand in Rural Communities",
    slug: "mental-health-rural-communities",
    excerpt:
      "Telehealth platforms and mobile clinics aim to close the care gap for residents far from urban medical centers.",
    category: "society",
    image: "/placeholder-news.jpg",
    author: "Amanda Foster",
    publishedAt: "2026-06-22T14:00:00Z",
    viewCount: 11500,
    isHot: false,
    isFeatured: false,
    isMostRead: false,
  },
  {
    id: "18",
    title: "The Case for Slow Journalism in an Age of Instant Updates",
    slug: "slow-journalism-instant-updates",
    excerpt:
      "Editors argue that depth and context matter more than ever when news cycles compress complex stories into fleeting headlines.",
    category: "opinion",
    image: "/placeholder-news.jpg",
    author: "Margaret Hayes",
    publishedAt: "2026-06-22T10:00:00Z",
    viewCount: 8900,
    isHot: false,
    isFeatured: false,
    isMostRead: false,
  },
  {
    id: "19",
    title: "Photo Essay: Life Along the World's Changing Coastlines",
    slug: "photo-essay-changing-coastlines",
    excerpt:
      "A visual journey through communities adapting to rising seas, from reinforced seawalls to floating neighborhoods.",
    category: "multimedia",
    image: "/placeholder-news.jpg",
    author: "Photo Desk",
    publishedAt: "2026-06-21T18:00:00Z",
    viewCount: 25600,
    isHot: false,
    isFeatured: false,
    isMostRead: false,
  },
  {
    id: "20",
    title: "Documentary Explores the Human Side of Space Exploration",
    slug: "documentary-human-side-space",
    excerpt:
      "Filmmakers follow astronaut crews through training, launch, and return — revealing the personal toll of reaching for the stars.",
    category: "multimedia",
    image: "/placeholder-news.jpg",
    author: "Video Desk",
    publishedAt: "2026-06-21T12:00:00Z",
    viewCount: 19300,
    isHot: false,
    isFeatured: false,
    isMostRead: false,
  },
  {
    id: "21",
    title: "Trade Ministers Meet to Resolve Tariff Disputes Before Deadline",
    slug: "trade-ministers-tariff-disputes",
    excerpt:
      "Negotiators from major economies seek a framework agreement as export-dependent industries warn of supply chain disruptions.",
    category: "world",
    image: "/placeholder-news.jpg",
    author: "Sarah Mitchell",
    publishedAt: "2026-06-25T05:00:00Z",
    viewCount: 16800,
    isHot: true,
    isFeatured: false,
    isMostRead: false,
  },
  {
    id: "22",
    title: "Startup Funding Slows as Investors Demand Path to Profitability",
    slug: "startup-funding-slows-profitability",
    excerpt:
      "Venture capital firms tighten due diligence, shifting focus from growth-at-all-costs to sustainable business models.",
    category: "business",
    image: "/placeholder-news.jpg",
    author: "James Whitfield",
    publishedAt: "2026-06-24T08:00:00Z",
    viewCount: 14200,
    isHot: false,
    isFeatured: false,
    isMostRead: false,
  },
  {
    id: "23",
    title: "New Open-Source AI Model Challenges Proprietary Systems",
    slug: "open-source-ai-model-challenge",
    excerpt:
      "A consortium of universities releases a competitive language model, sparking debate over open research versus commercial control.",
    category: "technology",
    image: "/placeholder-news.jpg",
    author: "David Chen",
    publishedAt: "2026-06-24T07:00:00Z",
    viewCount: 26700,
    isHot: true,
    isFeatured: false,
    isMostRead: false,
  },
  {
    id: "24",
    title: "Public Transit Ridership Rebounds in Major Cities",
    slug: "public-transit-ridership-rebounds",
    excerpt:
      "Metro systems report increased passenger numbers as employers adopt hybrid work policies and fuel costs remain elevated.",
    category: "society",
    image: "/placeholder-news.jpg",
    author: "Amanda Foster",
    publishedAt: "2026-06-23T09:00:00Z",
    viewCount: 9800,
    isHot: false,
    isFeatured: false,
    isMostRead: false,
  },
  {
    id: "25",
    title: "Senate Committee Advances Infrastructure Spending Package",
    slug: "senate-infrastructure-spending-package",
    excerpt:
      "The bipartisan bill allocates funds for roads, bridges, and broadband expansion with votes expected before recess.",
    category: "politics",
    image: "/placeholder-news.jpg",
    author: "Elena Rodriguez",
    publishedAt: "2026-06-25T04:00:00Z",
    viewCount: 19500,
    isHot: true,
    isFeatured: false,
    isMostRead: false,
  },
];

export const trendingTopics: TrendingTopic[] = [
  {
    id: "t1",
    title: "Global Economy",
    slug: "global-economy",
    description:
      "Trade shifts, inflation trends, and central bank policy moves shaping markets worldwide.",
  },
  {
    id: "t2",
    title: "AI Regulation",
    slug: "ai-regulation",
    description:
      "Governments draft new rules for artificial intelligence as industry leaders call for balanced oversight.",
  },
  {
    id: "t3",
    title: "Climate Policy",
    slug: "climate-policy",
    description:
      "Carbon pricing, renewable targets, and international agreements driving the green transition.",
  },
  {
    id: "t4",
    title: "Digital Society",
    slug: "digital-society",
    description:
      "How connectivity, platforms, and data reshape work, education, and civic participation.",
  },
];

export const multimediaItems: MultimediaItem[] = [
  {
    id: "m1",
    title: "Inside the Arctic Research Stations",
    slug: "arctic-research-stations",
    type: "photo",
    image: "/placeholder-news.jpg",
  },
  {
    id: "m2",
    title: "Election Night: A Visual Timeline",
    slug: "election-night-visual-timeline",
    type: "visual",
    image: "/placeholder-news.jpg",
  },
  {
    id: "m3",
    title: "The Future of Urban Transit",
    slug: "future-urban-transit",
    type: "video",
    image: "/placeholder-news.jpg",
    duration: "12:34",
  },
  {
    id: "m4",
    title: "Portraits of Small-Town America",
    slug: "portraits-small-town-america",
    type: "photo",
    image: "/placeholder-news.jpg",
  },
  {
    id: "m5",
    title: "Climate Data: Charts That Tell the Story",
    slug: "climate-data-charts",
    type: "visual",
    image: "/placeholder-news.jpg",
  },
  {
    id: "m6",
    title: "Behind the Scenes at a Newsroom",
    slug: "behind-scenes-newsroom",
    type: "video",
    image: "/placeholder-news.jpg",
    duration: "8:15",
  },
];

export function getFeaturedArticle(): Article | undefined {
  return articles.find((a) => a.isFeatured);
}

export function getHotArticles(): Article[] {
  return articles.filter((a) => a.isHot);
}

export function getMostReadArticles(limit = 8): Article[] {
  return [...articles]
    .filter((a) => a.isMostRead)
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, limit);
}

export function getArticlesByCategory(category: string, limit?: number): Article[] {
  const filtered = articles.filter((a) => a.category === category);
  return limit ? filtered.slice(0, limit) : filtered;
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getRelatedArticles(article: Article, limit = 4): Article[] {
  return articles
    .filter((a) => a.category === article.category && a.id !== article.id)
    .slice(0, limit);
}

export function searchArticles(query: string): Article[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return articles.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q) ||
      a.author.toLowerCase().includes(q),
  );
}

export function getCategoryFeaturedArticle(category: string): Article | undefined {
  const categoryArticles = getArticlesByCategory(category);
  return (
    categoryArticles.find((a) => a.isFeatured) ??
    categoryArticles.sort((a, b) => b.viewCount - a.viewCount)[0]
  );
}

export function getHeroThumbArticles(): Article[] {
  const featured = getFeaturedArticle();
  return articles
    .filter((a) => a.id !== featured?.id && !a.isFeatured)
    .slice(0, 3);
}

export function getHeroHeadlineArticles(): Article[] {
  const featured = getFeaturedArticle();
  const usedIds = new Set([
    featured?.id,
    ...getHeroThumbArticles().map((a) => a.id),
  ]);
  return articles.filter((a) => !usedIds.has(a.id)).slice(0, 4);
}

export function getEditorsPicks(limit = 4): Article[] {
  return articles.filter((a) => a.category === "opinion").slice(0, limit);
}

export function getQuickNewsArticles(): Article[] {
  const featured = getFeaturedArticle();
  const used = new Set([
    featured?.id,
    ...getHeroThumbArticles().map((a) => a.id),
    ...getHeroHeadlineArticles().map((a) => a.id),
  ]);
  return articles.filter((a) => !used.has(a.id)).slice(0, 4);
}

/** @deprecated Use getHeroThumbArticles + getHeroHeadlineArticles */
export function getHeroSideArticles(): Article[] {
  return getHeroThumbArticles();
}
