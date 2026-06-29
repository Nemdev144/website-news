"use client";

import { ArticleImage } from "@/components/public/NewsCard";
import type { Article } from "@/types/news";
import {
  articlePath,
  categoryLabel,
  cn,
  formatShortDate,
  formatViewCount,
} from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const AUTO_PLAY_MS = 5000;

interface HeroStoryCarouselProps {
  articles: Article[];
  className?: string;
}

export default function HeroStoryCarousel({
  articles,
  className,
}: HeroStoryCarouselProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = articles.length;

  const goTo = useCallback(
    (next: number) => {
      if (count <= 1) return;
      setIndex((next + count) % count);
    },
    [count],
  );

  useEffect(() => {
    setIndex(0);
  }, [articles]);

  useEffect(() => {
    if (count <= 1) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") goTo(index - 1);
      if (event.key === "ArrowRight") goTo(index + 1);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [count, index, goTo]);

  useEffect(() => {
    function onVisibilityChange() {
      setPaused(document.hidden);
    }

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  useEffect(() => {
    if (count <= 1 || paused) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, AUTO_PLAY_MS);

    return () => window.clearInterval(timer);
  }, [count, paused, index]);

  const article = articles[index];
  if (!article) return null;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-sm border border-neutral-200 bg-neutral-950 shadow-sm",
        className,
      )}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      <div className="relative aspect-[16/10] w-full sm:aspect-[5/3] lg:absolute lg:inset-0 lg:aspect-auto lg:h-full">
        <ArticleImage
          key={article.id}
          article={article}
          showBadge={false}
          className="absolute inset-0 h-full w-full"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/10" />

        <Link
          href={articlePath(article.slug)}
          className="group absolute inset-x-0 bottom-0 top-0 flex flex-col justify-end p-4 pb-11 sm:p-5 sm:pb-12"
        >
          <span className="font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-brand-200">
            {categoryLabel(article.category)}
          </span>
          <h2 className="mt-1 line-clamp-3 font-serif text-xl font-bold leading-snug text-white transition-colors group-hover:text-brand-100 sm:text-2xl sm:leading-tight">
            {article.title}
          </h2>
          {article.excerpt && (
            <p className="mt-1.5 line-clamp-2 max-w-2xl font-sans text-xs leading-relaxed text-neutral-300 sm:text-sm">
              {article.excerpt}
            </p>
          )}
          <p className="mt-2 font-sans text-[11px] text-neutral-400">
            {article.author} · {formatShortDate(article.publishedAt)} ·{" "}
            {formatViewCount(article.viewCount)} views
          </p>
        </Link>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              className="absolute left-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white shadow-lg ring-1 ring-white/25 backdrop-blur-sm transition-all hover:scale-105 hover:bg-black/55 sm:left-3 sm:h-10 sm:w-10"
              aria-label="Previous story"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
            </button>

            <button
              type="button"
              onClick={() => goTo(index + 1)}
              className="absolute right-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white shadow-lg ring-1 ring-white/25 backdrop-blur-sm transition-all hover:scale-105 hover:bg-black/55 sm:right-3 sm:h-10 sm:w-10"
              aria-label="Next story"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
            </button>

            <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-between gap-3 px-4 pb-3 sm:px-5 sm:pb-4">
              <div className="flex items-center gap-1.5">
                {articles.map((item, i) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Story ${i + 1}: ${item.title}`}
                    aria-current={i === index ? "true" : undefined}
                    className={cn(
                      "h-1 rounded-full transition-all duration-300",
                      i === index
                        ? "w-6 bg-white shadow-sm"
                        : "w-2 bg-white/40 hover:bg-white/70",
                    )}
                  />
                ))}
              </div>
              <span className="font-sans text-[11px] font-medium tabular-nums text-white/75">
                {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
