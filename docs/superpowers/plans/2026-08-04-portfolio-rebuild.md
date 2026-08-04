# Portfolio Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the portfolio site from scratch on Next.js 16 with an editorial dark theme, carrying every piece of written content over verbatim from the old Vite site.

**Architecture:** One statically generated scrolling page at `/` composed of four sections, plus one statically generated detail route per project at `/projects/[slug]`. All written content lives in two typed data modules under `src/content/` that no component may bypass. Presentation is Tailwind 4 theme tokens declared once in `globals.css`. The contact form is the only stateful component and talks to EmailJS from the browser.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript strict, Tailwind CSS 4, `next/font/google`, `@emailjs/browser`, Vitest + React Testing Library, Playwright + axe-core.

**Spec:** `docs/superpowers/specs/2026-08-04-portfolio-rebuild-design.md`

**Branch:** `rebuild` (already created, already contains the spec commit)

## Global Constraints

- Working directory is `/Users/aronmatoic/Documents/Main Projects/portfolio-real`. Never run commands against any other project.
- Dev and preview servers bind to **port 3100**, never 3000 or 8090. The user has other services on those ports.
- TypeScript `strict: true`. No `any`. No `@ts-ignore`.
- All written copy is transcribed **verbatim** from the spec's Content Inventory, including its original curly apostrophes (`’`) and the em dash inside the Minecraft-clone description. Do not reword, shorten, or "improve" any user-facing sentence.
- No component may contain a hardcoded user-facing string that belongs in `src/content/`. Section headings, button labels, and form labels are the exception and live in the components.
- Colors, fonts, and spacing come from Tailwind theme tokens. No raw hex values in component files.
- Every interactive element must have a visible `:focus-visible` ring.
- Every external link carries `target="_blank"` and `rel="noopener noreferrer"`.
- All motion must be suppressed under `prefers-reduced-motion: reduce`.
- Anchors must never nest inside other anchors.
- Commit after every task with a conventional-commit message. Do not merge to `main`.

## File Structure

| File | Responsibility |
| --- | --- |
| `package.json`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs` | Toolchain and route redirects |
| `vitest.config.ts`, `vitest.setup.tsx` | Unit test environment, jsdom stubs |
| `playwright.config.ts` | Browser sim environment on port 3100 |
| `src/styles/globals.css` | Tailwind import, `@theme` tokens, base layer, reduced-motion rule |
| `src/lib/cn.ts` | Conditional className joiner |
| `src/lib/validation.ts` | Pure contact-form field rules, no DOM |
| `src/content/profile.ts` | Identity, hero copy, bio, tech stacks, contact details |
| `src/content/projects.ts` | `Project` type, project array, slug lookup |
| `src/hooks/useActiveSection.ts` | Reports which section is nearest the viewport top |
| `src/components/icons.tsx` | Inline GitHub, LinkedIn, Mail, Arrow SVGs |
| `src/components/layout/Reveal.tsx` | Intersection-observer reveal wrapper |
| `src/components/layout/Section.tsx` | Numbered section shell with heading and rule |
| `src/components/layout/Nav.tsx` | Sticky nav with active-section tracking |
| `src/components/layout/Footer.tsx` | Closing rule, name, socials |
| `src/components/home/Hero.tsx` | Unnumbered opening section |
| `src/components/home/About.tsx` | Portrait, bio, tech stacks |
| `src/components/home/Projects.tsx` | Grid wrapper over ProjectCard |
| `src/components/home/Contact.tsx` | Two-column form and info layout |
| `src/components/projects/ProjectCard.tsx` | One project summary card |
| `src/components/contact/ContactForm.tsx` | Validated EmailJS form |
| `src/components/contact/ContactInfo.tsx` | Channels and facts panel |
| `src/components/contact/CopyEmailButton.tsx` | Clipboard copy with fallback |
| `src/app/layout.tsx` | Fonts, root metadata, skip link, Nav, Footer |
| `src/app/page.tsx` | Composes Hero, About, Projects, Contact |
| `src/app/projects/[slug]/page.tsx` | Static detail route |
| `src/app/not-found.tsx` | 404 |
| `src/app/opengraph-image.tsx`, `sitemap.ts`, `robots.ts` | Social and crawler metadata |
| `sims/*.sim.ts` | Playwright browser sims |

Content modules export plain data with no JSX. Component files stay under roughly 150 lines; if one grows past that during implementation, split the inner piece into its own file rather than letting it sprawl.

---

### Task 1: Replace the Vite toolchain with Next.js

**Files:**
- Delete: `index.html`, `vite.config.ts`, `postcss.config.js`, `tsconfig.app.json`, `tsconfig.node.json`, `eslint.config.js`, `vercel.json`, all of `src/`
- Create: `package.json` (rewrite), `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `.gitignore` (rewrite), `src/styles/globals.css`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/lib/cn.ts`
- Test: `vitest.config.ts`, `vitest.setup.tsx`, `src/lib/cn.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `cn(...values: Array<string | false | null | undefined>): string` from `@/lib/cn`. The `@/*` path alias resolving to `src/*` in both Next and Vitest. Working `npm run build` and `npm test`.

- [ ] **Step 1: Delete the old Vite scaffolding**

```bash
cd "/Users/aronmatoic/Documents/Main Projects/portfolio-real"
git rm -r --quiet src index.html vite.config.ts postcss.config.js \
  tsconfig.app.json tsconfig.node.json eslint.config.js vercel.json
```

`public/images/`, `CHANGELOG.md`, and `.changlogrc.json` must survive. Verify with `ls public/images` before continuing; it should list eight files.

- [ ] **Step 2: Write `package.json`**

`react-icons` is intentionally dropped; four inline SVGs replace it in Task 5. `react-router-dom` is replaced by the App Router. Version stays at `0.0.5` so `standard-version` history continues.

```json
{
  "name": "portfolio",
  "private": true,
  "version": "0.0.5",
  "type": "module",
  "scripts": {
    "dev": "next dev -p 3100",
    "build": "next build",
    "start": "next start -p 3100",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest",
    "sim": "playwright test",
    "release": "standard-version",
    "changelog": "conventional-changelog -p conventionalcommits -i CHANGELOG.md -s"
  },
  "dependencies": {
    "@emailjs/browser": "^4.4.1",
    "next": "^16.0.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0"
  },
  "devDependencies": {
    "@axe-core/playwright": "^4.10.1",
    "@playwright/test": "^1.50.0",
    "@tailwindcss/postcss": "^4.1.18",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.1.0",
    "@testing-library/user-event": "^14.5.2",
    "@types/node": "^24.10.1",
    "@types/react": "^19.2.5",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^5.1.1",
    "eslint": "^9.39.1",
    "eslint-config-next": "^16.0.0",
    "jsdom": "^26.0.0",
    "standard-version": "^9.5.0",
    "tailwindcss": "^4.1.18",
    "typescript": "~5.9.3",
    "vitest": "^3.0.0"
  }
}
```

Then install:

```bash
rm -rf node_modules package-lock.json
npm install
npx playwright install chromium
```

- [ ] **Step 3: Write the config files**

`next.config.ts` — the three redirects preserve the old site's URLs. `/projects` matches exactly and does not shadow `/projects/[slug]`.

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/projects", destination: "/#projects", permanent: true },
      { source: "/about", destination: "/#about", permanent: true },
      { source: "/contact", destination: "/#contact", permanent: true },
    ];
  },
};

export default nextConfig;
```

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

`postcss.config.mjs`:

```js
const config = { plugins: { "@tailwindcss/postcss": {} } };
export default config;
```

`.gitignore`:

```
node_modules
.next
out
dist
.env
.env.local
.env*.local
.DS_Store
*.log
coverage
test-results
playwright-report
.vercel
```

- [ ] **Step 4: Write the minimal app shell**

`src/styles/globals.css` — tokens land in Task 3, this is only enough to prove the build works:

```css
@import "tailwindcss";
```

`src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Aron Matoic",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

`src/app/page.tsx`:

```tsx
export default function HomePage() {
  return <main>Rebuild in progress</main>;
}
```

- [ ] **Step 5: Verify the Next build succeeds**

Run: `npm run build`
Expected: build completes, output lists `/` as a static route. If it fails, fix before continuing; every later task depends on this.

- [ ] **Step 6: Write the Vitest configuration**

`vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

const srcDir = fileURLToPath(new URL("./src", import.meta.url));

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.tsx"],
    include: ["src/**/*.test.{ts,tsx}"],
  },
  resolve: {
    alias: { "@": srcDir },
  },
});
```

`vitest.setup.tsx` — `next/image` is mocked to a plain `img` so tests can assert on alt text without the optimizer:

```tsx
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => {
  cleanup();
});

vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    fill: _fill,
    priority: _priority,
    sizes: _sizes,
    ...rest
  }: {
    src: string;
    alt: string;
    fill?: boolean;
    priority?: boolean;
    sizes?: string;
    className?: string;
  }) => <img src={src} alt={alt} {...rest} />,
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));
```

- [ ] **Step 7: Write the failing test for `cn`**

`src/lib/cn.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { cn } from "@/lib/cn";

describe("cn", () => {
  it("joins truthy class names with a single space", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });

  it("drops false, null, undefined, and empty strings", () => {
    expect(cn("a", false, null, undefined, "", "b")).toBe("a b");
  });

  it("returns an empty string when nothing is truthy", () => {
    expect(cn(false, null, undefined)).toBe("");
  });
});
```

- [ ] **Step 8: Run the test to verify it fails**

Run: `npm test -- src/lib/cn.test.ts`
Expected: FAIL, cannot resolve `@/lib/cn`.

- [ ] **Step 9: Implement `cn`**

`src/lib/cn.ts`:

```ts
export type ClassValue = string | false | null | undefined;

export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
```

- [ ] **Step 10: Run the test to verify it passes**

Run: `npm test`
Expected: PASS, 3 tests.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "chore: replace vite toolchain with next.js 16"
```

---

### Task 2: Content data modules

**Files:**
- Create: `src/content/projects.ts`, `src/content/profile.ts`
- Test: `src/content/projects.test.ts`, `src/content/profile.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `type Project` with fields `slug, name, description, summary, image, imageAlt, liveUrl, repoUrl, stack, status`.
  - `projects: Project[]` (five entries, in the order below).
  - `getProject(slug: string): Project | undefined`.
  - `profile` object, shape defined in Step 4 below.
  - `type TechStackGroup = { name: string; tools: string[] }`.

Every later task reads copy from these two modules and from nowhere else.

- [ ] **Step 1: Write the failing test for the projects data**

`src/content/projects.test.ts`:

```ts
import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getProject, projects } from "@/content/projects";

const publicDir = join(process.cwd(), "public");

