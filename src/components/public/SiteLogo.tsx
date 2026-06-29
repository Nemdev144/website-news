import { SITE_ICON_PATH, SITE_LOGO_PATH, SITE_NAME, SITE_TAGLINE } from "@/lib/site";
import { cn } from "@/lib/utils";
import Link from "next/link";

const variantClasses = {
  logo: "h-16 w-auto sm:h-20",
  footer: "h-14 w-auto sm:h-16",
  login: "mx-auto h-20 w-auto sm:h-24",
  mark: "h-14 w-14 object-contain object-center sm:h-[4.25rem] sm:w-[4.25rem]",
  admin: "h-10 w-10 shrink-0 object-contain object-center",
} as const;

interface SiteLogoProps {
  variant?: keyof typeof variantClasses;
  href?: string;
  linked?: boolean;
  className?: string;
  priority?: boolean;
}

export default function SiteLogo({
  variant = "logo",
  href = "/",
  linked = true,
  className,
  priority = false,
}: SiteLogoProps) {
  const isMark = variant === "mark" || variant === "admin";
  const src = isMark ? SITE_ICON_PATH : SITE_LOGO_PATH;

  const image = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={isMark ? `${SITE_NAME} icon` : SITE_NAME}
      width={isMark ? 112 : 480}
      height={isMark ? 112 : 180}
      decoding="async"
      fetchPriority={priority ? "high" : undefined}
      className={cn(variantClasses[variant], className)}
    />
  );

  if (!linked) {
    return image;
  }

  return (
    <Link href={href} className="inline-flex shrink-0 items-center">
      {image}
    </Link>
  );
}

type WordmarkSize = "header" | "footer" | "login" | "admin";
type WordmarkTone = "light" | "dark";

function BrandWordmark({
  size = "header",
  tone = "light",
  showTagline = true,
  className,
}: {
  size?: WordmarkSize;
  tone?: WordmarkTone;
  showTagline?: boolean;
  className?: string;
}) {
  const titleClass = {
    header: "text-[1.65rem] sm:text-[2.125rem]",
    footer: "text-xl sm:text-2xl",
    login: "text-3xl sm:text-4xl",
    admin: "text-[1.05rem] sm:text-lg",
  }[size];

  const taglineClass = {
    header: "text-[10px] sm:text-[11px]",
    footer: "text-[10px]",
    login: "text-xs",
    admin: "text-[8px] sm:text-[9px]",
  }[size];

  const theClass = tone === "dark" ? "text-white" : "text-[#1a2744]";
  const heraldClass = tone === "dark" ? "text-brand-300" : "text-brand-800";
  const taglineColor =
    tone === "dark" ? "text-neutral-500" : "text-[#1a2744]/85";

  return (
    <div className={cn("min-w-0 leading-none", className)}>
      <span
        className={cn(
          "font-serif font-bold tracking-tight",
          theClass,
          titleClass,
        )}
      >
        the
        <span className={heraldClass}>herald</span>
      </span>
      {showTagline && (
        <p
          className={cn(
            "mt-1.5 text-center font-sans font-semibold uppercase tracking-[0.2em]",
            taglineColor,
            taglineClass,
            size === "admin" && "mt-1 tracking-[0.16em]",
          )}
        >
          {SITE_TAGLINE}
        </p>
      )}
    </div>
  );
}

export function HeaderBrand() {
  return (
    <Link
      href="/"
      className="group flex shrink-0 items-center gap-1 sm:gap-1.5"
    >
      <SiteLogo variant="mark" linked={false} priority />
      <BrandWordmark size="header" />
    </Link>
  );
}

export function FooterBrand() {
  return (
    <Link href="/" className="group inline-flex items-center gap-1 sm:gap-1.5">
      <SiteLogo
        variant="mark"
        linked={false}
        className="h-12 w-12 sm:h-14 sm:w-14"
      />
      <BrandWordmark size="footer" />
    </Link>
  );
}

export function LoginBrand() {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <SiteLogo
        variant="mark"
        linked={false}
        priority
        className="h-16 w-16 sm:h-20 sm:w-20"
      />
      <BrandWordmark size="login" tone="dark" className="text-center" />
    </div>
  );
}

export function AdminSidebarBrand({
  collapsed = false,
  onNavigate,
}: {
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  if (collapsed) {
    return (
      <Link
        href="/admin/dashboard"
        className="mx-auto flex justify-center"
        onClick={onNavigate}
        title={SITE_NAME}
      >
        <SiteLogo variant="admin" linked={false} />
      </Link>
    );
  }

  return (
    <Link
      href="/admin/dashboard"
      className="inline-flex min-w-0 items-center gap-1"
      onClick={onNavigate}
    >
      <SiteLogo variant="admin" linked={false} />
      <div className="min-w-0">
        <BrandWordmark size="admin" tone="dark" showTagline={false} />
        <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
          CMS
        </p>
      </div>
    </Link>
  );
}

export function AdminHeaderBrand() {
  return (
    <Link
      href="/admin/dashboard"
      className="hidden min-w-0 items-center gap-1 sm:inline-flex"
    >
      <SiteLogo variant="admin" linked={false} className="h-8 w-8" />
      <BrandWordmark size="admin" showTagline={false} />
      <span className="ml-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
        CMS
      </span>
    </Link>
  );
}
