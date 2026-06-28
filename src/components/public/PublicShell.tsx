import CategoryNav from "@/components/public/CategoryNav";
import Footer from "@/components/public/Footer";
import Header from "@/components/public/Header";
import HotNewsBar from "@/components/public/HotNewsBar";
import ScrollToTop from "@/components/public/ScrollToTop";
import TopBar from "@/components/public/TopBar";
import { mapArticlesToPublic } from "@/lib/article-mapper";
import { fetchActiveCategoriesForNav, fetchHotArticles } from "@/lib/public-articles";
import type { Article } from "@/types/news";
import type { ReactNode } from "react";

interface PublicShellProps {
  children: ReactNode;
  showHotBar?: boolean;
  hotArticles?: Article[];
}

export default async function PublicShell({
  children,
  showHotBar = true,
  hotArticles,
}: PublicShellProps) {
  let hot: Article[] = hotArticles ?? [];

  if (!hotArticles) {
    try {
      hot = mapArticlesToPublic(await fetchHotArticles());
    } catch {
      hot = [];
    }
  }

  let navCategories: { name: string; slug: string; description: string }[] = [];
  try {
    const rows = await fetchActiveCategoriesForNav();
    navCategories = rows.map((row) => ({
      name: row.name,
      slug: row.slug,
      description: row.description ?? "",
    }));
  } catch {
    navCategories = [];
  }

  return (
    <div className="min-w-0 overflow-x-hidden bg-neutral-100/80">
      <TopBar />
      <Header />
      <CategoryNav categories={navCategories} />
      {showHotBar && <HotNewsBar articles={hot} />}
      {children}
      <Footer categories={navCategories} />
      <ScrollToTop />
    </div>
  );
}
