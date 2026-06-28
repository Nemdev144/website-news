import { formatDate } from "@/lib/utils";

export default function TopBar() {
  return (
    <div className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex h-7 max-w-[1280px] items-center justify-end px-3 text-[11px] text-neutral-500 sm:px-4">
        <time dateTime={new Date().toISOString()} className="truncate font-sans font-medium">
          {formatDate(new Date())}
        </time>
      </div>
    </div>
  );
}
