import Link from "next/link";

type Props = {
  className?: string;
  textClassName?: string;
};

/**
 * BikeZone wordmark with a speedometer mark. Reused in the navbar and footer.
 */
export function Logo({ className = "", textClassName = "text-white" }: Props) {
  return (
    <Link
      href="/"
      aria-label="BikeZone home"
      className={`group inline-flex items-center gap-2.5 ${className}`}
    >
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-light to-brand-dark shadow-lg shadow-brand/30 transition-transform duration-300 group-hover:rotate-6">
        <svg viewBox="0 0 32 32" className="h-6 w-6" aria-hidden>
          <path
            d="M6 21a10 10 0 0 1 20 0"
            fill="none"
            stroke="#fff"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path
            d="M16 21 21.5 14"
            fill="none"
            stroke="#fff"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <circle cx="16" cy="21" r="2.1" fill="#fff" />
        </svg>
      </span>
      <span
        className={`text-xl font-black uppercase tracking-tight ${textClassName}`}
      >
        Bike<span className="text-brand-light">Zone</span>
      </span>
    </Link>
  );
}
