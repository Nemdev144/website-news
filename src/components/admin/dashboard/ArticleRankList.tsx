import AdminBadge from "@/components/admin/ui/AdminBadge";
import AdminPanel, { AdminPanelHeader } from "@/components/admin/ui/AdminPanel";
import { articleStatusLabel } from "@/lib/admin-labels";
import { ArticleStatus } from "@/types/cms";
import { formatShortDate, formatViewCount } from "@/lib/utils";
import Link from "next/link";

interface ArticleRankItem {
  id: string;
  title: string;
  categoryName: string;
  status: string;
  viewCount?: number;
  publishedAt?: Date | null;
}

interface ArticleRankListProps {
  title: string;
  subtitle?: string;
  items: ArticleRankItem[];
  variant: "latest" | "mostRead";
}

function statusTone(status: string) {
  if (status === ArticleStatus.PUBLISHED) return "green" as const;
  if (status === ArticleStatus.DRAFT) return "amber" as const;
  return "neutral" as const;
}

export default function ArticleRankList({
  title,
  subtitle,
  items,
  variant,
}: ArticleRankListProps) {
  return (
    <AdminPanel>
      <AdminPanelHeader title={title} subtitle={subtitle} />
      {items.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-neutral-500">
          Chưa có dữ liệu.
        </p>
      ) : (
        <ol className="divide-y divide-neutral-100">
          {items.map((article, index) => (
            <li key={article.id} className="flex gap-3 px-4 py-3.5 sm:px-5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-xs font-bold tabular-nums text-neutral-500">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/admin/articles/${article.id}/edit`}
                  className="line-clamp-2 text-sm font-medium text-neutral-900 transition-colors hover:text-brand-800"
                >
                  {article.title}
                </Link>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  <span className="text-xs text-neutral-500">
                    {article.categoryName}
                  </span>
                  <AdminBadge tone={statusTone(article.status)}>
                    {articleStatusLabel(article.status)}
                  </AdminBadge>
                  {variant === "mostRead" && article.viewCount !== undefined && (
                    <span className="text-xs text-neutral-500">
                      {formatViewCount(article.viewCount)} lượt xem
                    </span>
                  )}
                  {variant === "latest" && article.publishedAt && (
                    <span className="text-xs text-neutral-400">
                      {formatShortDate(article.publishedAt)}
                    </span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </AdminPanel>
  );
}