describe("projects content", () => {
  it("has exactly five projects", () => {
    expect(projects).toHaveLength(5);
  });

  it("has unique slugs", () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it.each(projects.map((p) => [p.slug, p] as const))(
    "%s has every required field populated",
    (_slug, project) => {
      expect(project.slug).toMatch(/^[a-z0-9-]+$/);
      expect(project.name.trim().length).toBeGreaterThan(0);
      expect(project.description.trim().length).toBeGreaterThan(0);
      expect(project.summary.trim().length).toBeGreaterThan(0);
      expect(project.imageAlt.trim().length).toBeGreaterThan(0);
      expect(project.stack.length).toBeGreaterThan(0);
      expect(project.stack.every((t) => t.trim().length > 0)).toBe(true);
    },
  );

  it.each(projects.map((p) => [p.slug, p] as const))(
    "%s has https live and repo urls",
    (_slug, project) => {
      expect(new URL(project.liveUrl).protocol).toBe("https:");
      expect(new URL(project.repoUrl).protocol).toBe("https:");
    },
  );

  it.each(projects.map((p) => [p.slug, p] as const))(
    "%s points at a screenshot that exists on disk",
    (_slug, project) => {
      expect(project.image.startsWith("/images/")).toBe(true);
      expect(existsSync(join(publicDir, project.image))).toBe(true);
    },
  );

  it("starts each summary with the same text as its description", () => {
    for (const project of projects) {
      expect(project.description.startsWith(project.summary)).toBe(true);
    }
  });

  it("looks a project up by slug", () => {
    expect(getProject("panora")?.name).toBe("Panora");
  });

  it("returns undefined for an unknown slug", () => {
    expect(getProject("nope")).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- src/content/projects.test.ts`
Expected: FAIL, cannot resolve `@/content/projects`.

- [ ] **Step 3: Write `src/content/projects.ts`**

Copy the strings exactly. The `’` characters and the `—` inside the Minecraft-clone description are part of the original copy and must be preserved. `PostreSQL` is corrected to `PostgreSQL` and the split `"Drizzle"` / `"ORM"` chips are merged, as the spec records.

```ts
export type ProjectStatus = "live" | "in-progress";

export type Project = {
  slug: string;
  name: string;
  description: string;
  summary: string;
  image: string;
  imageAlt: string;
  liveUrl: string;
  repoUrl: string;
  stack: string[];
  status: ProjectStatus;
};

export const projects: Project[] = [
  {
    slug: "byteforge",
    name: "ByteForge Webshop",
    summary:
      "ByteForge is a full-stack gaming and tech webshop offering (fake) products such as GFUEL, gaming peripherals, PC components, accessories, and games.",
    description:
      "ByteForge is a full-stack gaming and tech webshop offering (fake) products such as GFUEL, gaming peripherals, PC components, accessories, and games. It is built with React and TypeScript on the frontend, styled using SCSS, and powered by a Node.js + Express backend with Supabase for database and authentication. The project is deployed on Vercel.",
    image: "/images/ByteForge.png",
    imageAlt: "The ByteForge webshop storefront",
    liveUrl: "https://byte-forge-rho.vercel.app/",
    repoUrl: "https://github.com/ParalelSt/ByteForge",
    stack: ["React", "Typescript", "SCSS", "Node.js", "Express", "Supabase", "Vercel"],
    status: "live",
  },
  {
    slug: "arons-handbook",
    name: "Aron's Handbook (Gym Logbook)",
    summary:
      "Aron's Handbook is a gym logbook application for tracking workouts, including reps and weights, while supporting training templates, structured programs, and personal goals.",
    description:
      "Aron's Handbook is a gym logbook application for tracking workouts, including reps and weights, while supporting training templates, structured programs, and personal goals. It is built with React and TypeScript, styled using Tailwind CSS, powered by Supabase for backend and authentication, deployed on Vercel, and developed with the help of AI-assisted prompts.",
    image: "/images/AronSHandBook.png",
    imageAlt: "The Aron's Handbook workout tracking interface",
    liveUrl: "https://www.aronshandbook.digital/login",
    repoUrl: "https://github.com/ParalelSt/Arons-handbook",
    stack: [
      "React",
      "Typescript",
      "Tailwind",
      "Node.js",
      "Express",
      "Supabase",
      "Vercel",
      "AI Development",
    ],
    status: "live",
  },
  {
    slug: "minecraft-clone",
    name: "Minecraft-clone",
    summary: "A Minecraft-inspired voxel sandbox built as a personal hobby project.",
    description:
      "A Minecraft-inspired voxel sandbox built as a personal hobby project. This project is work in progress and not intended as a finished game — it’s a learning playground for experimenting with 3D rendering, physics, and game mechanics on the web. Built with React + TypeScript, react-three-fiber, and @react-three/cannon.",
    image: "/images/Minecraft-clone.png",
    imageAlt: "A voxel landscape rendered in the Minecraft clone",
    liveUrl: "https://minecraft-clone-dun.vercel.app/",
    repoUrl: "https://github.com/ParalelSt/Minecraft-clone",
    stack: [
      "React",
      "Typescript",
      "Three.js",
      "@react-three/fiber",
      "@react-three/drei",
      "Zustand",
      "cannon-es",
      "Vercel",
      "AI Development",
    ],
    status: "in-progress",
  },
  {
    slug: "panora",
    name: "Panora",
    summary:
      "Panora is a handpan learning application featuring structured lessons across beginner, intermediate, and advanced tiers, practice exercises, and a free practice mode with a fully configurable metronome.",
    description:
      "Panora is a handpan learning application featuring structured lessons across beginner, intermediate, and advanced tiers, practice exercises, and a free practice mode with a fully configurable metronome. It uses Web Audio API synthesis to generate realistic handpan tones with layered harmonics, and includes visual beat-by-beat notation that auto-detects subdivisions (8ths, triplets, 16ths). Users can record practice sessions, play them back at variable speeds, track their progress and streaks, and switch between handpan tunings. Built with Next.js 16, React 19, and TypeScript, styled with Tailwind CSS 4, and developed with the help of AI-assisted prompts.",
    image: "/images/Panora.png",
    imageAlt: "The Panora handpan lesson interface",
    liveUrl: "https://handpan-learning-app.vercel.app",
    repoUrl: "https://github.com/ParalelSt/Handpan-Learning-App",
    stack: [
      "React",
      "TypeScript",
      "Next.js",
      "Tailwind",
      "Zustand",
      "Drizzle ORM",
      "Neon",
      "Postgres",
      "NextAuth",
      "Vercel",
      "AI Development",
    ],
    status: "live",
  },
  {
    slug: "car-ownership-intelligence",
    name: "Car Ownership Intelligence",
    summary: "Build in progress",
    description: "Build in progress",
    image: "/images/CarOwnershipIntelligence.png",
    imageAlt: "The Car Ownership Intelligence dashboard",
    liveUrl: "https://car-ownership-intelligence.vercel.app/login",
    repoUrl: "https://github.com/ParalelSt/Car-Ownership-Intelligence",
    stack: ["React", "Typescript", "Tailwind", "Vercel", ".Net 8", "PostgreSQL"],
    status: "in-progress",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
```

- [ ] **Step 4: Run the projects test to verify it passes**

Run: `npm test -- src/content/projects.test.ts`
Expected: PASS.

- [ ] **Step 5: Write the failing test for the profile data**

`src/content/profile.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { profile } from "@/content/profile";

describe("profile content", () => {
  it("carries the identity fields over", () => {
    expect(profile.name).toBe("Aron Matoic");
    expect(profile.title).toBe("Full-Stack Web Developer");
    expect(profile.locationLine).toBe(
      "Križevci, Croatia · CET / CEST (UTC+1 / UTC+2)",
    );
  });

  it("keeps the hero copy split so the name can be accented", () => {
    expect(profile.hero.greeting.before).toBe("Hi, I am ");
    expect(profile.hero.greeting.accent).toBe("Aron");
    expect(profile.hero.greeting.after).toBe("!");
    expect(profile.hero.subheading).toContain("React and TypeScript");
  });

  it("has two bio paragraphs and a learning line", () => {
    expect(profile.bio).toHaveLength(2);
    expect(profile.bio.every((p) => p.trim().length > 0)).toBe(true);
    expect(profile.learning).toBe(
      "Currently learning .Net 8 to build better server-side applications",
    );
  });

  it("has three tech stack groups, each with tools", () => {
    expect(profile.techStacks).toHaveLength(3);
    expect(profile.techStacks.map((g) => g.name)).toEqual([
      "Frontend",
      "Backend",
      "Tools & Platforms",
    ]);
    for (const group of profile.techStacks) {
      expect(group.tools.length).toBeGreaterThan(0);
    }
  });

  it("has three contact channels with valid hrefs", () => {
    expect(profile.contact.channels).toHaveLength(3);
    for (const channel of profile.contact.channels) {
      expect(channel.label.trim().length).toBeGreaterThan(0);
      expect(channel.display.trim().length).toBeGreaterThan(0);
      expect(() => new URL(channel.href)).not.toThrow();
    }
  });

  it("exposes the email address on its own for the copy button", () => {
    expect(profile.contact.email).toBe("aronmatoic@gmail.com");
  });

  it("has two contact facts", () => {
    expect(profile.contact.facts).toEqual([
      { label: "Location", value: "Croatia (Remote-friendly)" },
      { label: "Response time", value: "Usually within 24 hours" },
    ]);
  });

  it("has an https site url for canonical metadata", () => {
    expect(new URL(profile.siteUrl).protocol).toBe("https:");
  });
});
```

- [ ] **Step 6: Run the test to verify it fails**

Run: `npm test -- src/content/profile.test.ts`
Expected: FAIL, cannot resolve `@/content/profile`.

- [ ] **Step 7: Write `src/content/profile.ts`**

```ts
export type TechStackGroup = {
  name: string;
  tools: string[];
};

export type ContactChannelKind = "email" | "linkedin" | "github";

export type ContactChannel = {
  kind: ContactChannelKind;
  label: string;
  display: string;
  href: string;
};

export type ContactFact = {
  label: string;
  value: string;
};

export const profile = {
  name: "Aron Matoic",
  title: "Full-Stack Web Developer",
  locationLine: "Križevci, Croatia · CET / CEST (UTC+1 / UTC+2)",
  siteUrl: "https://aronmatoic.vercel.app",
  portrait: {
    src: "/images/Profile.jpg",
    alt: "Aron Matoic",
  },
  hero: {
    greeting: {
      before: "Hi, I am ",
      accent: "Aron",
      after: "!",
    },
    subheading:
      "I build modern, scalable web applications with React and TypeScript, focusing on performance and clean UI.",
    primaryAction: { label: "View My Work", href: "#projects" },
    secondaryAction: { label: "More About Me", href: "#about" },
  },
  bio: [
    "I’m a full-stack web developer with a strong focus on frontend development. I enjoy building clean, responsive, and user-friendly interfaces, primarily working with React and TypeScript.",
    "I like combining solid logic with thoughtful UI design, while continuously expanding my backend knowledge to build more complete applications.",
  ],
  learning: "Currently learning .Net 8 to build better server-side applications",
  aboutAction: { label: "Get in touch", href: "#contact" },
  techStacks: [
    { name: "Frontend", tools: ["React", "Javascript", "Typescript", "SCSS", "Tailwind"] },
    { name: "Backend", tools: ["Node.js", "Express", ".Net 8"] },
    { name: "Tools & Platforms", tools: ["Git", "Vite", "Vercel", "Supabase"] },
  ] satisfies TechStackGroup[],
  contact: {
    intro:
      "Have a question or want to work together? I'm always open to new opportunities. Feel free to reach out and I'll get back to you as soon as possible.",
    heading: "Let's work together",
    subheading: "Open to opportunities and collaborations",
    email: "aronmatoic@gmail.com",
    channels: [
      {
        kind: "email",
        label: "Email",
        display: "aronmatoic@gmail.com",
        href: "mailto:aronmatoic@gmail.com",
      },
      {
        kind: "linkedin",
        label: "LinkedIn",
        display: "/aron-matoic-4818282b6",
        href: "https://www.linkedin.com/in/aron-matoic-4818282b6/",
      },
      {
        kind: "github",
        label: "GitHub",
        display: "/ParalelSt",
        href: "https://github.com/ParalelSt",
      },
    ] satisfies ContactChannel[],
    facts: [
      { label: "Location", value: "Croatia (Remote-friendly)" },
      { label: "Response time", value: "Usually within 24 hours" },
    ] satisfies ContactFact[],
  },
} as const;
```

Note: `mailto:` parses fine through `new URL`, so the channel href test passes for all three.

- [ ] **Step 8: Run the full suite to verify it passes**

Run: `npm test`
Expected: PASS, all content and `cn` tests green.

- [ ] **Step 9: Commit**

```bash
git add src/content package.json
git commit -m "feat(content): typed profile and project data modules"
```

---

### Task 3: Design system tokens, fonts, and root layout

**Files:**
- Modify: `src/styles/globals.css`, `src/app/layout.tsx`
- Test: verified by `npm run build` and by a visual check in Task 6 onward

**Interfaces:**
- Consumes: `profile` from Task 2.
- Produces: Tailwind utilities `bg-canvas`, `bg-surface`, `text-ink`, `text-ink-muted`, `text-ink-faint`, `text-accent`, `border-rule`, `font-display`, `font-body`, `font-mono`. A root layout that sets `lang="en"`, the three font CSS variables on `<html>`, root metadata, and a skip link targeting `#main`.

- [ ] **Step 1: Write the theme tokens**

Replace `src/styles/globals.css` entirely:

```css
@import "tailwindcss";

@theme {
  --color-canvas: #0a0a0b;
  --color-surface: #121213;
  --color-rule: rgba(245, 243, 239, 0.1);
  --color-ink: #f5f3ef;
  --color-ink-muted: #a3a099;
  --color-ink-faint: #6b6862;
  --color-accent: #e08a3c;
  --color-accent-hover: #c87330;

  --font-display: var(--font-instrument-serif), Georgia, "Times New Roman", serif;
  --font-body: var(--font-inter), system-ui, -apple-system, sans-serif;
  --font-mono: var(--font-jetbrains-mono), ui-monospace, "SF Mono", monospace;
}

@layer base {
  html {
    scroll-behavior: smooth;
    scroll-padding-top: 6rem;
  }

  body {
    background-color: var(--color-canvas);
    color: var(--color-ink);
    font-family: var(--font-body);
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }

  ::selection {
    background-color: var(--color-accent);
    color: var(--color-canvas);
  }

  :focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 3px;
    border-radius: 2px;
  }
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 2: Write the root layout with fonts and metadata**

Inter carries `latin-ext` because the location line contains `ž` in "Križevci". The display and mono faces are only ever used for ASCII text, so they stay on `latin`.

`src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import { profile } from "@/content/profile";
import "@/styles/globals.css";

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument-serif",
  display: "swap",
});

const body = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: {
    default: `${profile.name} | ${profile.title}`,
    template: `%s | ${profile.name}`,
  },
  description: profile.hero.subheading,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: profile.siteUrl,
    siteName: profile.name,
    title: `${profile.name} | ${profile.title}`,
    description: profile.hero.subheading,
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} | ${profile.title}`,
    description: profile.hero.subheading,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body className="bg-canvas text-ink">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-accent focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-canvas"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
```

Nav and Footer are added to this layout in Task 5.

- [ ] **Step 3: Point the home page at the main landmark**

`src/app/page.tsx`:

```tsx
export default function HomePage() {
  return (
    <main id="main" className="font-display text-4xl">
      Rebuild in progress
    </main>
  );
}
```

- [ ] **Step 4: Verify the build and the tokens compile**

Run: `npm run build`
Expected: PASS. Then `npm run dev` and open `http://localhost:3100`. The text must render in a serif face on a near-black background. Stop the dev server before continuing.

- [ ] **Step 5: Commit**

```bash
git add src/styles/globals.css src/app/layout.tsx src/app/page.tsx
git commit -m "feat(design): editorial dark theme tokens, fonts, and root layout"
```

---

### Task 4: Reveal wrapper, Section shell, and active-section hook

**Files:**
- Create: `src/components/layout/Reveal.tsx`, `src/components/layout/Section.tsx`, `src/hooks/useActiveSection.ts`
- Modify: `vitest.setup.tsx` (add `IntersectionObserver` and `matchMedia` stubs)
- Test: `src/components/layout/Reveal.test.tsx`, `src/hooks/useActiveSection.test.ts`

**Interfaces:**
- Consumes: `cn` from Task 1.
- Produces:
  - `<Reveal delay?: number className?: string>` client component.
  - `<Section id: string index: string title: string className?: string>` server component.
  - `useActiveSection(ids: readonly string[]): string | null`.

- [ ] **Step 1: Add the jsdom observer stubs to the test setup**

Append to `vitest.setup.tsx`:

```tsx
type ObserverCallback = (entries: IntersectionObserverEntry[]) => void;

export const observerCallbacks = new Set<ObserverCallback>();

class IntersectionObserverStub {
  constructor(private readonly callback: ObserverCallback) {
    observerCallbacks.add(callback);
  }
  observe() {}
  unobserve() {}
  disconnect() {
    observerCallbacks.delete(this.callback);
  }
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

vi.stubGlobal("IntersectionObserver", IntersectionObserverStub);

vi.stubGlobal(
  "matchMedia",
  (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
);
```

- [ ] **Step 2: Write the failing test for Reveal**

`src/components/layout/Reveal.test.tsx`:

```tsx
import { render, screen, act } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Reveal from "@/components/layout/Reveal";
import { observerCallbacks } from "../../../vitest.setup";

function fireIntersection(isIntersecting: boolean) {
  act(() => {
    for (const callback of observerCallbacks) {
      callback([{ isIntersecting } as IntersectionObserverEntry]);
    }
  });
}

describe("Reveal", () => {
  it("starts hidden and reveals once it intersects", () => {
    render(<Reveal>revealed content</Reveal>);
    const wrapper = screen.getByText("revealed content").parentElement;
    expect(wrapper).toHaveClass("opacity-0");

    fireIntersection(true);
    expect(screen.getByText("revealed content").parentElement).toHaveClass(
      "opacity-100",
    );
  });

  it("renders visible immediately when reduced motion is preferred", () => {
    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }));

    render(<Reveal>reduced content</Reveal>);
    expect(screen.getByText("reduced content").parentElement).toHaveClass(
      "opacity-100",
    );
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npm test -- src/components/layout/Reveal.test.tsx`
Expected: FAIL, cannot resolve `@/components/layout/Reveal`.

- [ ] **Step 4: Implement Reveal**

`src/components/layout/Reveal.tsx`:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type RevealProps = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
};

export default function Reveal({ children, delay = 0, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none",
        shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
        className,
      )}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 5: Run the Reveal test to verify it passes**

Run: `npm test -- src/components/layout/Reveal.test.tsx`
Expected: PASS, 2 tests.

- [ ] **Step 6: Write the failing test for useActiveSection**

`src/hooks/useActiveSection.test.ts`:

```ts
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useActiveSection } from "@/hooks/useActiveSection";
import { observerCallbacks } from "../../vitest.setup";

const IDS = ["about", "projects", "contact"] as const;

function entryFor(id: string, top: number, isIntersecting: boolean) {
  return {
    isIntersecting,
    target: { id } as Element,
    boundingClientRect: { top } as DOMRectReadOnly,
  } as IntersectionObserverEntry;
}

describe("useActiveSection", () => {
  it("returns null before anything intersects", () => {
    const { result } = renderHook(() => useActiveSection(IDS));
    expect(result.current).toBeNull();
  });

  it("returns the intersecting section nearest the top", () => {
    const { result } = renderHook(() => useActiveSection(IDS));

    act(() => {
      for (const callback of observerCallbacks) {
        callback([
          entryFor("contact", 800, true),
          entryFor("projects", 120, true),
        ]);
      }
    });

    expect(result.current).toBe("projects");
  });

  it("ignores entries that are not intersecting", () => {
    const { result } = renderHook(() => useActiveSection(IDS));

    act(() => {
      for (const callback of observerCallbacks) {
        callback([entryFor("about", 10, false), entryFor("contact", 500, true)]);
      }
    });

    expect(result.current).toBe("contact");
  });
});
```

- [ ] **Step 7: Run the test to verify it fails**

Run: `npm test -- src/hooks/useActiveSection.test.ts`
Expected: FAIL, cannot resolve `@/hooks/useActiveSection`.

- [ ] **Step 8: Implement useActiveSection**

`src/hooks/useActiveSection.ts`:

```ts
"use client";

import { useEffect, useState } from "react";

export function useActiveSection(ids: readonly string[]): string | null {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join(",");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 },
    );

    for (const id of key.split(",")) {
      const node = document.getElementById(id);
      if (node) observer.observe(node);
    }

    return () => observer.disconnect();
  }, [key]);

  return active;
}
```

- [ ] **Step 9: Implement the Section shell**

`src/components/layout/Section.tsx`:

```tsx
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
```

- [ ] **Step 10: Run the full suite to verify it passes**

Run: `npm test`
Expected: PASS, all tests green.

- [ ] **Step 11: Commit**

```bash
git add src/components/layout src/hooks vitest.setup.tsx
git commit -m "feat(layout): reveal wrapper, section shell, active-section hook"
```

---

### Task 5: Icons, Nav, and Footer

**Files:**
- Create: `src/components/icons.tsx`, `src/components/layout/Nav.tsx`, `src/components/layout/Footer.tsx`
- Modify: `src/app/layout.tsx` (mount Nav and Footer)
- Test: `src/components/layout/Nav.test.tsx`

**Interfaces:**
- Consumes: `profile`, `useActiveSection`, `cn`.
- Produces: `GitHubIcon`, `LinkedInIcon`, `MailIcon`, `ArrowUpRightIcon`, each accepting `className`. `<Nav />` and `<Footer />`.

- [ ] **Step 1: Write the inline icons**

`src/components/icons.tsx` — replaces `react-icons`. Every icon is decorative and marked `aria-hidden`; the surrounding link or button carries the accessible name.

```tsx
type IconProps = { className?: string };

export function GitHubIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.11.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.71 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.24 2.76.12 3.05.74.81 1.19 1.84 1.19 3.1 0 4.44-2.7 5.41-5.27 5.7.41.36.78 1.06.78 2.14v3.17c0 .31.21.68.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

export function LinkedInIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

export function MailIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className={className}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m2 7 10 6 10-6" />
    </svg>
  );
}

export function ArrowUpRightIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}
```

- [ ] **Step 2: Write the failing test for Nav**

`src/components/layout/Nav.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Nav from "@/components/layout/Nav";

vi.mock("@/hooks/useActiveSection", () => ({
  useActiveSection: () => "projects",
}));

describe("Nav", () => {
  it("renders the monogram home link", () => {
    render(<Nav />);
    expect(screen.getByRole("link", { name: "Aron Matoic, home" })).toHaveAttribute(
      "href",
      "/",
    );
  });

  it("renders all three section links pointing at anchors on the home page", () => {
    render(<Nav />);
    expect(screen.getByRole("link", { name: "Projects" })).toHaveAttribute(
      "href",
      "/#projects",
    );
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute(
      "href",
      "/#about",
    );
    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute(
      "href",
      "/#contact",
    );
  });

  it("marks the active section link as current", () => {
    render(<Nav />);
    expect(screen.getByRole("link", { name: "Projects" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(screen.getByRole("link", { name: "About" })).not.toHaveAttribute(
      "aria-current",
    );
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npm test -- src/components/layout/Nav.test.tsx`
Expected: FAIL, cannot resolve `@/components/layout/Nav`.

- [ ] **Step 4: Implement Nav**

Hrefs are absolute (`/#projects`) so they work from a project detail page as well as from the home page. Below `md` the links stay in a row at a smaller size rather than collapsing into a menu, since there are only three.

`src/components/layout/Nav.tsx`:

```tsx
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
```

- [ ] **Step 5: Run the Nav test to verify it passes**

Run: `npm test -- src/components/layout/Nav.test.tsx`
Expected: PASS, 3 tests.

- [ ] **Step 6: Implement Footer**

`src/components/layout/Footer.tsx`:

```tsx
import { profile } from "@/content/profile";
import { GitHubIcon, LinkedInIcon, MailIcon } from "@/components/icons";

const ICONS = {
  email: MailIcon,
  linkedin: LinkedInIcon,
  github: GitHubIcon,
} as const;

export default function Footer() {
  return (
    <footer className="border-t border-rule">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-8">
        <p className="font-mono text-xs text-ink-faint">
          © {new Date().getFullYear()} {profile.name}
        </p>
        <ul className="flex items-center gap-5">
          {profile.contact.channels.map((channel) => {
            const Icon = ICONS[channel.kind];
            const isExternal = channel.href.startsWith("http");
            return (
              <li key={channel.kind}>
                <a
                  href={channel.href}
                  aria-label={channel.label}
                  {...(isExternal
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="block text-ink-muted transition-colors hover:text-accent"
                >
                  <Icon className="h-5 w-5" />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </footer>
  );
}
```

- [ ] **Step 7: Mount Nav and Footer in the root layout**

In `src/app/layout.tsx`, add the imports and wrap `{children}`:

```tsx
import Footer from "@/components/layout/Footer";
import Nav from "@/components/layout/Nav";
```

Replace the body contents after the skip link with:

```tsx
        <Nav />
        {children}
        <Footer />
```

- [ ] **Step 8: Verify build and tests**

Run: `npm test && npm run build`
Expected: PASS both.

- [ ] **Step 9: Commit**

```bash
git add src/components src/app/layout.tsx
git commit -m "feat(layout): inline icons, sticky nav with active tracking, footer"
```

---

### Task 6: Hero section

**Files:**
- Create: `src/components/home/Hero.tsx`
- Modify: `src/app/page.tsx`
- Test: `src/components/home/Hero.test.tsx`

**Interfaces:**
- Consumes: `profile`, `Reveal`, `ArrowUpRightIcon`.
- Produces: `<Hero />`. The page's single `h1`.

- [ ] **Step 1: Write the failing test**

`src/components/home/Hero.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Hero from "@/components/home/Hero";

describe("Hero", () => {
  it("renders the greeting as the page h1", () => {
    render(<Hero />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Hi, I am Aron!");
  });

  it("renders the subheading verbatim", () => {
    render(<Hero />);
    expect(
      screen.getByText(
        "I build modern, scalable web applications with React and TypeScript, focusing on performance and clean UI.",
      ),
    ).toBeInTheDocument();
  });

  it("renders both calls to action pointing at the right anchors", () => {
    render(<Hero />);
    expect(screen.getByRole("link", { name: /View My Work/ })).toHaveAttribute(
      "href",
      "#projects",
    );
    expect(screen.getByRole("link", { name: /More About Me/ })).toHaveAttribute(
      "href",
      "#about",
    );
  });

  it("renders the title and location line", () => {
    render(<Hero />);
    expect(screen.getByText("Full-Stack Web Developer")).toBeInTheDocument();
    expect(
      screen.getByText("Križevci, Croatia · CET / CEST (UTC+1 / UTC+2)"),
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- src/components/home/Hero.test.tsx`
Expected: FAIL, cannot resolve `@/components/home/Hero`.

- [ ] **Step 3: Implement Hero**

The heading is one fluid `clamp()` line. The accent falls only on the name.

`src/components/home/Hero.tsx`:

```tsx
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
```

- [ ] **Step 4: Mount Hero on the home page**

`src/app/page.tsx`:

```tsx
import Hero from "@/components/home/Hero";

export default function HomePage() {
  return (
    <main id="main">
      <Hero />
    </main>
  );
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm test -- src/components/home/Hero.test.tsx`
Expected: PASS, 4 tests.

- [ ] **Step 6: Verify visually**

Run `npm run dev`, open `http://localhost:3100`. The hero should fill the viewport, the name should be copper, and the nav should sit above it. Stop the server.

- [ ] **Step 7: Commit**

```bash
git add src/components/home/Hero.tsx src/components/home/Hero.test.tsx src/app/page.tsx
git commit -m "feat(home): hero section"
```

---

### Task 7: About section, including portrait optimization

**Files:**
- Create: `src/components/home/About.tsx`
- Modify: `src/app/page.tsx`, `public/images/Profile.jpg` (resized in place)
- Test: `src/components/home/About.test.tsx`

**Interfaces:**
- Consumes: `profile`, `Section`, `Reveal`.
- Produces: `<About />` rendering into `<Section id="about" index="01" title="About">`.

- [ ] **Step 1: Resize the portrait**

The committed portrait is 3516x5274 and 2 MB, which is far larger than any rendered size. Resize in place to 1200px wide.

```bash
cd "/Users/aronmatoic/Documents/Main Projects/portfolio-real"
sips --resampleWidth 1200 -s format jpeg -s formatOptions 82 \
  public/images/Profile.jpg --out /tmp/profile-resized.jpg
mv /tmp/profile-resized.jpg public/images/Profile.jpg
sips -g pixelWidth -g pixelHeight public/images/Profile.jpg
ls -lh public/images/Profile.jpg
```

Expected: 1200x1800, well under 400 KB. The path stays `/images/Profile.jpg` so `profile.ts` needs no change.

- [ ] **Step 2: Write the failing test**

`src/components/home/About.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import About from "@/components/home/About";

describe("About", () => {
  it("renders the section heading", () => {
    render(<About />);
    expect(screen.getByRole("heading", { level: 2, name: "About" })).toBeInTheDocument();
  });

  it("renders both bio paragraphs verbatim", () => {
    render(<About />);
    expect(
      screen.getByText(/I’m a full-stack web developer with a strong focus/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/I like combining solid logic with thoughtful UI design/),
    ).toBeInTheDocument();
  });

  it("renders the portrait with an accessible name", () => {
    render(<About />);
    expect(screen.getByAltText("Aron Matoic")).toBeInTheDocument();
  });

  it("renders all three tech stack groups and every tool", () => {
    render(<About />);
    for (const name of ["Frontend", "Backend", "Tools & Platforms"]) {
      expect(screen.getByRole("heading", { level: 3, name })).toBeInTheDocument();
    }
    for (const tool of ["React", "Typescript", ".Net 8", "Supabase", "Vite"]) {
      expect(screen.getAllByText(tool).length).toBeGreaterThan(0);
    }
  });

  it("renders the learning line and the contact call to action", () => {
    render(<About />);
    expect(
      screen.getByText(
        "Currently learning .Net 8 to build better server-side applications",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Get in touch/ })).toHaveAttribute(
      "href",
      "#contact",
    );
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npm test -- src/components/home/About.test.tsx`
Expected: FAIL, cannot resolve `@/components/home/About`.

- [ ] **Step 4: Implement About**

`src/components/home/About.tsx`:

```tsx
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
```

- [ ] **Step 5: Mount About on the home page**

`src/app/page.tsx`:

```tsx
import About from "@/components/home/About";
import Hero from "@/components/home/Hero";

export default function HomePage() {
  return (
    <main id="main">
      <Hero />
      <About />
    </main>
  );
}
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `npm test -- src/components/home/About.test.tsx`
Expected: PASS, 5 tests.

- [ ] **Step 7: Commit**

```bash
git add src/components/home src/app/page.tsx public/images/Profile.jpg
git commit -m "feat(home): about section and portrait optimization"
```

---

### Task 8: Project card and projects section

**Files:**
- Create: `src/components/projects/ProjectCard.tsx`, `src/components/home/Projects.tsx`
- Modify: `src/app/page.tsx`
- Test: `src/components/projects/ProjectCard.test.tsx`, `src/components/home/Projects.test.tsx`

**Interfaces:**
- Consumes: `projects`, `Project`, `Section`, `Reveal`, `GitHubIcon`, `ArrowUpRightIcon`, `cn`.
- Produces: `<ProjectCard project: Project index: number />` and `<Projects />` rendering into `<Section id="projects" index="02" title="Selected Work">`.

- [ ] **Step 1: Write the failing test for ProjectCard**

`src/components/projects/ProjectCard.test.tsx`:

```tsx
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ProjectCard from "@/components/projects/ProjectCard";
import type { Project } from "@/content/projects";

const project: Project = {
  slug: "test-project",
  name: "Test Project",
  summary: "A short summary.",
  description: "A short summary. And a longer body that only the detail page shows.",
  image: "/images/ByteForge.png",
  imageAlt: "A screenshot",
  liveUrl: "https://example.com/live",
  repoUrl: "https://github.com/example/repo",
  stack: ["One", "Two", "Three", "Four", "Five", "Six", "Seven"],
  status: "in-progress",
};

describe("ProjectCard", () => {
  it("links the title to the detail page", () => {
    render(<ProjectCard project={project} index={0} />);
    expect(screen.getByRole("link", { name: "Test Project" })).toHaveAttribute(
      "href",
      "/projects/test-project",
    );
  });

  it("shows the summary, not the full description", () => {
    render(<ProjectCard project={project} index={0} />);
    expect(screen.getByText("A short summary.")).toBeInTheDocument();
    expect(screen.queryByText(/only the detail page shows/)).toBeNull();
  });

  it("caps visible stack chips at five and shows an overflow count", () => {
    render(<ProjectCard project={project} index={0} />);
    const chips = screen.getByRole("list", { name: "Tech stack" });
    expect(within(chips).getByText("One")).toBeInTheDocument();
    expect(within(chips).getByText("Five")).toBeInTheDocument();
    expect(within(chips).queryByText("Six")).toBeNull();
    expect(within(chips).getByText("+2")).toBeInTheDocument();
  });

  it("renders live and repo links as external siblings, never nested", () => {
    render(<ProjectCard project={project} index={0} />);
    const live = screen.getByRole("link", { name: /Live site/ });
    const repo = screen.getByRole("link", { name: /GitHub repository/ });
    expect(live).toHaveAttribute("href", "https://example.com/live");
    expect(live).toHaveAttribute("rel", "noopener noreferrer");
    expect(repo).toHaveAttribute("href", "https://github.com/example/repo");
    expect(live.closest("a[href='/projects/test-project']")).toBeNull();
  });

  it("marks in-progress projects", () => {
    render(<ProjectCard project={project} index={0} />);
    expect(screen.getByText("In progress")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- src/components/projects/ProjectCard.test.tsx`
Expected: FAIL, cannot resolve `@/components/projects/ProjectCard`.

- [ ] **Step 3: Implement ProjectCard**

Three sibling links, none nested: the screenshot and the title go to the detail page, and Live and GitHub go outward.

`src/components/projects/ProjectCard.tsx`:

```tsx
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
```

- [ ] **Step 4: Run the ProjectCard test to verify it passes**

Run: `npm test -- src/components/projects/ProjectCard.test.tsx`
Expected: PASS, 5 tests.

- [ ] **Step 5: Write the failing test for the Projects section**

`src/components/home/Projects.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Projects from "@/components/home/Projects";
import { projects } from "@/content/projects";

describe("Projects section", () => {
  it("renders the section heading", () => {
    render(<Projects />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Selected Work" }),
    ).toBeInTheDocument();
  });

  it("renders a card for every project", () => {
    render(<Projects />);
    for (const project of projects) {
      expect(
        screen.getByRole("heading", { level: 3, name: project.name }),
      ).toBeInTheDocument();
    }
  });
});
```

- [ ] **Step 6: Run the test to verify it fails**

Run: `npm test -- src/components/home/Projects.test.tsx`
Expected: FAIL, cannot resolve `@/components/home/Projects`.

- [ ] **Step 7: Implement the Projects section**

`src/components/home/Projects.tsx`:

```tsx
import Section from "@/components/layout/Section";
import ProjectCard from "@/components/projects/ProjectCard";
import { projects } from "@/content/projects";

export default function Projects() {
  return (
    <Section id="projects" index="02" title="Selected Work">
      <div className="grid gap-16 lg:grid-cols-2 lg:gap-x-12 lg:gap-y-20">
        {projects.map((project, index) => (
          <ProjectCard key={project.slug} project={project} index={index} />
        ))}
      </div>
    </Section>
  );
}
```

- [ ] **Step 8: Mount Projects on the home page**

`src/app/page.tsx`:

```tsx
import About from "@/components/home/About";
import Hero from "@/components/home/Hero";
import Projects from "@/components/home/Projects";

export default function HomePage() {
  return (
    <main id="main">
      <Hero />
      <About />
      <Projects />
    </main>
  );
}
```

- [ ] **Step 9: Run the full suite and build**

Run: `npm test && npm run build`
Expected: PASS both.

- [ ] **Step 10: Commit**

```bash
git add src/components/projects src/components/home src/app/page.tsx
git commit -m "feat(projects): project card and selected work section"
```

---

### Task 9: Project detail route and 404

**Files:**
- Create: `src/app/projects/[slug]/page.tsx`, `src/app/not-found.tsx`
- Test: `src/app/projects/detail.test.tsx`

**Interfaces:**
- Consumes: `projects`, `getProject`, icons.
- Produces: statically generated `/projects/<slug>` for all five slugs, `generateMetadata` per project, `notFound()` on an unknown slug.

- [ ] **Step 1: Write the failing test**

The page component is async, so the test awaits it and renders the resolved element. `notFound` is mocked to throw so the test can assert it was reached.

`src/app/projects/detail.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ProjectDetailPage, {
  generateStaticParams,
} from "@/app/projects/[slug]/page";
import { projects } from "@/content/projects";

vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));

describe("project detail page", () => {
  it("generates one static param per project", async () => {
    const params = await generateStaticParams();
    expect(params).toEqual(projects.map((p) => ({ slug: p.slug })));
  });

  it("renders the full description for a known slug", async () => {
    const element = await ProjectDetailPage({
      params: Promise.resolve({ slug: "minecraft-clone" }),
    });
    render(element);

    expect(
      screen.getByRole("heading", { level: 1, name: "Minecraft-clone" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/it’s a learning playground for experimenting/),
    ).toBeInTheDocument();
  });

  it("renders every stack entry, not a capped subset", async () => {
    const element = await ProjectDetailPage({
      params: Promise.resolve({ slug: "minecraft-clone" }),
    });
    render(element);

    for (const tool of ["React", "cannon-es", "@react-three/drei"]) {
      expect(screen.getByText(tool)).toBeInTheDocument();
    }
  });

  it("calls notFound for an unknown slug", async () => {
    await expect(
      ProjectDetailPage({ params: Promise.resolve({ slug: "nope" }) }),
    ).rejects.toThrow("NEXT_NOT_FOUND");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- src/app/projects/detail.test.tsx`
Expected: FAIL, cannot resolve the page module.

- [ ] **Step 3: Implement the detail page**

`src/app/projects/[slug]/page.tsx`:

```tsx
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
```

- [ ] **Step 4: Implement the 404 page**

`src/app/not-found.tsx`:

```tsx
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
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm test -- src/app/projects/detail.test.tsx`
Expected: PASS, 4 tests.

- [ ] **Step 6: Verify the routes build statically**

Run: `npm run build`
Expected: the route list shows `/projects/[slug]` prerendered with five paths, and `/projects`, `/about`, `/contact` listed as redirects.

- [ ] **Step 7: Commit**

```bash
git add src/app/projects src/app/not-found.tsx
git commit -m "feat(projects): static detail routes and 404 page"
```

---

### Task 10: Contact form validation rules

**Files:**
- Create: `src/lib/validation.ts`
- Test: `src/lib/validation.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `validateName`, `validateEmail`, `validateMessage`, `validateContact`, `hasErrors`, `isBot`, plus the types `FieldError`, `ContactFields`, `ContactErrors` and the bound constants `NAME_MIN`, `NAME_MAX`, `EMAIL_MAX`, `MESSAGE_MIN`, `MESSAGE_MAX`.

- [ ] **Step 1: Write the failing test**

`src/lib/validation.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import {
  hasErrors,
  isBot,
  MESSAGE_MAX,
  MESSAGE_MIN,
  NAME_MAX,
  NAME_MIN,
  validateContact,
  validateEmail,
  validateMessage,
  validateName,
} from "@/lib/validation";

describe("validateName", () => {
  it("rejects empty and whitespace-only input", () => {
    expect(validateName("")).toBeTruthy();
    expect(validateName("   ")).toBeTruthy();
  });

  it("rejects input below the minimum length", () => {
    expect(validateName("A".repeat(NAME_MIN - 1))).toBeTruthy();
  });

  it("accepts input at the minimum and maximum length", () => {
    expect(validateName("A".repeat(NAME_MIN))).toBeNull();
    expect(validateName("A".repeat(NAME_MAX))).toBeNull();
  });

  it("rejects input above the maximum length", () => {
    expect(validateName("A".repeat(NAME_MAX + 1))).toBeTruthy();
  });

  it("trims before measuring", () => {
    expect(validateName("  Aron  ")).toBeNull();
  });
});

describe("validateEmail", () => {
  it("rejects empty input", () => {
    expect(validateEmail("   ")).toBeTruthy();
  });

  it("rejects addresses without an @ or a dotted domain", () => {
    expect(validateEmail("aron")).toBeTruthy();
    expect(validateEmail("aron@")).toBeTruthy();
    expect(validateEmail("aron@localhost")).toBeTruthy();
    expect(validateEmail("aron @example.com")).toBeTruthy();
  });

  it("accepts a normal address", () => {
    expect(validateEmail("aronmatoic@gmail.com")).toBeNull();
    expect(validateEmail("  aron+tag@sub.example.co.uk  ")).toBeNull();
  });

  it("rejects absurdly long addresses", () => {
    expect(validateEmail(`${"a".repeat(250)}@example.com`)).toBeTruthy();
  });
});

describe("validateMessage", () => {
  it("rejects empty and too-short input", () => {
    expect(validateMessage("")).toBeTruthy();
    expect(validateMessage("A".repeat(MESSAGE_MIN - 1))).toBeTruthy();
  });

  it("accepts input at both bounds", () => {
    expect(validateMessage("A".repeat(MESSAGE_MIN))).toBeNull();
    expect(validateMessage("A".repeat(MESSAGE_MAX))).toBeNull();
  });

  it("rejects input above the maximum", () => {
    expect(validateMessage("A".repeat(MESSAGE_MAX + 1))).toBeTruthy();
  });
});

describe("validateContact and hasErrors", () => {
  const valid = {
    name: "Aron",
    email: "aronmatoic@gmail.com",
    message: "Hello there, I would like to work with you.",
    website: "",
  };

  it("reports no errors for valid input", () => {
    const errors = validateContact(valid);
    expect(errors).toEqual({ name: null, email: null, message: null });
    expect(hasErrors(errors)).toBe(false);
  });

  it("reports errors per field", () => {
    const errors = validateContact({ ...valid, email: "nope", message: "hi" });
    expect(errors.name).toBeNull();
    expect(errors.email).toBeTruthy();
    expect(errors.message).toBeTruthy();
    expect(hasErrors(errors)).toBe(true);
  });
});

describe("isBot", () => {
  it("is false when the honeypot is empty", () => {
    expect(isBot({ name: "A", email: "a@b.co", message: "x", website: "" })).toBe(false);
    expect(isBot({ name: "A", email: "a@b.co", message: "x", website: "  " })).toBe(false);
  });

  it("is true when the honeypot is filled", () => {
    expect(
      isBot({ name: "A", email: "a@b.co", message: "x", website: "spam.example" }),
    ).toBe(true);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- src/lib/validation.test.ts`
Expected: FAIL, cannot resolve `@/lib/validation`.

- [ ] **Step 3: Implement the validation rules**

`src/lib/validation.ts`:

```ts
export type FieldError = string | null;

export const NAME_MIN = 2;
export const NAME_MAX = 80;
export const EMAIL_MAX = 254;
export const MESSAGE_MIN = 10;
export const MESSAGE_MAX = 2000;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type ContactFields = {
  name: string;
  email: string;
  message: string;
  website: string;
};

export type ContactErrors = {
  name: FieldError;
  email: FieldError;
  message: FieldError;
};

export function validateName(raw: string): FieldError {
  const value = raw.trim();
  if (value.length === 0) return "Please enter your name.";
  if (value.length < NAME_MIN) return `Name must be at least ${NAME_MIN} characters.`;
  if (value.length > NAME_MAX) return `Name must be ${NAME_MAX} characters or fewer.`;
  return null;
}

export function validateEmail(raw: string): FieldError {
  const value = raw.trim();
  if (value.length === 0) return "Please enter your email address.";
  if (value.length > EMAIL_MAX) return `Email must be ${EMAIL_MAX} characters or fewer.`;
  if (!EMAIL_PATTERN.test(value)) return "Please enter a valid email address.";
  return null;
}

export function validateMessage(raw: string): FieldError {
  const value = raw.trim();
  if (value.length === 0) return "Please enter a message.";
  if (value.length < MESSAGE_MIN) return `Message must be at least ${MESSAGE_MIN} characters.`;
  if (value.length > MESSAGE_MAX) return `Message must be ${MESSAGE_MAX} characters or fewer.`;
  return null;
}

export function validateContact(fields: ContactFields): ContactErrors {
  return {
    name: validateName(fields.name),
    email: validateEmail(fields.email),
    message: validateMessage(fields.message),
  };
}

export function hasErrors(errors: ContactErrors): boolean {
  return Boolean(errors.name ?? errors.email ?? errors.message);
}

export function isBot(fields: ContactFields): boolean {
  return fields.website.trim().length > 0;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- src/lib/validation.test.ts`
Expected: PASS, all cases green.

- [ ] **Step 5: Commit**

```bash
git add src/lib/validation.ts src/lib/validation.test.ts
git commit -m "feat(contact): pure field validation rules"
```

---

### Task 11: Contact form

**Files:**
- Create: `src/components/contact/ContactForm.tsx`, `.env.example`, `.env.local`
- Test: `src/components/contact/ContactForm.test.tsx`

**Interfaces:**
- Consumes: validation helpers from Task 10, `cn`.
- Produces: `<ContactForm />` client component reading `NEXT_PUBLIC_EMAILJS_SERVICE_ID`, `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`, `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`.

- [ ] **Step 1: Create the env files**

`.env.example` is committed. `.env.local` is gitignored and holds the values lifted out of the old `ContactForm.tsx`.

`.env.example`:

```
# EmailJS browser SDK credentials. These are publishable client-side keys.
# Set the same three values in the Vercel project settings for every environment.
NEXT_PUBLIC_EMAILJS_SERVICE_ID=
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=
```

`.env.local`:

```
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_ia74sil
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_g0jpydr
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=aljzdYTLHXBa2O_0_
```

Confirm `git status` does not list `.env.local` before committing.

- [ ] **Step 2: Write the failing test**

`src/components/contact/ContactForm.test.tsx`:

```tsx
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ContactForm from "@/components/contact/ContactForm";

const sendForm = vi.fn();

vi.mock("@emailjs/browser", () => ({
  default: { sendForm: (...args: unknown[]) => sendForm(...args) },
}));

beforeEach(() => {
  sendForm.mockReset();
  sendForm.mockResolvedValue({ status: 200, text: "OK" });
  vi.stubEnv("NEXT_PUBLIC_EMAILJS_SERVICE_ID", "svc");
  vi.stubEnv("NEXT_PUBLIC_EMAILJS_TEMPLATE_ID", "tpl");
  vi.stubEnv("NEXT_PUBLIC_EMAILJS_PUBLIC_KEY", "key");
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.useRealTimers();
});

async function fillValid(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Name"), "Aron");
  await user.type(screen.getByLabelText("Email"), "aron@example.com");
  await user.type(
    screen.getByLabelText("Message"),
    "Hello, I would like to talk about a project.",
  );
}

describe("ContactForm", () => {
  it("shows validation errors and does not send when submitted empty", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.click(screen.getByRole("button", { name: "Send Message" }));

    expect(await screen.findByText("Please enter your name.")).toBeInTheDocument();
    expect(screen.getByText("Please enter your email address.")).toBeInTheDocument();
    expect(screen.getByText("Please enter a message.")).toBeInTheDocument();
    expect(sendForm).not.toHaveBeenCalled();
  });

  it("marks invalid fields with aria-invalid", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.click(screen.getByRole("button", { name: "Send Message" }));

    expect(screen.getByLabelText("Name")).toHaveAttribute("aria-invalid", "true");
  });

  it("sends and reports success for valid input", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await fillValid(user);
    await user.click(screen.getByRole("button", { name: "Send Message" }));

    await waitFor(() => expect(sendForm).toHaveBeenCalledTimes(1));
    expect(sendForm.mock.calls[0][0]).toBe("svc");
    expect(sendForm.mock.calls[0][1]).toBe("tpl");
    expect(
      await screen.findByText("Email sent successfully!"),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toHaveValue("");
  });

  it("reports failure and keeps the entered values", async () => {
    sendForm.mockRejectedValue(new Error("network"));
    const user = userEvent.setup();
    render(<ContactForm />);

    await fillValid(user);
    await user.click(screen.getByRole("button", { name: "Send Message" }));

    expect(await screen.findByText("Failed to send email")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toHaveValue("Aron");
  });

  it("clears the status message after three seconds", async () => {
    vi.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<ContactForm />);

    await fillValid(user);
    await user.click(screen.getByRole("button", { name: "Send Message" }));
    await vi.waitFor(() =>
      expect(screen.getByText("Email sent successfully!")).toBeInTheDocument(),
    );

    act(() => {
      vi.advanceTimersByTime(3100);
    });

    expect(screen.queryByText("Email sent successfully!")).toBeNull();
  });

  it("silently drops submissions when the honeypot is filled", async () => {
    const user = userEvent.setup();
    const { container } = render(<ContactForm />);

    await fillValid(user);
    const honeypot = container.querySelector<HTMLInputElement>(
      "input[name='website']",
    );
    expect(honeypot).not.toBeNull();
    await user.type(honeypot!, "spam.example");
    await user.click(screen.getByRole("button", { name: "Send Message" }));

    await waitFor(() => expect(sendForm).not.toHaveBeenCalled());
  });

  it("disables submit and explains when EmailJS is not configured", () => {
    vi.stubEnv("NEXT_PUBLIC_EMAILJS_SERVICE_ID", "");
    render(<ContactForm />);

    expect(screen.getByRole("button", { name: "Send Message" })).toBeDisabled();
    expect(
      screen.getByText(/contact form is not configured/i),
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npm test -- src/components/contact/ContactForm.test.tsx`
Expected: FAIL, cannot resolve `@/components/contact/ContactForm`.

- [ ] **Step 4: Implement ContactForm**

Env vars are read through `process.env.NEXT_PUBLIC_*` with full literal property access, which is what Next's build-time inlining requires. Fields are controlled so a failed send can preserve them.

`src/components/contact/ContactForm.tsx`:

```tsx
"use client";

import emailjs from "@emailjs/browser";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import {
  hasErrors,
  isBot,
  validateContact,
  type ContactErrors,
  type ContactFields,
} from "@/lib/validation";

const EMPTY_FIELDS: ContactFields = { name: "", email: "", message: "", website: "" };
const NO_ERRORS: ContactErrors = { name: null, email: null, message: null };

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? "";
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? "";
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "";

const FIELD_CLASS =
  "w-full rounded-sm border border-rule bg-surface px-4 py-3 text-ink placeholder:text-ink-faint transition-colors focus:border-accent";

export default function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [fields, setFields] = useState<ContactFields>(EMPTY_FIELDS);
  const [errors, setErrors] = useState<ContactErrors>(NO_ERRORS);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<"idle" | "sent" | "failed">("idle");

  const configured =
    SERVICE_ID.length > 0 && TEMPLATE_ID.length > 0 && PUBLIC_KEY.length > 0;

  useEffect(() => {
    if (status === "idle") return;
    const timer = setTimeout(() => setStatus("idle"), 3000);
    return () => clearTimeout(timer);
  }, [status]);

  const update = (key: keyof ContactFields) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFields((current) => ({ ...current, [key]: event.target.value }));
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending || !configured) return;

    if (isBot(fields)) {
      setFields(EMPTY_FIELDS);
      return;
    }

    const nextErrors = validateContact(fields);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;
    if (!formRef.current) return;

    setSending(true);
    try {
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY);
      setFields(EMPTY_FIELDS);
      setErrors(NO_ERRORS);
      setStatus("sent");
    } catch {
      setStatus("failed");
    } finally {
      setSending(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <Field
        id="name"
        label="Name"
        error={errors.name}
        value={fields.name}
        onChange={update("name")}
      />
      <Field
        id="email"
        label="Email"
        type="email"
        error={errors.email}
        value={fields.email}
        onChange={update("email")}
      />
      <Field
        id="message"
        label="Message"
        multiline
        error={errors.message}
        value={fields.message}
        onChange={update("message")}
      />

      <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Leave this field empty</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={fields.website}
          onChange={update("website")}
        />
      </div>

      {!configured && (
        <p className="font-mono text-xs text-ink-faint">
          The contact form is not configured right now. Email me directly instead.
        </p>
      )}

      <button
        type="submit"
        disabled={sending || !configured}
        className="w-fit rounded-full bg-accent px-6 py-3 font-mono text-sm text-canvas transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        {sending ? "Sending..." : "Send Message"}
      </button>

      <p
        aria-live="polite"
        className={cn(
          "font-mono text-sm",
          status === "sent" && "text-accent",
          status === "failed" && "text-red-400",
        )}
      >
        {status === "sent" && "Email sent successfully!"}
        {status === "failed" && "Failed to send email"}
      </p>
    </form>
  );
}

type FieldProps = {
  id: "name" | "email" | "message";
  label: string;
  error: string | null;
  value: string;
  type?: string;
  multiline?: boolean;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
};

function Field({ id, label, error, value, type = "text", multiline, onChange }: FieldProps) {
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-mono text-xs uppercase tracking-[0.16em] text-ink-faint">
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          name={id}
          rows={5}
          value={value}
          onChange={onChange}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(FIELD_CLASS, "resize-y", error && "border-red-400")}
        />
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(FIELD_CLASS, error && "border-red-400")}
        />
      )}
      {error && (
        <p id={errorId} className="font-mono text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
```

Note on the "not configured" test: module-level `process.env` reads are captured at import time, so `vi.stubEnv` in that one test will not change them. Make that test work by moving the three reads inside the component body (`const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? ""` etc. declared at the top of `ContactForm`). Do that if the test fails; it is the correct fix, not a workaround.

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm test -- src/components/contact/ContactForm.test.tsx`
Expected: PASS, 7 tests.

- [ ] **Step 6: Commit**

```bash
git add src/components/contact .env.example
git commit -m "feat(contact): validated emailjs contact form with env-based config"
```

Confirm `.env.local` is not in the commit.

---

### Task 12: Contact info panel and contact section

**Files:**
- Create: `src/components/contact/CopyEmailButton.tsx`, `src/components/contact/ContactInfo.tsx`, `src/components/home/Contact.tsx`
- Modify: `src/app/page.tsx`
- Test: `src/components/contact/CopyEmailButton.test.tsx`, `src/components/home/Contact.test.tsx`

**Interfaces:**
- Consumes: `profile`, `Section`, `Reveal`, `ContactForm`, icons.
- Produces: `<CopyEmailButton email: string />`, `<ContactInfo />`, `<Contact />` rendering into `<Section id="contact" index="03" title="Get in Touch">`.

- [ ] **Step 1: Write the failing test for CopyEmailButton**

`src/components/contact/CopyEmailButton.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import CopyEmailButton from "@/components/contact/CopyEmailButton";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("CopyEmailButton", () => {
  it("shows the email address by default", () => {
    render(<CopyEmailButton email="aronmatoic@gmail.com" />);
    expect(
      screen.getByRole("button", { name: /aronmatoic@gmail.com/ }),
    ).toBeInTheDocument();
  });

  it("copies to the clipboard and flips the label", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { ...navigator, clipboard: { writeText } });

    const user = userEvent.setup();
    render(<CopyEmailButton email="aronmatoic@gmail.com" />);
    await user.click(screen.getByRole("button"));

    expect(writeText).toHaveBeenCalledWith("aronmatoic@gmail.com");
    expect(await screen.findByText("Copied!")).toBeInTheDocument();
  });

  it("shows a manual hint when copying fails", async () => {
    const writeText = vi.fn().mockRejectedValue(new Error("denied"));
    vi.stubGlobal("navigator", { ...navigator, clipboard: { writeText } });

    const user = userEvent.setup();
    render(<CopyEmailButton email="aronmatoic@gmail.com" />);
    await user.click(screen.getByRole("button"));

    expect(await screen.findByText("Press Ctrl+C to copy")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- src/components/contact/CopyEmailButton.test.tsx`
Expected: FAIL, cannot resolve the module.

- [ ] **Step 3: Implement CopyEmailButton**

Keeps the old site's `execCommand` fallback for non-secure contexts and adds a real failure state instead of only logging.

`src/components/contact/CopyEmailButton.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";

type CopyState = "idle" | "copied" | "failed";

const LABELS: Record<CopyState, string | null> = {
  idle: null,
  copied: "Copied!",
  failed: "Press Ctrl+C to copy",
};

export default function CopyEmailButton({ email }: { email: string }) {
  const [state, setState] = useState<CopyState>("idle");

  useEffect(() => {
    if (state === "idle") return;
    const timer = setTimeout(() => setState("idle"), 2000);
    return () => clearTimeout(timer);
  }, [state]);

  async function copy() {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(email);
      } else {
        const area = document.createElement("textarea");
        area.value = email;
        document.body.appendChild(area);
        area.select();
        document.execCommand("copy");
        document.body.removeChild(area);
      }
      setState("copied");
    } catch {
      setState("failed");
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="text-left text-sm text-ink-muted transition-colors hover:text-accent"
    >
      {LABELS[state] ?? email}
    </button>
  );
}
```

- [ ] **Step 4: Run the CopyEmailButton test to verify it passes**

Run: `npm test -- src/components/contact/CopyEmailButton.test.tsx`
Expected: PASS, 3 tests.

- [ ] **Step 5: Implement ContactInfo**

`src/components/contact/ContactInfo.tsx`:

```tsx
import CopyEmailButton from "@/components/contact/CopyEmailButton";
import { GitHubIcon, LinkedInIcon, MailIcon } from "@/components/icons";
import { profile } from "@/content/profile";

const ICONS = {
  email: MailIcon,
  linkedin: LinkedInIcon,
  github: GitHubIcon,
} as const;

export default function ContactInfo() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h3 className="font-display text-2xl">{profile.contact.heading}</h3>
        <p className="text-sm text-ink-muted">{profile.contact.subheading}</p>
      </div>

      <ul className="flex flex-col divide-y divide-rule border-y border-rule">
        {profile.contact.channels.map((channel) => {
          const Icon = ICONS[channel.kind];
          return (
            <li key={channel.kind} className="flex items-center gap-4 py-4">
              <Icon className="h-4 w-4 shrink-0 text-ink-faint" />
              <span className="w-24 shrink-0 font-mono text-xs uppercase tracking-[0.14em] text-ink-faint">
                {channel.label}
              </span>
              {channel.kind === "email" ? (
                <CopyEmailButton email={profile.contact.email} />
              ) : (
                <a
                  href={channel.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-ink-muted transition-colors hover:text-accent"
                >
                  {channel.display}
                </a>
              )}
            </li>
          );
        })}
      </ul>

      <ul className="flex flex-col gap-3">
        {profile.contact.facts.map((fact) => (
          <li key={fact.label} className="flex gap-3 font-mono text-xs">
            <span className="text-ink-faint">{fact.label}</span>
            <span className="text-ink-muted">{fact.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 6: Write the failing test for the Contact section**

`src/components/home/Contact.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Contact from "@/components/home/Contact";

vi.mock("@emailjs/browser", () => ({ default: { sendForm: vi.fn() } }));

describe("Contact section", () => {
  it("renders the section heading", () => {
    render(<Contact />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Get in Touch" }),
    ).toBeInTheDocument();
  });

  it("renders the intro copy verbatim", () => {
    render(<Contact />);
    expect(
      screen.getByText(
        "Have a question or want to work together? I'm always open to new opportunities. Feel free to reach out and I'll get back to you as soon as possible.",
      ),
    ).toBeInTheDocument();
  });

  it("renders the form and the info panel together", () => {
    render(<Contact />);
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Let's work together" })).toBeInTheDocument();
    expect(screen.getByText("Croatia (Remote-friendly)")).toBeInTheDocument();
    expect(screen.getByText("Usually within 24 hours")).toBeInTheDocument();
  });

  it("links LinkedIn and GitHub externally", () => {
    render(<Contact />);
    const linkedin = screen.getByRole("link", { name: "/aron-matoic-4818282b6" });
    expect(linkedin).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/aron-matoic-4818282b6/",
    );
    expect(linkedin).toHaveAttribute("rel", "noopener noreferrer");
  });
});
```

- [ ] **Step 7: Run the test to verify it fails**

Run: `npm test -- src/components/home/Contact.test.tsx`
Expected: FAIL, cannot resolve `@/components/home/Contact`.

- [ ] **Step 8: Implement the Contact section**

`src/components/home/Contact.tsx`:

```tsx
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";
import Reveal from "@/components/layout/Reveal";
import Section from "@/components/layout/Section";
import { profile } from "@/content/profile";

export default function Contact() {
  return (
    <Section id="contact" index="03" title="Get in Touch">
      <div className="grid gap-14 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-20">
        <Reveal>
          <div className="flex flex-col gap-8">
            <p className="max-w-[54ch] leading-relaxed text-ink-muted">
              {profile.contact.intro}
            </p>
            <ContactForm />
          </div>
        </Reveal>
        <Reveal delay={100}>
          <ContactInfo />
        </Reveal>
      </div>
    </Section>
  );
}
```

- [ ] **Step 9: Mount Contact on the home page**

`src/app/page.tsx`:

```tsx
import About from "@/components/home/About";
import Contact from "@/components/home/Contact";
import Hero from "@/components/home/Hero";
import Projects from "@/components/home/Projects";

export default function HomePage() {
  return (
    <main id="main">
      <Hero />
      <About />
      <Projects />
      <Contact />
    </main>
  );
}
```

- [ ] **Step 10: Run the full suite and build**

Run: `npm test && npm run build`
Expected: PASS both.

- [ ] **Step 11: Commit**

```bash
git add src/components src/app/page.tsx
git commit -m "feat(contact): contact section with info panel and copy-email button"
```

---

### Task 13: Social and crawler metadata

**Files:**
- Create: `src/app/opengraph-image.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`
- Test: `src/app/metadata.test.ts`

**Interfaces:**
- Consumes: `profile`, `projects`.
- Produces: a generated 1200x630 OG image at `/opengraph-image`, `sitemap()` returning six entries, `robots()` allowing all crawlers.

- [ ] **Step 1: Write the failing test**

`src/app/metadata.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";

describe("sitemap", () => {
  it("lists the home page and every project detail page", () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toContain(`${profile.siteUrl}/`);
    for (const project of projects) {
      expect(urls).toContain(`${profile.siteUrl}/projects/${project.slug}`);
    }
    expect(entries).toHaveLength(projects.length + 1);
  });
});

describe("robots", () => {
  it("allows all crawlers and points at the sitemap", () => {
    const result = robots();
    expect(result.rules).toEqual({ userAgent: "*", allow: "/" });
    expect(result.sitemap).toBe(`${profile.siteUrl}/sitemap.xml`);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- src/app/metadata.test.ts`
Expected: FAIL, cannot resolve `@/app/robots`.

- [ ] **Step 3: Implement sitemap and robots**

`src/app/sitemap.ts`:

```ts
import type { MetadataRoute } from "next";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: `${profile.siteUrl}/`, lastModified, changeFrequency: "monthly", priority: 1 },
    ...projects.map((project) => ({
      url: `${profile.siteUrl}/projects/${project.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
```

`src/app/robots.ts`:

```ts
import type { MetadataRoute } from "next";
import { profile } from "@/content/profile";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${profile.siteUrl}/sitemap.xml`,
  };
}
```

- [ ] **Step 4: Implement the Open Graph image**

Uses the built-in `ImageResponse`, which supports a subset of CSS and no Tailwind, so the values are inline and literal here on purpose.

`src/app/opengraph-image.tsx`:

```tsx
import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${profile.name}, ${profile.title}`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0a0a0b",
          color: "#f5f3ef",
          padding: "72px",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, color: "#e08a3c", letterSpacing: 6 }}>
          AM
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 108, lineHeight: 1 }}>{profile.name}</div>
          <div style={{ display: "flex", height: 2, width: 160, backgroundColor: "#e08a3c" }} />
          <div style={{ fontSize: 36, color: "#a3a099" }}>{profile.title}</div>
        </div>
      </div>
    ),
    size,
  );
}
```

- [ ] **Step 5: Run the test and build to verify**

Run: `npm test && npm run build`
Expected: PASS. The build output must list `/opengraph-image`, `/sitemap.xml`, and `/robots.txt`.

- [ ] **Step 6: Commit**

```bash
git add src/app/sitemap.ts src/app/robots.ts src/app/opengraph-image.tsx src/app/metadata.test.ts
git commit -m "feat(seo): sitemap, robots, and generated open graph image"
```

---

### Task 14: Playwright browser sims

**Files:**
- Create: `playwright.config.ts`, `sims/home.sim.ts`, `sims/projects.sim.ts`, `sims/contact.sim.ts`, `sims/responsive.sim.ts`, `sims/accessibility.sim.ts`
- Test: the sims are the test

**Interfaces:**
- Consumes: the running production build on port 3100.
- Produces: `npm run sim` as the browser verification gate.

- [ ] **Step 1: Write the Playwright configuration**

Port 3100 is mandatory. The user runs other services on 3000 and 8090; never bind those.

`playwright.config.ts`:

```ts
import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./sims",
  testMatch: "**/*.sim.ts",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: { baseURL, trace: "on-first-retry" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `npm run build && npx next start -p ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
  },
});
```

- [ ] **Step 2: Write the home page sims**

`sims/home.sim.ts`:

```ts
import { expect, test } from "@playwright/test";

test("hero, sections, and nav all render", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Hi, I am Aron!");
  await expect(page.locator("#about")).toBeVisible();
  await expect(page.locator("#projects")).toBeVisible();
  await expect(page.locator("#contact")).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
});

test("each nav link scrolls to its section and becomes current", async ({ page }) => {
  await page.goto("/");

  for (const [label, id] of [
    ["Projects", "projects"],
    ["About", "about"],
    ["Contact", "contact"],
  ] as const) {
    await page.getByRole("link", { name: label, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    await expect
      .poll(async () => {
        const box = await page.locator(`#${id}`).boundingBox();
        return box ? Math.abs(box.y) : Number.MAX_SAFE_INTEGER;
      }, { timeout: 5000 })
      .toBeLessThan(200);
    await expect(
      page.getByRole("link", { name: label, exact: true }),
    ).toHaveAttribute("aria-current", "true");
  }
});

test("the skip link moves focus to the main landmark", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await skip.press("Enter");
  await expect(page).toHaveURL(/#main$/);
});

test("no console errors or failed requests on the home page", async ({ page }) => {
  const problems: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") problems.push(`console: ${msg.text()}`);
  });
  page.on("requestfailed", (req) =>
    problems.push(`request: ${req.url()} ${req.failure()?.errorText}`),
  );

  await page.goto("/", { waitUntil: "networkidle" });
  expect(problems).toEqual([]);
});

test("reduced motion renders content visible immediately", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/");

  const heading = page.locator("#contact h2");
  await expect(heading).toHaveCSS("opacity", "1");
  await context.close();
});
```

- [ ] **Step 3: Write the projects and routing sims**

`sims/projects.sim.ts`:

```ts
import { expect, test } from "@playwright/test";
import { projects } from "../src/content/projects";

test("every project has a card on the home page", async ({ page }) => {
  await page.goto("/#projects");
  for (const project of projects) {
    await expect(
      page.getByRole("heading", { level: 3, name: project.name, exact: true }),
    ).toBeVisible();
  }
});

for (const project of projects) {
  test(`${project.slug} detail page renders its full description`, async ({ page }) => {
    await page.goto(`/projects/${project.slug}`);

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(project.name);
    await expect(page.getByText(project.description, { exact: false })).toBeVisible();

    await expect(
      page.getByRole("link", { name: "Visit live site" }),
    ).toHaveAttribute("href", project.liveUrl);
    await expect(
      page.getByRole("link", { name: "View source" }),
    ).toHaveAttribute("href", project.repoUrl);
  });
}

test("clicking a project title opens its detail page", async ({ page }) => {
  await page.goto("/#projects");
  await page
    .getByRole("link", { name: projects[0].name, exact: true })
    .first()
    .click();
  await expect(page).toHaveURL(new RegExp(`/projects/${projects[0].slug}$`));
});

test("old routes redirect to their anchors", async ({ page }) => {
  for (const [from, hash] of [
    ["/projects", "#projects"],
    ["/about", "#about"],
    ["/contact", "#contact"],
  ] as const) {
    await page.goto(from);
    await expect(page).toHaveURL(new RegExp(`/${hash.replace("#", "\\#")}$`));
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  }
});

test("an unknown slug renders the 404 page", async ({ page }) => {
  const response = await page.goto("/projects/does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Page not found");
});

test("no console errors on a detail page", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  await page.goto(`/projects/${projects[0].slug}`, { waitUntil: "networkidle" });
  expect(errors).toEqual([]);
});
```

- [ ] **Step 4: Write the contact sims**

`sims/contact.sim.ts`:

```ts
import { expect, test } from "@playwright/test";

const EMAILJS = "**/api.emailjs.com/**";

test("submitting an empty form shows errors and sends nothing", async ({ page }) => {
  let called = false;
  await page.route(EMAILJS, async (route) => {
    called = true;
    await route.fulfill({ status: 200, body: "OK" });
  });

  await page.goto("/#contact");
  await page.getByRole("button", { name: "Send Message" }).click();

  await expect(page.getByText("Please enter your name.")).toBeVisible();
  await expect(page.getByText("Please enter your email address.")).toBeVisible();
  await expect(page.getByText("Please enter a message.")).toBeVisible();
  expect(called).toBe(false);
});

test("a valid submission reports success and clears the fields", async ({ page }) => {
  await page.route(EMAILJS, (route) => route.fulfill({ status: 200, body: "OK" }));

  await page.goto("/#contact");
  await page.getByLabel("Name").fill("Aron");
  await page.getByLabel("Email").fill("aron@example.com");
  await page.getByLabel("Message").fill("Hello, I would like to talk about a project.");
  await page.getByRole("button", { name: "Send Message" }).click();

  await expect(page.getByText("Email sent successfully!")).toBeVisible();
  await expect(page.getByLabel("Name")).toHaveValue("");
});

test("a failed submission reports failure and keeps the fields", async ({ page }) => {
  await page.route(EMAILJS, (route) => route.fulfill({ status: 500, body: "nope" }));

  await page.goto("/#contact");
  await page.getByLabel("Name").fill("Aron");
  await page.getByLabel("Email").fill("aron@example.com");
  await page.getByLabel("Message").fill("Hello, I would like to talk about a project.");
  await page.getByRole("button", { name: "Send Message" }).click();

  await expect(page.getByText("Failed to send email")).toBeVisible();
  await expect(page.getByLabel("Name")).toHaveValue("Aron");
});

test("the copy email button writes to the clipboard", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/#contact");

  await page.getByRole("button", { name: "aronmatoic@gmail.com" }).click();
  await expect(page.getByText("Copied!")).toBeVisible();

  const clipboard = await page.evaluate(() => navigator.clipboard.readText());
  expect(clipboard).toBe("aronmatoic@gmail.com");
});
```

- [ ] **Step 5: Write the responsive and accessibility sims**

`sims/responsive.sim.ts`:

```ts
import { expect, test } from "@playwright/test";

const VIEWPORTS = [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
];

for (const viewport of VIEWPORTS) {
  test(`no horizontal overflow at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/", { waitUntil: "networkidle" });

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test(`nav and hero stay visible at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: "Projects", exact: true })).toBeVisible();
  });
}
```

`sims/accessibility.sim.ts`:

```ts
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { projects } from "../src/content/projects";

