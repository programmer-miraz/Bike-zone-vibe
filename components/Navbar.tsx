"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/lib/data";
import { CloseIcon, MenuIcon, SearchIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

/** Highlight the nav item matching the current route (hash links never match). */
function isActiveLink(pathname: string, href: string): boolean {
  if (href.includes("#")) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

const linkClasses =
  "relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 after:absolute after:inset-x-4 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:bg-brand after:transition-transform after:duration-300 hover:after:scale-x-100";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the drawer when the viewport returns to desktop, and lock background
  // scrolling while the mobile menu is open.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 glass">
      <nav
        aria-label="Main"
        className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-5 sm:px-8"
      >
        <Logo />

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const active = isActiveLink(pathname, link.href);
            return (
              <li key={link.label}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`${linkClasses} ${active ? "text-white after:scale-x-100" : "text-zinc-300 hover:text-white"}`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/bikes"
            aria-label="Search bikes"
            className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-zinc-300 transition-all duration-300 hover:border-brand hover:text-white hover:shadow-lg hover:shadow-brand/20 focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
          >
            <SearchIcon />
          </Link>
          <Button href="/Login" size="md">
            Login
          </Button>
          <Button href="/bikes" size="md">
            Explore Bikes
          </Button>
        </div>

        {/* Mobile triggers */}
        <div className="flex items-center gap-3 lg:hidden">
          <Link
            href="/bikes"
            aria-label="Search bikes"
            className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-zinc-300 transition-colors hover:border-brand hover:text-white focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
          >
            <SearchIcon />
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid h-11 w-11 place-items-center rounded-full bg-brand text-white transition-colors hover:bg-brand-light focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`overflow-hidden border-t border-white/10 bg-ink/95 transition-[max-height,opacity] duration-300 ease-out lg:hidden ${
          open ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="space-y-1 px-5 py-5 sm:px-8">
          {navLinks.map((link) => {
            const active = isActiveLink(pathname, link.href);
            return (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 text-base font-semibold transition-colors hover:bg-white/5 hover:text-white ${
                    active ? "text-white" : "text-zinc-200"
                  }`}
                >
                  {link.label}
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${active ? "bg-brand" : "bg-brand/60"}`}
                  />
                </Link>
              </li>
            );
          })}
          <li className="pt-3">
            <Button href="/bikes" size="lg" className="w-full">
              Explore Bikes
            </Button>
          </li>
        </ul>
      </div>
    </header>
  );
}
