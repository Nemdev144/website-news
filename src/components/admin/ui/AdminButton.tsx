import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-800 text-white hover:bg-brand-900 shadow-sm shadow-brand-900/10",
  secondary:
    "border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50",
  ghost: "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors disabled:opacity-50";

interface AdminButtonProps extends ComponentPropsWithoutRef<"button"> {
  variant?: ButtonVariant;
  children: ReactNode;
}

export function AdminButton({
  variant = "primary",
  className,
  children,
  type = "button",
  ...props
}: AdminButtonProps) {
  return (
    <button
      type={type}
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}

interface AdminButtonLinkProps extends ComponentPropsWithoutRef<typeof Link> {
  variant?: ButtonVariant;
  children: ReactNode;
}

export function AdminButtonLink({
  variant = "primary",
  className,
  children,
  ...props
}: AdminButtonLinkProps) {
  return (
    <Link
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </Link>
  );
}

export function adminInputClassName(className?: string) {
  return cn(
    "w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 transition-[border-color,box-shadow] outline-none focus:border-brand-700 focus:ring-2 focus:ring-brand-800/10",
    className,
  );
}

export function adminSelectClassName(className?: string) {
  return adminInputClassName(className);
}
