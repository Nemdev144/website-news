import CategorySection from "@/components/public/CategorySection";
import MultimediaSection from "@/components/public/MultimediaSection";
import type { Article, MultimediaItem } from "@/types/news";

export interface HomeCategorySection {
  category: string;
  categoryName: string;
  articles: Article[];
}

interface HomeCategoryLayoutProps {
  sections: HomeCategorySection[];
  multimediaItems?: MultimediaItem[];
}

export default function HomeCategoryLayout({
  sections,
  multimediaItems = [],
}: HomeCategoryLayoutProps) {
  if (sections.length === 0 && multimediaItems.length === 0) {
    return null;
  }

  const multimediaAfterIndex = Math.min(1, sections.length - 1);

  return (
    <div className="space-y-6 pt-2">
      {sections.map((section, index) => (
        <div key={section.category}>
          <CategorySection
            category={section.category}
            categoryName={section.categoryName}
            articles={section.articles}
            layout="featured"
          />

          {multimediaItems.length > 0 && index === multimediaAfterIndex && (
            <div className="mt-6 overflow-hidden rounded-sm">
              <MultimediaSection items={multimediaItems} />
            </div>
          )}
        </div>
      ))}

      {multimediaItems.length > 0 && sections.length === 0 && (
        <div className="overflow-hidden rounded-sm">
          <MultimediaSection items={multimediaItems} />
        </div>
      )}

      {multimediaItems.length > 0 &&
        sections.length > 0 &&
        multimediaAfterIndex >= sections.length && (
          <div className="overflow-hidden rounded-sm">
            <MultimediaSection items={multimediaItems} />
          </div>
        )}
    </div>
  );
}
