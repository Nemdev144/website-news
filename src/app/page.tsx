import HomeCategoryLayout from "@/components/public/HomeCategoryLayout";
import HomeExtras from "@/components/public/HomeExtras";
import HeroNews from "@/components/public/HeroNews";
import PageSidebar from "@/components/public/PageSidebar";
import PublicShell from "@/components/public/PublicShell";
import { fetchHomeData } from "@/lib/api-fetch";
import { emptyHomeHero, getHeroFromHome } from "@/lib/home-layout";

export default async function Home() {
  const data = await fetchHomeData();
  const hero = data ? getHeroFromHome(data) : emptyHomeHero();

  return (
    <PublicShell hotArticles={data?.hotArticles ?? []}>
      <div className="mx-auto max-w-[1280px] border-x border-neutral-200 bg-white px-3 sm:px-4">
        <div className="grid gap-0 lg:grid-cols-12 lg:gap-4">
          <main className="min-w-0 py-3 lg:col-span-9 lg:border-r lg:border-neutral-100 lg:pr-4">
            {!data ? (
              <div className="rounded-sm border border-dashed border-neutral-300 bg-neutral-50 px-6 py-16 text-center">
                <p className="font-sans text-sm text-neutral-600">
                  Unable to load homepage content. Please check the database connection.
                </p>
              </div>
            ) : (
              <>
                {hero.carouselArticles.length > 0 && (
                  <HeroNews
                    carouselArticles={hero.carouselArticles}
                    thumbArticles={hero.thumbArticles}
                    headlineArticles={hero.headlineArticles}
                  />
                )}

                {hero.quickNews.length > 0 && (
                  <HomeExtras articles={hero.quickNews} />
                )}

                <HomeCategoryLayout
                  sections={data.categorySections}
                  multimediaItems={data.multimediaArticles}
                />
              </>
            )}
          </main>

          <aside className="min-w-0 py-3 lg:col-span-3">
            <PageSidebar mostReadArticles={data?.mostReadArticles ?? []} />
          </aside>
        </div>
      </div>
    </PublicShell>
  );
}
