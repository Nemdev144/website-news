import type { MultimediaItem } from "@/types/news";
import { articleGradient, cn } from "@/lib/utils";
import { Camera, Film, LayoutGrid, Play } from "lucide-react";
import Link from "next/link";

interface MultimediaSectionProps {
  items: MultimediaItem[];
}

const typeConfig = {
  photo: { label: "Photo", icon: Camera },
  video: { label: "Video", icon: Film },
  visual: { label: "Visual", icon: LayoutGrid },
};

export default function MultimediaSection({ items }: MultimediaSectionProps) {
  const [featured, ...rest] = items;

  return (
    <section id="multimedia" className="scroll-mt-[88px] border-t-4 border-brand-800 bg-neutral-900 px-3 py-4 text-white sm:px-4">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-sans text-xs font-bold uppercase tracking-wider">Multimedia</h2>
          <Link
            href="#multimedia"
            className="text-[11px] font-semibold text-brand-300 transition-colors hover:text-white"
          >
            View all →
          </Link>
        </div>

        <div className="grid gap-2 lg:grid-cols-12">
          {/* Featured large card */}
          {featured && (
            <Link
              href={`#${featured.slug}`}
              className="group relative overflow-hidden lg:col-span-5"
            >
              <div
                className={cn(
                  "aspect-[16/9] bg-gradient-to-br lg:aspect-auto lg:h-[140px]",
                  articleGradient("multimedia"),
                )}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute left-2 top-2 flex items-center gap-1 bg-brand-800 px-1.5 py-0.5 text-[9px] font-bold uppercase">
                {typeConfig[featured.type].label}
              </div>
              {featured.type === "video" && featured.duration && (
                <div className="absolute right-2 top-2 flex items-center gap-0.5 bg-black/60 px-1.5 py-0.5 text-[10px]">
                  <Play className="h-2.5 w-2.5 fill-white" />
                  {featured.duration}
                </div>
              )}
              <div className="absolute bottom-0 p-3">
                <h3 className="text-sm font-bold leading-snug transition-colors group-hover:text-brand-300 sm:text-base">
                  {featured.title}
                </h3>
              </div>
            </Link>
          )}

          {/* Smaller cards grid */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:col-span-7 lg:grid-cols-3">
            {rest.slice(0, 5).map((item) => {
              const config = typeConfig[item.type];
              const Icon = config.icon;

              return (
                <Link
                  key={item.id}
                  href={`#${item.slug}`}
                  className="group relative overflow-hidden"
                >
                  <div
                    className={cn(
                      "aspect-[16/10] bg-gradient-to-br lg:aspect-auto lg:h-[68px]",
                      articleGradient("multimedia"),
                    )}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute left-1.5 top-1.5 flex items-center gap-0.5 bg-black/50 px-1 py-0.5 text-[8px] font-bold uppercase">
                    <Icon className="h-2.5 w-2.5" />
                    {config.label}
                  </div>
                  {item.type === "video" && item.duration && (
                    <div className="absolute right-1.5 top-1.5 text-[9px] text-white/80">
                      {item.duration}
                    </div>
                  )}
                  <div className="absolute bottom-0 p-2">
                    <h3 className="line-clamp-2 text-[11px] font-bold leading-snug transition-colors group-hover:text-brand-300">
                      {item.title}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
    </section>
  );
}
