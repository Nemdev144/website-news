import type { Article } from "@/types/news";
import { articleHasCover } from "@/lib/article-image";
import {
  articleGradient,
  articlePath,
  categoryLabel,
  cn,
  formatShortDate,
  formatViewCount,
} from "@/lib/utils";
import Link from "next/link";

interface NewsCardProps {
  article: Article;
  variant?:
    | "default"
    | "compact"
    | "horizontal"
    | "overlay"
    | "hero-lead"
    | "lead"
    | "headline"
    | "headline-compact"
    | "mini"
    | "stacked"
    | "category-grid"
    | "category-featured"
    | "category-row";
  showExcerpt?: boolean;
  className?: string;
}

export function ArticleImage({
  article,
  className,
  showBadge = true,
}: {
  article: Article;
  className?: string;
  showBadge?: boolean;
}) {
  const initial = categoryLabel(article.category).charAt(0);
  const hasImage = articleHasCover(article);

  return (
    <div
      className={cn(
        "news-card-media relative overflow-hidden bg-neutral-200",
        !hasImage && `bg-gradient-to-br ${articleGradient(article.category)}`,
        className,
      )}
      aria-hidden
    >
      {hasImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={article.image}
          alt={article.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      ) : (
        <>
          <div
            className="absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)",
              backgroundSize: "12px 12px",
            }}
          />
          <div className="absolute -right-6 -top-6 h-20 w-20 rotate-12 rounded-sm bg-white/10" />
          <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-black/10" />
          <span className="absolute inset-0 flex items-center justify-center font-serif text-5xl font-bold text-white/15 select-none">
            {initial}
          </span>
        </>
      )}
      {showBadge && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-2 pb-1 pt-5">
          <span className="font-sans text-[9px] font-bold uppercase tracking-wider text-white/95">
            {categoryLabel(article.category)}
          </span>
        </div>
      )}
    </div>
  );
}

