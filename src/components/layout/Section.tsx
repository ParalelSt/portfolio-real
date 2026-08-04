import Reveal from "@/components/layout/Reveal";
import { cn } from "@/lib/cn";

type SectionProps = {
  id: string;
  index: string;
  title: string;
  children: React.ReactNode;
  className?: string;
};

export default function Section({
  id,
  index,
  title,
  children,
  className,
}: SectionProps) {
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn("scroll-mt-24 border-t border-rule", className)}
    >
      <div className="mx-auto w-full max-w-[1200px] px-6 py-20 md:px-8 md:py-32">
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="font-mono text-sm tabular-nums text-ink-faint">
              {index}
            </span>
            <span aria-hidden="true" className="h-px flex-1 bg-rule" />
          </div>
          <h2
            id={headingId}
            className="mt-6 font-display text-4xl leading-[1.05] md:text-6xl"
          >
            {title}
          </h2>
        </Reveal>
        <div className="mt-12 md:mt-16">{children}</div>
      </div>
    </section>
  );
}
