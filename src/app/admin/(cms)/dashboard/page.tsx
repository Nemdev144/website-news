import { ArticleStatus } from "@/generated/prisma/client";
import ArticleRankList from "@/components/admin/dashboard/ArticleRankList";
import StatCard from "@/components/admin/dashboard/StatCard";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import { AdminButtonLink } from "@/components/admin/ui/AdminButton";
import { prisma } from "@/lib/prisma";
import { formatViewCount } from "@/lib/utils";
import { Eye, FileText, PenLine, Plus, TrendingUp } from "lucide-react";

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
      <AdminPageHeader
        title="Tổng quan"
        description="Theo dõi bài viết, lượt xem và hoạt động xuất bản."
        actions={
          <>
            <AdminButtonLink href="/admin/articles/new" variant="primary">
              <Plus className="h-4 w-4" />
              Viết bài mới
            </AdminButtonLink>
            <AdminButtonLink href="/admin/articles" variant="secondary">
              Quản lý bài viết
            </AdminButtonLink>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Tổng bài viết"
          value={totalArticles}
          hint={`${publishRate}% đã xuất bản`}
          icon={FileText}
          tone="brand"
        />
        <StatCard
          label="Đã xuất bản"
          value={publishedArticles}
          hint={`${publishedThisWeek} bài tuần này`}
          icon={TrendingUp}
          tone="green"
        />
        <StatCard
          label="Bản nháp"
          value={draftArticles}
          hint="Cần chỉnh sửa hoặc duyệt"
          icon={PenLine}
          tone="amber"
        />
        <StatCard
          label="Lượt xem"
          value={formatViewCount(totalViews)}
          hint="Tổng tất cả bài viết"
          icon={Eye}
          tone="blue"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ArticleRankList
          title="Bài viết mới nhất"
          subtitle="Mới tạo hoặc cập nhật gần đây"
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
          title="Đọc nhiều nhất"
          subtitle="Xếp theo lượt xem"
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