export default function NewsCard({
  article,
  variant = "default",
  showExcerpt = true,
  className,
}: NewsCardProps) {
  if (variant === "hero-lead") {
    return (
      <Link href={articlePath(article.slug)} className={cn("group block", className)}>
        <ArticleImage article={article} className="aspect-[16/9] w-full sm:aspect-[2/1]" />
        <div className="mt-2 border-l-2 border-brand-800 pl-2.5">
          <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-brand-800">
            {categoryLabel(article.category)}
          </span>
          <h2 className="mt-0.5 font-serif text-lg font-bold leading-snug text-neutral-900 transition-colors group-hover:text-brand-800 sm:text-xl">
            {article.title}
          </h2>
          {showExcerpt && (
            <p className="mt-1 line-clamp-2 font-sans text-xs leading-relaxed text-neutral-600">
              {article.excerpt}
            </p>
          )}
          <ArticleMeta article={article} />
        </div>
      </Link>
    );
  }

  if (variant === "headline-compact") {
    return (
      <Link
        href={articlePath(article.slug)}
        className={cn(
          "group flex items-start gap-1.5 border-b border-dotted border-neutral-200 py-1.5 last:border-0",
          className,
        )}
      >
        <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-brand-800" />
        <h3 className="line-clamp-2 font-serif text-[12px] font-bold leading-snug text-neutral-900 transition-colors group-hover:text-brand-800">
          {article.title}
        </h3>
      </Link>
    );
  }

  if (variant === "headline") {
    return (
      <Link
        href={articlePath(article.slug)}
        className={cn(
          "group flex items-start gap-1.5 border-b border-dotted border-neutral-200 py-1.5 last:border-0",
          className,
        )}
      >
        <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-brand-800" />
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 font-serif text-[12px] font-bold leading-snug text-neutral-900 transition-colors group-hover:text-brand-800">
            {article.title}
          </h3>
          <p className="mt-0.5 font-sans text-[10px] text-neutral-400">
            {formatShortDate(article.publishedAt)}
          </p>
        </div>
      </Link>
    );
  }

  if (variant === "stacked") {
    return (
      <Link
        href={articlePath(article.slug)}
        className={cn("group flex h-full flex-col", className)}
      >
        <ArticleImage
          article={article}
          showBadge={false}
          className="aspect-[16/10] w-full shrink-0"
        />
        <div className="flex min-h-0 flex-1 flex-col pt-1.5">
          <h3 className="line-clamp-2 font-serif text-[13px] font-bold leading-snug text-neutral-900 transition-colors group-hover:text-brand-800">
            {article.title}
          </h3>
          <ArticleMeta article={article} compact className="mt-auto pt-1" />
        </div>
      </Link>
    );
  }

  if (variant === "mini") {
    return (
      <Link
        href={articlePath(article.slug)}
        className={cn("group block rounded-sm border border-neutral-200 bg-white p-1.5", className)}
      >
        <ArticleImage article={article} showBadge={false} className="aspect-[16/10] w-full" />
        <h3 className="mt-1 line-clamp-2 font-serif text-[11px] font-bold leading-snug text-neutral-900 transition-colors group-hover:text-brand-800">
          {article.title}
        </h3>
        <ArticleMeta article={article} compact />
      </Link>
    );
  }

  if (variant === "lead") {
    return (
      <Link
        href={articlePath(article.slug)}
        className={cn("group flex h-full flex-col", className)}
      >
        <ArticleImage article={article} className="aspect-[16/10] w-full shrink-0" />
        <div className="flex flex-1 flex-col pt-2">
          <h3 className="line-clamp-2 font-serif text-base font-bold leading-snug text-neutral-900 transition-colors group-hover:text-brand-800">
            {article.title}
          </h3>
          <p
            className={cn(
              "mt-1 line-clamp-2 min-h-[2.5rem] font-sans text-[11px] leading-relaxed text-neutral-600",
              !showExcerpt && "invisible",
            )}
          >
            {showExcerpt && article.excerpt ? article.excerpt : "\u00A0"}
          </p>
          <ArticleMeta article={article} className="mt-auto pt-2" />
        </div>
      </Link>
    );
  }

  if (variant === "overlay") {
    return (
      <Link
        href={articlePath(article.slug)}
        className={cn("group relative block h-full min-h-[220px] overflow-hidden", className)}
      >
        <ArticleImage
          article={article}
          showBadge={false}
          className="absolute inset-0 h-full w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-2.5 sm:p-3">
          <span className="font-sans text-[9px] font-bold uppercase tracking-wider text-brand-200">
            {categoryLabel(article.category)}
          </span>
          <h3 className="mt-0.5 line-clamp-2 font-serif text-sm font-bold leading-snug text-white transition-colors group-hover:text-brand-200 sm:text-base">
            {article.title}
          </h3>
          {showExcerpt && (
            <p className="mt-0.5 line-clamp-2 font-sans text-[11px] leading-relaxed text-neutral-300">
              {article.excerpt}
            </p>
          )}
          <ArticleMeta article={article} light />
        </div>
      </Link>
    );
  }

  if (variant === "horizontal") {
    return (
      <Link
        href={articlePath(article.slug)}
        className={cn(
          "group flex gap-2 border-b border-neutral-100 py-1.5 last:border-0",
          className,
        )}
      >
        <ArticleImage article={article} showBadge={false} className="h-[58px] w-[84px] shrink-0" />
        <div className="min-w-0 flex-1 py-0.5">
          <span className="font-sans text-[9px] font-bold uppercase tracking-wider text-brand-800">
            {categoryLabel(article.category)}
          </span>
          <h3 className="line-clamp-2 font-serif text-[12px] font-bold leading-snug text-neutral-900 transition-colors group-hover:text-brand-800">
            {article.title}
          </h3>
          <ArticleMeta article={article} compact />
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link href={articlePath(article.slug)} className={cn("group block", className)}>
        <ArticleImage article={article} className="aspect-[16/10] w-full" />
        <h3 className="mt-1 line-clamp-2 font-serif text-xs font-bold leading-snug text-neutral-900 transition-colors group-hover:text-brand-800">
          {article.title}
        </h3>
        <ArticleMeta article={article} compact />
      </Link>
    );
  }

  if (variant === "category-grid") {
    return (
      <Link
        href={articlePath(article.slug)}
        className={cn(
          "group flex h-full flex-col gap-1.5 rounded-sm border border-neutral-200 bg-white p-2 transition-colors hover:border-neutral-300 hover:shadow-sm",
          className,
        )}
      >
        <ArticleImage
          article={article}
          showBadge={false}
          className="aspect-[3/2] w-full shrink-0 rounded-sm"
        />
        <h3 className="line-clamp-2 font-serif text-[13px] font-bold leading-snug text-neutral-900 transition-colors group-hover:text-brand-800">
          {article.title}
        </h3>
        <ArticleMeta article={article} compact className="mt-auto" />
      </Link>
    );
  }

  if (variant === "category-featured") {
    return (
      <Link
        href={articlePath(article.slug)}
        className={cn(
          "group flex gap-3 rounded-sm border border-neutral-200 bg-white p-3 transition-colors hover:border-neutral-300 hover:shadow-sm sm:gap-4",
          className,
        )}
      >
        <ArticleImage
          article={article}
          showBadge={false}
          className="h-[72px] w-[108px] shrink-0 rounded-sm sm:h-20 sm:w-32"
        />
        <div className="min-w-0 flex-1">
          <span className="font-sans text-[9px] font-bold uppercase tracking-wider text-brand-800">
            Featured
          </span>
          <h2 className="mt-0.5 line-clamp-2 font-serif text-base font-bold leading-snug text-neutral-900 transition-colors group-hover:text-brand-800 sm:text-lg">
            {article.title}
          </h2>
          {showExcerpt && article.excerpt && (
            <p className="mt-1 line-clamp-2 font-sans text-xs leading-relaxed text-neutral-600">
              {article.excerpt}
            </p>
          )}
          <ArticleMeta article={article} compact className="mt-1.5" />
        </div>
      </Link>
    );
  }

  if (variant === "category-row") {
    return (
      <Link
        href={articlePath(article.slug)}
        className={cn(
          "group flex gap-2.5 border-b border-neutral-100 py-2 last:border-0",
          className,
        )}
      >
        <ArticleImage
          article={article}
          showBadge={false}
          className="h-14 w-[4.5rem] shrink-0 rounded-sm"
        />
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 font-serif text-[13px] font-bold leading-snug text-neutral-900 transition-colors group-hover:text-brand-800">
            {article.title}
          </h3>
          <ArticleMeta article={article} compact className="mt-0.5" />
        </div>
      </Link>
    );
  }

  return (
    <Link href={articlePath(article.slug)} className={cn("group flex h-full flex-col", className)}>
      <ArticleImage article={article} className="aspect-[16/10] w-full shrink-0" />
      <div className="flex flex-1 flex-col pt-2">
        <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-brand-800">
          {categoryLabel(article.category)}
        </span>
        <h3 className="mt-0.5 line-clamp-2 font-serif text-sm font-bold leading-snug text-neutral-900 transition-colors group-hover:text-brand-800">
          {article.title}
        </h3>
        <p
          className={cn(
            "mt-1 line-clamp-2 min-h-[2.5rem] font-sans text-xs leading-relaxed text-neutral-600",
            !showExcerpt && "invisible",
          )}
        >
          {showExcerpt && article.excerpt ? article.excerpt : "\u00A0"}
        </p>
        <ArticleMeta article={article} className="mt-auto pt-1" />
      </div>
    </Link>
  );
}

function ArticleMeta({
  article,
  light = false,
  compact = false,
  className,
}: {
  article: Article;
  light?: boolean;
  compact?: boolean;
  className?: string;
}) {
  const textClass = light ? "text-neutral-400" : "text-neutral-400";

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-1.5 font-sans",
        compact ? "mt-0.5 text-[10px]" : "text-[10px]",
        textClass,
        className,
      )}
    >
      <span>{article.author}</span>
      <span>·</span>
      <span>{formatShortDate(article.publishedAt)}</span>
      {!compact && (
        <>
          <span>·</span>
          <span>{formatViewCount(article.viewCount)}</span>
        </>
      )}
    </div>
  );
}
