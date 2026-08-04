"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { profile } from "@/content/profile";
import { useActiveSection } from "@/hooks/useActiveSection";
import { cn } from "@/lib/cn";

const SECTION_IDS = ["about", "projects", "contact"] as const;

const LINKS = [
  { id: "projects", label: "Projects" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
] as const;

export default function Nav() {
  const active = useActiveSection(SECTION_IDS);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 bg-canvas/85 backdrop-blur transition-[height,border-color] duration-300",
        scrolled ? "border-b border-rule" : "border-b border-transparent",
      )}
    >
      <nav
        aria-label="Primary"
        className={cn(
          "mx-auto flex w-full max-w-[1200px] items-center justify-between px-6 transition-[padding] duration-300 md:px-8",
          scrolled ? "py-3" : "py-5",
        )}
      >
        <Link
          href="/"
          aria-label={`${profile.name}, home`}
          className="font-display text-2xl tracking-tight text-accent transition-colors hover:text-accent-hover"
        >
          AM
        </Link>

        <ul className="flex items-center gap-1 sm:gap-2">
          {LINKS.map((link) => {
            const isActive = active === link.id;
            return (
              <li key={link.id}>
                <Link
                  href={`/#${link.id}`}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "relative px-2 py-1 font-mono text-xs uppercase tracking-[0.14em] transition-colors sm:px-3 sm:text-sm",
                    isActive ? "text-ink" : "text-ink-muted hover:text-ink",
                  )}
                >
                  {link.label}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-x-2 -bottom-0.5 h-px origin-left bg-accent transition-transform duration-300 sm:inset-x-3",
                      isActive ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
