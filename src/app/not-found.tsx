import Link from "next/link";

export default function NotFound() {
  return (
    <main
      id="main"
      className="mx-auto flex min-h-[60svh] w-full max-w-[1200px] flex-col justify-center px-6 py-24 md:px-8"
    >
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-faint">
        404
      </p>
      <h1 className="mt-6 font-display text-5xl md:text-7xl">
        Page not found
      </h1>
      <p className="mt-6 max-w-[46ch] text-ink-muted">
        That page does not exist. It may have moved, or the link may be wrong.
      </p>
      <Link
        href="/"
        className="mt-10 w-fit rounded-full bg-accent px-6 py-3 font-mono text-sm text-canvas transition-colors hover:bg-accent-hover"
      >
        Back to home
      </Link>
    </main>
  );
}
