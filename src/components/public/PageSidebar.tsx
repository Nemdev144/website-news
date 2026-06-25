import EditorsPicks from "@/components/public/EditorsPicks";
import MostRead from "@/components/public/MostRead";
import NewsletterSidebar from "@/components/public/NewsletterSidebar";
import { getEditorsPicks, getMostReadArticles } from "@/data/mock-news";
import type { Article } from "@/types/news";

interface PageSidebarProps {
  mostReadLimit?: number;
  editorsLimit?: number;
  showNewsletter?: boolean;
  showEditorsPicks?: boolean;
  mostReadArticles?: Article[];
  editorPicksArticles?: Article[];
}

export default function PageSidebar({
  mostReadLimit = 8,
  editorsLimit = 5,
  showNewsletter = true,
  showEditorsPicks = true,
  mostReadArticles,
  editorPicksArticles,
}: PageSidebarProps) {
  const mostRead = mostReadArticles ?? getMostReadArticles(10);
  const editorsPicks = editorPicksArticles ?? getEditorsPicks(editorsLimit);

  return (
    <div className="space-y-2 lg:sticky lg:top-[88px]">
      <MostRead articles={mostRead} limit={mostReadLimit} />
      {showEditorsPicks && <EditorsPicks articles={editorsPicks} />}
      {showNewsletter && <NewsletterSidebar />}
    </div>
  );
}
