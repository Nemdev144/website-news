import CategorySection from "@/components/public/CategorySection";
import HomeExtras, { TopicsStrip } from "@/components/public/HomeExtras";
import HeroNews from "@/components/public/HeroNews";
import MultimediaSection from "@/components/public/MultimediaSection";
import PageSidebar from "@/components/public/PageSidebar";
import PublicShell from "@/components/public/PublicShell";
import { fetchHomeData } from "@/lib/api-fetch";
import { getMockHeroFromHome, getMockHomePayload, trendingTopics } from "@/lib/mock-fallback";

export default async function Home() {
  const apiData = await fetchHomeData();
  const data = apiData ?? getMockHomePayload();
  const { featured, thumbArticles, headlineArticles, quickNews } =
    getMockHeroFromHome(data);

  return (
    <PublicShell hotArticles={data.hotArticles}>
      <div className="mx-auto max-w-[1280px] border-x border-neutral-200 bg-white px-3 sm:px-4">
        <div className="grid gap-0 lg:grid-cols-12 lg:gap-4">
          <main className="min-w-0 py-3 lg:col-span-9 lg:border-r lg:border-neutral-100 lg:pr-4">
            <HeroNews
              featured={featured}
              thumbArticles={thumbArticles}
              headlineArticles={headlineArticles}
            />
            <HomeExtras articles={quickNews} />
            <TopicsStrip topics={trendingTopics} />

            <div className="space-y-0 pt-1">
              {data.categorySections.map((section) => (
                <CategorySection
                  key={section.category}
                  category={section.category}
                  articles={section.articles}
                />
              ))}
            </div>
          </main>

          <aside className="min-w-0 py-3 lg:col-span-3">
            <PageSidebar
              mostReadArticles={data.mostReadArticles}
              editorPicksArticles={data.editorPicks}
            />
          </aside>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] border-x border-neutral-200 bg-white">
        <MultimediaSection items={data.multimediaArticles} />
      </div>
    </PublicShell>
  );
}
