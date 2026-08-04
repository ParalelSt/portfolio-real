import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon } from "@/components/icons";
import Reveal from "@/components/layout/Reveal";
import Section from "@/components/layout/Section";
import { profile } from "@/content/profile";

export default function About() {
  return (
    <Section id="about" index="01" title="About">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16">
        <Reveal>
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-surface">
            <Image
              src={profile.portrait.src}
              alt={profile.portrait.alt}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>

        <div className="flex flex-col gap-10">
          <Reveal delay={80}>
            <div className="flex flex-col gap-2">
              <h3 className="font-display text-3xl">{profile.name}</h3>
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent">
                {profile.title}
              </p>
              <p className="font-mono text-xs text-ink-faint">
                {profile.locationLine}
              </p>
            </div>
          </Reveal>

          <Reveal delay={140}>
            <div className="flex flex-col gap-5">
              {profile.bio.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 24)}
                  className="max-w-[62ch] leading-relaxed text-ink-muted"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="grid gap-8 border-t border-rule pt-8 sm:grid-cols-3">
              {profile.techStacks.map((group) => (
                <div key={group.name} className="flex flex-col gap-3">
                  <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-ink-faint">
                    {group.name}
                  </h3>
                  <ul className="flex flex-col gap-1.5">
                    {group.tools.map((tool) => (
                      <li key={tool} className="text-sm text-ink-muted">
                        {tool}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={260}>
            <div className="flex flex-col gap-6 border-t border-rule pt-8">
              <p className="font-mono text-sm text-ink-faint">
                {profile.learning}
              </p>
              <Link
                href={profile.aboutAction.href}
                className="group inline-flex w-fit items-center gap-2 font-mono text-sm text-accent transition-colors hover:text-accent-hover"
              >
                {profile.aboutAction.label}
                <ArrowUpRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
