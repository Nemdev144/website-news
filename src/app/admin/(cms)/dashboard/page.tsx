import { ArticleStatus } from "@/generated/prisma/client";
import ArticleRankList from "@/components/admin/dashboard/ArticleRankList";
import StatCard from "@/components/admin/dashboard/StatCard";
import { prisma } from "@/lib/prisma";
import { formatViewCount } from "@/lib/utils";
import { Eye, FileText, PenLine, TrendingUp } from "lucide-react";
import Link from "next/link";

function startOfWeek(): Date {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? 6 : day - 1;
  const monday = new Date(now);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(now.getDate() - diff);
  return monday;
}

export default async function AdminDashboardPage() {
  const weekStart = startOfWeek();

  const [
    totalArticles,
    publishedArticles,
    draftArticles,
    viewsAggregate,
    publishedThisWeek,
    latestArticles,
    mostReadArticles,
  ] = await Promise.all([
    prisma.article.count(),
    prisma.article.count({ where: { status: ArticleStatus.PUBLISHED } }),
    prisma.article.count({ where: { status: ArticleStatus.DRAFT } }),
    prisma.article.aggregate({ _sum: { viewCount: true } }),
    prisma.article.count({
      where: {
        status: ArticleStatus.PUBLISHED,
        publishedAt: { gte: weekStart },
      },
    }),
    prisma.article.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }),
    prisma.article.findMany({
      take: 5,
      orderBy: { viewCount: "desc" },
      include: { category: true },
    }),
  ]);

  const totalViews = viewsAggregate._sum.viewCount ?? 0;
  const publishRate =
    totalArticles > 0
      ? Math.round((publishedArticles / totalArticles) * 100)
      : 0;

  return (
    <div className="space-y-5">
      <section className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-serif text-xl font-bold text-neutral-900">
            Tổng quan nhanh
          </h2>
          <p className="mt-1 text-sm text-neutral-600">
            Các số liệu chính để theo dõi bài viết và lượt xem.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/articles/new"
            className="rounded-lg bg-brand-800 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-900"
          >
            New Article
          </Link>
          <Link
            href="/admin/articles"
            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
          >
            Manage Articles
          </Link>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Articles"
          value={totalArticles}
          hint={`${publishRate}% published`}
          icon={FileText}
          tone="brand"
        />
        <StatCard
          label="Published"
          value={publishedArticles}
          hint={`${publishedThisWeek} this week`}
          icon={TrendingUp}
          tone="green"
        />
        <StatCard
          label="Drafts"
          value={draftArticles}
          hint="Need editing or review"
          icon={PenLine}
          tone="amber"
        />
        <StatCard
          label="Total Views"
          value={formatViewCount(totalViews)}
          hint="All-time article views"
          icon={Eye}
          tone="blue"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ArticleRankList
          title="Latest Articles"
          subtitle="Most recently created or updated"
          variant="latest"
          items={latestArticles.map((article) => ({
            id: article.id,
            title: article.title,
            categoryName: article.category.name,
            status: article.status,
            publishedAt: article.publishedAt,
          }))}
        />
        <ArticleRankList
          title="Most Read"
          subtitle="Top articles by view count"
          variant="mostRead"
          items={mostReadArticles.map((article) => ({
            id: article.id,
            title: article.title,
            categoryName: article.category.name,
            status: article.status,
            viewCount: article.viewCount,
          }))}
        />
      </div>
    </div>
  );
}
