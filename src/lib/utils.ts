export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function formatShortDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

/** Relative time for article lists, e.g. "21 hours ago" or "Jun 27, 2026 10:45" */
export function formatArticleTimestamp(date: string | Date): string {
  const published = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - published.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours >= 0 && diffHours < 24) {
    const hours = Math.max(diffHours, 1);
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(published);
}

export function formatViewCount(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return count.toString();
}

export function categoryLabel(slug: string): string {
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

export function articlePath(slug: string): string {
  return `/article/${slug}`;
}

export function categoryPath(slug: string): string {
  return `/category/${slug}`;
}

export function searchPath(query: string): string {
  return `/search?q=${encodeURIComponent(query.trim())}`;
}

const GRADIENT_MAP: Record<string, string> = {
  world: "from-slate-700 via-slate-600 to-slate-800",
  politics: "from-red-900 via-red-800 to-red-950",
  business: "from-emerald-800 via-emerald-700 to-teal-900",
  technology: "from-indigo-800 via-blue-800 to-indigo-950",
  society: "from-amber-800 via-orange-800 to-amber-950",
  culture: "from-purple-800 via-violet-800 to-purple-950",
  opinion: "from-neutral-700 via-neutral-600 to-neutral-800",
  multimedia: "from-rose-800 via-pink-900 to-rose-950",
};

export function articleGradient(category: string): string {
  return GRADIENT_MAP[category] ?? "from-neutral-700 to-neutral-900";
}
