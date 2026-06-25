import { formatDate } from "@/lib/utils";
import Link from "next/link";

const topLinks = [
  { label: "Media", href: "#" },
  { label: "Print Edition", href: "#" },
  { label: "Contact", href: "#" },
  { label: "Newsletter", href: "#" },
];

export default function TopBar() {
  return (
    <div className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex h-7 max-w-[1280px] items-center justify-between px-3 text-[11px] text-neutral-500 sm:px-4">
        <time dateTime={new Date().toISOString()} className="truncate font-sans font-medium">
          {formatDate(new Date())}
        </time>
        <nav className="flex shrink-0 items-center gap-3 sm:gap-4">
          {topLinks.map((link, i) => (
            <span key={link.label} className="flex items-center gap-3 sm:gap-4">
              {i > 0 && <span className="text-neutral-300">|</span>}
              <Link
                href={link.href}
                className="whitespace-nowrap transition-colors hover:text-brand-800"
              >
                {link.label}
              </Link>
            </span>
          ))}
        </nav>
      </div>
    </div>
  );
}
