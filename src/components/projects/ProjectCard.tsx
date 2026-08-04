import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon, GitHubIcon } from "@/components/icons";
import Reveal from "@/components/layout/Reveal";
import type { Project } from "@/content/projects";

const MAX_VISIBLE_STACK = 5;

export default function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const visibleStack = project.stack.slice(0, MAX_VISIBLE_STACK);
  const overflowCount = project.stack.length - visibleStack.length;
  const detailHref = `/projects/${project.slug}`;

  return (
    <Reveal delay={(index % 2) * 80} className="h-full">
      <article className="group flex h-full flex-col">
        <Link
          href={detailHref}
          tabIndex={-1}
          aria-hidden="true"
          className="relative block aspect-[16/10] w-full overflow-hidden rounded-sm bg-surface"
        >
          <Image
            src={project.image}
            alt={project.imageAlt}
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </Link>

        <div className="mt-6 flex flex-1 flex-col border-t border-rule pt-6">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="font-display text-2xl md:text-3xl">
              <Link
                href={detailHref}
                className="transition-colors hover:text-accent"
              >
                {project.name}
              </Link>
            </h3>
            {project.status === "in-progress" && (
              <span className="flex shrink-0 items-center gap-2 font-mono text-xs text-ink-faint">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-accent"
                />
                In progress
              </span>
            )}
          </div>

          <p className="mt-4 max-w-[58ch] text-sm leading-relaxed text-ink-muted">
            {project.summary}
          </p>

          <ul
            aria-label="Tech stack"
            className="mt-6 flex flex-wrap items-center gap-2"
          >
            {visibleStack.map((tool) => (
              <li
                key={tool}
                className="rounded-full border border-rule px-3 py-1 font-mono text-xs text-ink-faint"
              >
                {tool}
              </li>
            ))}
            {overflowCount > 0 && (
              <li className="font-mono text-xs text-ink-faint">
                +{overflowCount}
              </li>
            )}
          </ul>

          <div className="mt-6 flex items-center gap-5 pt-2">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Live site for ${project.name}`}
              className="inline-flex items-center gap-1.5 font-mono text-xs text-ink-muted transition-colors hover:text-accent"
            >
              Live site
              <ArrowUpRightIcon className="h-3.5 w-3.5" />
            </a>
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`GitHub repository for ${project.name}`}
              className="inline-flex items-center gap-1.5 font-mono text-xs text-ink-muted transition-colors hover:text-accent"
            >
              <GitHubIcon className="h-3.5 w-3.5" />
              GitHub
            </a>
          </div>
        </div>
      </article>
    </Reveal>
  );
}
