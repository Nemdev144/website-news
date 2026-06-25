export type CategorySlug =
  | "world"
  | "politics"
  | "business"
  | "technology"
  | "society"
  | "culture"
  | "opinion"
  | "multimedia";

export interface Category {
  name: string;
  slug: CategorySlug;
  description: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: CategorySlug;
  image: string;
  author: string;
  publishedAt: string;
  viewCount: number;
  likeCount?: number;
  isHot: boolean;
  isFeatured: boolean;
  isMostRead: boolean;
}

export interface ArticleDetail extends Article {
  content: string;
  source?: string | null;
  media?: ArticleMediaItem[];
}

export interface ArticleMediaItem {
  id: string;
  url: string;
  title?: string | null;
  caption?: string | null;
}

export interface TrendingTopic {
  id: string;
  title: string;
  slug: string;
  description: string;
}

export interface MultimediaItem {
  id: string;
  title: string;
  slug: string;
  type: "photo" | "video" | "visual";
  image: string;
  duration?: string;
}
