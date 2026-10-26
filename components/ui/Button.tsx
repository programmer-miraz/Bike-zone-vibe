import type { ReactNode } from "react";
import Link from "next/link";

type Variant = "primary" | "outline" | "ghost" | "light";
type Size = "sm" | "md" | "lg";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  ariaLabel?: string;
};

const variants: Record<Variant, string> = {
  primary:
    "bg-brand text-white shadow-lg shadow-brand/25 hover:bg-brand-light hover:shadow-brand/40 hover:-translate-y-0.5 active:translate-y-0",
  outline:
    "border border-white/20 text-white hover:border-brand hover:bg-white/5 hover:-translate-y-0.5",
  ghost:
    "text-mist hover:text-white hover:bg-white/5",
  light:
    "bg-white text-ink shadow-lg shadow-black/30 hover:bg-mist hover:-translate-y-0.5",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-13 px-8 text-base",
};

const baseClasses = [
  "group/btn inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-wide",
  "transition-all duration-300 ease-out",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-ink",
];

/**
 * Anchor-based button used for every CTA in the app. Internal routes render
 * a `next/link` (client-side navigation + prefetch); hash links such as
 * "#bikes" and external schemes (mailto:, tel:, https:) render a plain `<a>`.
 */
export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className = "",
  ariaLabel,
}: ButtonProps) {
  const classes = [...baseClasses, variants[variant], sizes[size], className]
    .filter(Boolean)
    .join(" ");

  if (href?.startsWith("/")) {
    return (
      <Link href={href} aria-label={ariaLabel} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} aria-label={ariaLabel} className={classes}>
      {children}
    </a>
  );
}
