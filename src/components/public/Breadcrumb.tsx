import { cn } from "@/lib/utils";
import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("font-sans text-[11px] text-neutral-500", className)}>
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-1">
            {index > 0 && <span className="text-neutral-300">/</span>}
            {item.href ? (
              <Link href={item.href} className="transition-colors hover:text-brand-800">
                {item.label}
              </Link>
            ) : (
              <span className="line-clamp-1 font-medium text-neutral-700">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
