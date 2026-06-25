import CategoryNav from "@/components/public/CategoryNav";
import Footer from "@/components/public/Footer";
import Header from "@/components/public/Header";
import HotNewsBar from "@/components/public/HotNewsBar";
import TopBar from "@/components/public/TopBar";
import { categories as mockCategories, getHotArticles } from "@/data/mock-news";
import { fetchActiveCategoriesForNav } from "@/lib/public-articles";
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
  const hot = hotArticles ?? getHotArticles();
  let navCategories: { name: string; slug: string; description: string }[] =
    mockCategories.map((category) => ({
      name: category.name,
      slug: category.slug,
      description: category.description,
    }));
  try {
    const rows = await fetchActiveCategoriesForNav();
    if (rows.length > 0) {
      navCategories = rows.map((row) => ({
        name: row.name,
        slug: row.slug,
        description: row.description ?? "",
      }));
    }
  } catch {
    // Fall back to mock categories when the database is unavailable.
  }

  return (
    <div className="min-w-0 overflow-x-hidden bg-neutral-100/80">
      <TopBar />
      <Header />
      <CategoryNav categories={navCategories} />
      {showHotBar && <HotNewsBar articles={hot} />}
      {children}
      <Footer />
    </div>
  );
}
