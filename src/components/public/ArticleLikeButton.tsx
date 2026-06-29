"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { cn, formatViewCount } from "@/lib/utils";

interface ArticleLikeButtonProps {
  slug: string;
  initialLikeCount: number;
}

export default function ArticleLikeButton({
  slug,
  initialLikeCount,
}: ArticleLikeButtonProps) {
  const storageKey = `liked-article:${slug}`;
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [liked, setLiked] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLiked(localStorage.getItem(storageKey) === "true");
  }, [storageKey]);

  async function handleLike() {
    if (liked || saving) return;

    setSaving(true);
    setLikeCount((value) => value + 1);
    setLiked(true);
    localStorage.setItem(storageKey, "true");

    try {
      const response = await fetch(`/api/public/articles/${slug}/like`, {
        method: "POST",
      });
      const data = (await response.json()) as {
        likeCount?: number;
        error?: string;
      };

      if (!response.ok || typeof data.likeCount !== "number") {
        throw new Error(data.error ?? "Failed to like article");
      }

      setLikeCount(data.likeCount);
    } catch {
      localStorage.removeItem(storageKey);
      setLiked(false);
      setLikeCount((value) => Math.max(value - 1, initialLikeCount));
    } finally {
      setSaving(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLike}
      disabled={liked || saving}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
        liked
          ? "border-red-200 bg-red-50 text-red-700"
          : "border-neutral-300 bg-white text-neutral-700 hover:border-red-200 hover:bg-red-50 hover:text-red-700",
      )}
      title={liked ? "You liked this article" : "Like this article"}
    >
      <Heart className={cn("h-4 w-4", liked && "fill-current")} />
      {formatViewCount(likeCount)} likes
    </button>
  );
}
