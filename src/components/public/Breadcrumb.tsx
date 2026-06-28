import { cn } from "@/lib/utils";
import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  bold?: boolean;
}

export default function Breadcrumb({ items, className, bold = false }: BreadcrumbProps) {
  const itemClass = bold
    ? "font-bold text-neutral-900 transition-colors hover:text-brand-800"
    : "transition-colors hover:text-brand-800";

  return (
    <nav aria-label="Breadcrumb" className={cn("font-sans text-[11px] text-neutral-500", className)}>
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-1">
            {index > 0 && (
              <span className={cn("text-neutral-300", bold && "font-bold text-neutral-400")}>
                /
              </span>
            )}
            {item.href ? (
              <Link href={item.href} className={itemClass}>
                {item.label}
              </Link>
            ) : (
              <span className={cn("line-clamp-1", bold ? itemClass : "font-medium text-neutral-700")}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