test("home page has no serious or critical accessibility violations", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();

  const blocking = results.violations.filter((v) =>
    ["serious", "critical"].includes(v.impact ?? ""),
  );
  expect(blocking.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
});

test("a project detail page has no serious or critical accessibility violations", async ({ page }) => {
  await page.goto(`/projects/${projects[0].slug}`, { waitUntil: "networkidle" });

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();

  const blocking = results.violations.filter((v) =>
    ["serious", "critical"].includes(v.impact ?? ""),
  );
  expect(blocking.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
});
```

- [ ] **Step 6: Run the sims**

Run: `npm run sim`
Expected: all sims pass. If the accessibility sim reports contrast failures on `text-ink-faint`, raise that token toward `#7d7a73` and re-run rather than suppressing the rule.

- [ ] **Step 7: Commit**

```bash
git add playwright.config.ts sims
git commit -m "test: playwright browser sims for routing, contact, responsive, and a11y"
```

---

### Task 15: Documentation and deployment readiness

**Files:**
- Modify: `README.md`
- Verify: no leftover Vite artifacts, both suites green

**Interfaces:**
- Consumes: everything.
- Produces: a branch ready to merge and deploy.

- [ ] **Step 1: Rewrite the README**

The current README is untouched Vite template boilerplate.

`README.md`:

````markdown
# Portfolio

Personal portfolio for Aron Matoic. One scrolling page with hero, about,
selected work, and contact sections, plus a statically generated detail page
per project.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · EmailJS ·
Vitest · Playwright · Deployed on Vercel

## Local development

```bash
npm install
cp .env.example .env.local   # then fill in the EmailJS values
npm run dev                  # http://localhost:3100
```

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Dev server on port 3100 |
| `npm run build` | Production build |
| `npm start` | Serve the production build on port 3100 |
| `npm test` | Vitest unit tests |
| `npm run sim` | Playwright browser sims against a production build |
| `npm run lint` | ESLint |

## Environment variables

| Name | Purpose |
| --- | --- |
| `NEXT_PUBLIC_EMAILJS_SERVICE_ID` | EmailJS service the contact form posts to |
| `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` | EmailJS template used for the message |
| `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` | EmailJS publishable browser key |

All three are publishable client-side keys by EmailJS design. They must also be
set in the Vercel project settings for every environment.

## Content

All written content lives in `src/content/`. `profile.ts` holds identity, bio,
tech stacks, and contact details. `projects.ts` holds the project list. Adding a
project means appending one object to that array; the home page grid, the detail
route, and the sitemap all pick it up automatically.

## Design notes

The design spec is at `docs/superpowers/specs/2026-08-04-portfolio-rebuild-design.md`
and the implementation plan at `docs/superpowers/plans/2026-08-04-portfolio-rebuild.md`.
````

- [ ] **Step 2: Verify no Vite artifacts survive**

```bash
cd "/Users/aronmatoic/Documents/Main Projects/portfolio-real"
git ls-files | grep -Ei 'vite|vercel\.json|tsconfig\.(app|node)' || echo "clean"
grep -rn "react-router\|react-icons\|@emailjs" src --include=*.tsx --include=*.ts | grep -v "@emailjs/browser" || echo "clean"
```

Expected: `clean` from both. `vite.config.ts` and `vercel.json` must be gone, and `vite` should only appear as a listed tool inside `profile.ts`.

- [ ] **Step 3: Verify no hardcoded copy escaped the content modules**

```bash
grep -rn "Aron Matoic\|Križevci\|aronmatoic@gmail" src --include=*.tsx | grep -v "src/content/"
```

Expected: no matches. Any hit means a component hardcoded copy that belongs in `src/content/`; move it before continuing.

- [ ] **Step 4: Run the full verification**

```bash
npm run lint
npm test
npm run build
npm run sim
```

Expected: all four pass. Fix anything that fails; do not proceed with a red suite.

- [ ] **Step 5: Commit**

```bash
git add README.md
git commit -m "docs: rewrite readme for the next.js rebuild"
```

- [ ] **Step 6: Report deployment prerequisites to the user**

Do not merge and do not change Vercel settings without the user. Report these three items, which are the spec's open risks:

1. The Vercel project's framework preset is currently Vite and must be switched to Next.js before a production deploy, or the build will fail.
2. The three `NEXT_PUBLIC_EMAILJS_*` variables must be added to the Vercel project for Production, Preview, and Development.
3. `vercel.json` was deleted because its catch-all SPA rewrite would swallow every new route. Nothing needs to replace it.

---

## Self-Review

**Spec coverage:**

| Spec section | Task |
| --- | --- |
| Stack table | 1 |
| Routes and redirects | 1 (config), 9 (detail route) |
| What survives from the old repo | 1, 15 |
| File layout | 1 through 13 |
| Data model | 2 |
| Content inventory: identity, hero, about, projects, contact | 2 |
| Visual system: color, type, layout, motion | 3, 4 |
| Nav behavior | 5 |
| Project card behavior including no nested anchors | 8 |
| Project detail page | 9 |
| Contact form validation and env vars | 10, 11 |
| Copy email button with fallback | 12 |
| Error handling table | 9 (404), 11 (send failure, missing env), 12 (clipboard) |
| Accessibility | 3 (skip link, focus), 5, 8, 12, 14 (axe) |
| SEO | 3 (root metadata), 9 (per-project), 13 |
| Testing: Vitest units | 1, 2, 4, 6, 7, 8, 9, 10, 11, 12, 13 |
| Testing: Playwright sims | 14 |
| Rollout | 15 |
| Open risks | 15 |

No spec requirement is unassigned.

**Placeholder scan:** No "TBD", no "add appropriate error handling", no "similar to Task N". Every code step carries the actual code.

**Type consistency:** `Project` fields are declared once in Task 2 and used with identical names in Tasks 8, 9, 13, and 14. `profile` keys are declared in Task 2 and read in Tasks 3, 5, 6, 7, 12, and 13. `cn` keeps one signature throughout. `ContactFields` and `ContactErrors` are declared in Task 10 and consumed unchanged in Task 11. `useActiveSection(ids: readonly string[])` in Task 4 matches the `as const` array passed in Task 5. `Reveal` accepts `delay` and `className` in Task 4 and both are used in Tasks 6, 7, 8, and 12.

**Known follow-up:** Task 11 Step 4 flags that the three module-level `process.env` reads must move inside the component for the "not configured" test to pass under `vi.stubEnv`. That is called out in the task rather than left to discovery.
