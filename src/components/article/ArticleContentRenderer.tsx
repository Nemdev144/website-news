import ArticleCaption from "@/components/article/ArticleCaption";
import type { ContentBlock } from "@/lib/article-blocks";
import { splitTextIntoSegments } from "@/lib/article-blocks";

interface ArticleContentRendererProps {
  blocks: ContentBlock[];
  articleTitle?: string;
}

export default function ArticleContentRenderer({
  blocks,
  articleTitle = "",
}: ArticleContentRendererProps) {
  let isFirstParagraph = true;

  return (
    <>
      {blocks.flatMap((block, index) => {
        if (block.type === "text") {
          if (!block.value.trim()) return [];

          return splitTextIntoSegments(block.value).flatMap((segment, segmentIndex) => {
            if (segment.type === "gap") {
              return [
                <div
                  key={`${block.id}-gap-${segmentIndex}`}
                  className={
                    segment.size === "wide" ? "article-gap-wide" : "article-gap-normal"
                  }
                  aria-hidden="true"
                />,
              ];
            }

            const isLead = isFirstParagraph;
            isFirstParagraph = false;

            return [
              <p
                key={`${block.id}-p-${segmentIndex}`}
                className={isLead ? "article-lead" : "article-paragraph"}
              >
                {segment.text}
              </p>,
            ];
          });
        }

        if (!block.url.trim()) return [];

        isFirstParagraph = false;

        return [
          <figure key={block.id ?? `image-${index}`} className="article-figure">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={block.url}
              alt={block.caption || articleTitle}
              className="article-figure-image"
            />
            {block.caption && <ArticleCaption text={block.caption} />}
          </figure>,
        ];
      })}
    </>
  );
}
