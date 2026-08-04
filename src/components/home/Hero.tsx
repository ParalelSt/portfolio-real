import Link from "next/link";
import { ArrowUpRightIcon } from "@/components/icons";
import Reveal from "@/components/layout/Reveal";
import { profile } from "@/content/profile";

export default function Hero() {
  const { greeting, subheading, primaryAction, secondaryAction } = profile.hero;

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="mx-auto flex min-h-[calc(100svh-6rem)] w-full max-w-[1200px] flex-col justify-center px-6 py-24 md:px-8"
    >
      <Reveal>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-faint">
          {profile.title}
        </p>
      </Reveal>

      <Reveal delay={80}>
        <h1
          id="hero-heading"
          className="mt-6 font-display leading-[0.95] tracking-tight"
          style={{ fontSize: "clamp(3rem, 11vw, 7.5rem)" }}
        >
          {greeting.before}
          <span className="text-accent">{greeting.accent}</span>
          {greeting.after}
        </h1>
      </Reveal>

      <Reveal delay={160}>
        <p className="mt-8 max-w-[46ch] text-lg leading-relaxed text-ink-muted md:text-xl">
          {subheading}
        </p>
      </Reveal>

      <Reveal delay={240}>
        <div className="mt-12 flex flex-wrap items-center gap-4">
          <Link
            href={primaryAction.href}
            className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-mono text-sm text-canvas transition-colors hover:bg-accent-hover"
          >
            {primaryAction.label}
            <ArrowUpRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <Link
            href={secondaryAction.href}
            className="inline-flex items-center gap-2 rounded-full border border-rule px-6 py-3 font-mono text-sm text-ink-muted transition-colors hover:border-ink hover:text-ink"
          >
            {secondaryAction.label}
          </Link>
        </div>
      </Reveal>

      <Reveal delay={320}>
        <p className="mt-16 font-mono text-xs text-ink-faint">
          {profile.locationLine}
        </p>
      </Reveal>
    </section>
  );
}
