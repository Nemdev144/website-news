import { parseArticleContent } from "@/lib/article-blocks";

interface ArticleBodyProps {
  content: string;
  legacyMedia?: Array<{
    url: string;
    title?: string | null;
    caption?: string | null;
  }>;
  articleTitle: string;
}

export default function ArticleBody({
  content,
  legacyMedia = [],
  articleTitle,
}: ArticleBodyProps) {
  const blocks = parseArticleContent(content, legacyMedia);
  const firstTextBlockId = blocks.find(
    (block) => block.type === "text" && block.value.trim(),
  )?.id;

  const rendered = blocks
    .map((block, index) => {
      if (block.type === "text") {
        if (!block.value.trim()) return null;
        const isFirstText = block.id === firstTextBlockId;
        return (
          <p
            key={block.id ?? `text-${index}`}
            className={`font-sans leading-relaxed text-neutral-800 ${
              isFirstText ? "text-base font-medium text-neutral-900" : "text-sm"
            }`}
          >
            {block.value}
          </p>
        );
      }

      if (!block.url.trim()) return null;

      return (
        <figure
          key={block.id ?? `image-${index}`}
          className="overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={block.url}
            alt={block.caption || articleTitle}
            className="aspect-[16/10] w-full object-cover"
          />
          {block.caption && (
            <figcaption className="border-t border-neutral-200 px-4 py-3">
              <p className="font-sans text-sm leading-relaxed text-neutral-600">
                {block.caption}
              </p>
            </figcaption>
          )}
        </figure>
      );
    })
    .filter(Boolean);

  if (rendered.length === 0) {
    return null;
  }

  return <div className="prose-news mt-5 space-y-4">{rendered}</div>;
}
