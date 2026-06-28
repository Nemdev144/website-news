import ArticleContentRenderer from "@/components/article/ArticleContentRenderer";
import { parseArticleContent } from "@/lib/article-blocks";

interface ArticleBodyProps {
  content: string;
  articleTitle: string;
}

export default function ArticleBody({ content, articleTitle }: ArticleBodyProps) {
  const blocks = parseArticleContent(content);
  const hasContent = blocks.some((block) => {
    if (block.type === "text") return block.value.trim().length > 0;
    return block.url.trim().length > 0;
  });

  if (!hasContent) {
    return null;
  }

  return (
    <div className="prose-news mt-5">
      <ArticleContentRenderer blocks={blocks} articleTitle={articleTitle} />
    </div>
  );
}
