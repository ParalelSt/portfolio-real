import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRightIcon, GitHubIcon } from "@/components/icons";
import { getProject, projects } from "@/content/projects";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) return { title: "Project not found" };

  return {
    title: project.name,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: project.name,
      description: project.summary,
      images: [{ url: project.image, alt: project.imageAlt }],
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) notFound();

  return (
    <main id="main" className="mx-auto w-full max-w-[1200px] px-6 py-16 md:px-8 md:py-24">
      <Link
        href="/#projects"
        className="font-mono text-xs uppercase tracking-[0.16em] text-ink-muted transition-colors hover:text-accent"
      >
        ← Back to work
      </Link>

      <header className="mt-10 flex flex-col gap-4 border-b border-rule pb-10">
        <h1 className="font-display text-4xl leading-[1.05] md:text-6xl">
          {project.name}
        </h1>
        {project.status === "in-progress" && (
          <span className="flex w-fit items-center gap-2 font-mono text-xs text-ink-faint">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
            In progress
          </span>
        )}
      </header>

      <div className="relative mt-12 aspect-[16/10] w-full overflow-hidden rounded-sm bg-surface">
        <Image
          src={project.image}
          alt={project.imageAlt}
          fill
          priority
          sizes="(min-width: 1024px) 1200px, 100vw"
          className="object-cover object-top"
        />
      </div>

      <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,3fr)_minmax(0,1fr)] lg:gap-16">
        <p className="max-w-[68ch] text-lg leading-relaxed text-ink-muted">
          {project.description}
        </p>

        <aside className="flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <h2 className="font-mono text-xs uppercase tracking-[0.16em] text-ink-faint">
              Built with
            </h2>
            <ul className="flex flex-wrap gap-2">
              {project.stack.map((tool) => (
                <li
                  key={tool}
                  className="rounded-full border border-rule px-3 py-1 font-mono text-xs text-ink-muted"
                >
                  {tool}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3 border-t border-rule pt-8">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-2 font-mono text-sm text-accent transition-colors hover:text-accent-hover"
            >
              Visit live site
              <ArrowUpRightIcon className="h-4 w-4" />
            </a>
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-2 font-mono text-sm text-ink-muted transition-colors hover:text-accent"
            >
              <GitHubIcon className="h-4 w-4" />
              View source
            </a>
          </div>
        </aside>
      </div>
    </main>
  );
}
