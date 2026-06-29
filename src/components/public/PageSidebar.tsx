import MostRead from "@/components/public/MostRead";
import type { Article } from "@/types/news";

interface PageSidebarProps {
  mostReadLimit?: number;
  mostReadArticles?: Article[];
}

export default function PageSidebar({
  mostReadLimit = 8,
  mostReadArticles = [],
}: PageSidebarProps) {
  const mostRead = mostReadArticles.slice(0, mostReadLimit);

  if (mostRead.length === 0) return null;

  return (
    <div className="space-y-2 lg:sticky lg:top-[88px]">
      <MostRead articles={mostRead} limit={mostReadLimit} />
    </div>
  );
}
