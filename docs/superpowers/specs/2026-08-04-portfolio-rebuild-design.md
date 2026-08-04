# Portfolio Rebuild Design

Date: 2026-08-04
Repo: ParalelSt/portfolio-real
Branch: `rebuild`

## Goal

Rebuild the personal portfolio site from scratch. Every piece of written content
carries over unchanged from the current site. Every piece of styling, layout, and
component structure is discarded and redesigned.

The current site is React 19 + Vite + React Router + Tailwind 4, four routes, a
violet-on-black theme. The rebuild is Next.js 16 App Router, one scrolling page
plus per-project detail routes, an editorial dark theme with a copper accent.

## Non-goals

- No new written content. Copy is transcribed, not rewritten.
- No CMS. Content stays in typed TypeScript modules.
- No blog, no dark/light toggle, no i18n, no analytics.
- No redesign of the linked projects themselves.

## Architecture

### Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16, App Router, static generation |
| Language | TypeScript, `strict: true` |
| Styling | Tailwind CSS 4, theme tokens in `@theme` |
| Fonts | `next/font/google`: Instrument Serif, Inter, JetBrains Mono |
| Images | `next/image` |
| Mail | EmailJS browser SDK, IDs in env vars |
| Unit tests | Vitest + React Testing Library |
| Browser tests | Playwright |
| Hosting | Vercel, existing project, preview deploy from `rebuild` |

Next.js is chosen over staying on Vite for per-route metadata and Open Graph
tags, `next/image` optimization of the seven screenshots and the 2 MB profile
photo, and static generation of the project detail routes.

### Routes

| Route | Type | Purpose |
| --- | --- | --- |
| `/` | Static | Single scrolling page: hero, about, projects, contact |
| `/projects/[slug]` | Static, `generateStaticParams` | One detail page per project |
| `/projects`, `/about`, `/contact` | Permanent redirect | Preserve old URLs, send to `/#projects`, `/#about`, `/#contact` |

The redirects live in `next.config.ts`. They exist because the current live site
uses those paths and they may already be linked from elsewhere.

### What survives from the old repo

Kept: `public/images/*`, `CHANGELOG.md`, `.changlogrc.json`, and the
`standard-version` release and changelog scripts, so version history stays
continuous.

Replaced: all of `src/`, `index.html`, `vite.config.ts`, `postcss.config.js`, the
three `tsconfig` files, `eslint.config.js`, and `package.json` dependencies.

Deleted: `vercel.json`, whose catch-all SPA rewrite would swallow the new routes.
`README.md` is rewritten, since it is currently the untouched Vite template
boilerplate and describes nothing about this project.

### File layout

```
src/
  app/
    layout.tsx              root layout, fonts, metadata, skip link
    page.tsx                home, composes the four sections
    opengraph-image.tsx     generated OG card
    sitemap.ts
    robots.ts
    projects/[slug]/page.tsx
    not-found.tsx
  components/
    layout/Nav.tsx          sticky nav, active-section tracking
    layout/Footer.tsx
    layout/Section.tsx      numbered section shell with heading
    layout/Reveal.tsx       intersection-observer reveal wrapper
    home/Hero.tsx
    home/About.tsx
    home/Projects.tsx
    home/Contact.tsx
    projects/ProjectCard.tsx
    contact/ContactForm.tsx
    contact/ContactInfo.tsx
    contact/CopyEmailButton.tsx
  content/
    profile.ts              identity, bio, tech stacks, contact details
    projects.ts             Project[] and the Project type
  hooks/
    useActiveSection.ts
  lib/
    validation.ts           contact form field validation, pure functions
  styles/globals.css
```

Content modules export plain typed data with no JSX. Presentation never hardcodes
copy. Adding a project means appending one object to `projects.ts`.

### Data model

```ts
export type Project = {
  slug: string;          // URL segment, unique, kebab-case
  name: string;
  description: string;   // full prose, shown on detail page
  summary: string;       // first sentence, shown on card
  image: string;         // path under /images
  imageAlt: string;
  liveUrl: string;
  repoUrl: string;
  stack: string[];
  status: "live" | "in-progress";
};
```

`slug` is new and replaces the old numeric `id`. `summary` is new and is derived
from the existing description text, not newly written prose: it is the first
sentence of the existing description, verbatim. For Car Ownership Intelligence,
whose whole description is `Build in progress`, summary and description are the
same string. `status` is new and encodes what the old site expressed by writing
"Build in progress" into the description field.

## Content inventory

Transcribed from `src/pages/*` and `src/components/*` at commit `19e4f1e`.

### Identity

- Name: Aron Matoic
- Title: Full-Stack Web Developer
- Location line: `Križevci, Croatia · CET / CEST (UTC+1 / UTC+2)`

### Hero

- Heading: `Hi, I am Aron!` with `Aron` in the accent color
- Subheading: `I build modern, scalable web applications with React and TypeScript, focusing on performance and clean UI.`
- Primary action: `View My Work` to `#projects`
- Secondary action: `More About Me` to `#about`

### About

Paragraph one:

> I'm a full-stack web developer with a strong focus on frontend development. I
> enjoy building clean, responsive, and user-friendly interfaces, primarily
> working with React and TypeScript.

Paragraph two:

> I like combining solid logic with thoughtful UI design, while continuously
> expanding my backend knowledge to build more complete applications.

Closing line, italic:

> Currently learning .Net 8 to build better server-side applications

Tech stacks:

| Group | Tools |
| --- | --- |
| Frontend | React, Javascript, Typescript, SCSS, Tailwind |
| Backend | Node.js, Express, .Net 8 |
| Tools & Platforms | Git, Vite, Vercel, Supabase |

Photo: `/images/Profile.jpg`.

Call to action at the end of the section: `Get in touch` to `#contact`.

### Projects

Five projects, in this order. Descriptions are the existing text verbatim.

1. **ByteForge Webshop** (`byteforge`), status live
   - Image `/images/ByteForge.png`, live `https://byte-forge-rho.vercel.app/`, repo `https://github.com/ParalelSt/ByteForge`
   - Stack: React, Typescript, SCSS, Node.js, Express, Supabase, Vercel
2. **Aron's Handbook (Gym Logbook)** (`arons-handbook`), status live
   - Image `/images/AronSHandBook.png`, live `https://www.aronshandbook.digital/login`, repo `https://github.com/ParalelSt/Arons-handbook`
   - Stack: React, Typescript, Tailwind, Node.js, Express, Supabase, Vercel, AI Development
3. **Minecraft-clone** (`minecraft-clone`), status in-progress
   - Image `/images/Minecraft-clone.png`, live `https://minecraft-clone-dun.vercel.app/`, repo `https://github.com/ParalelSt/Minecraft-clone`
   - Stack: React, Typescript, Three.js, @react-three/fiber, @react-three/drei, Zustand, cannon-es, Vercel, AI Development
4. **Panora** (`panora`), status live
   - Image `/images/Panora.png`, live `https://handpan-learning-app.vercel.app`, repo `https://github.com/ParalelSt/Handpan-Learning-App`
   - Stack: React, TypeScript, Next.js, Tailwind, Zustand, Drizzle ORM, Neon, Postgres, NextAuth, Vercel, AI Development
5. **Car Ownership Intelligence** (`car-ownership-intelligence`), status in-progress
   - Description: `Build in progress`
   - Image `/images/CarOwnershipIntelligence.png`, live `https://car-ownership-intelligence.vercel.app/login`, repo `https://github.com/ParalelSt/Car-Ownership-Intelligence`
   - Stack: React, Typescript, Tailwind, Vercel, .Net 8, PostgreSQL

Two corrections applied to the transcribed data, both fixing typos in the source
rather than changing meaning:

- `PostreSQL` becomes `PostgreSQL`.
- The old stack list contains `"Drizzle"` and `"ORM"` as two separate chips. They
  become one chip, `Drizzle ORM`.

Dropped from the old data:

- The `id: 6` project with every field empty. It existed only to pad the flex row
  and was rendered with `invisible`. The new grid does not need it.
- PC Upgrade Advisor. It was removed in commit `19e4f1e`, the most recent
  statement of intent. `public/images/PCUpgradeAdvisor.png` and
  `public/images/PostsAPI.png` stay on disk but are unreferenced.

### Contact

Intro:

> Have a question or want to work together? I'm always open to new opportunities.
> Feel free to reach out and I'll get back to you as soon as possible.

Info panel heading: `Let's work together`, subheading `Open to opportunities and collaborations`.

| Channel | Value | Behavior |
| --- | --- | --- |
| Email | `aronmatoic@gmail.com` | Copy to clipboard, label flips to `Copied!` for 2s |
| LinkedIn | `https://www.linkedin.com/in/aron-matoic-4818282b6/` | Shown as `/aron-matoic-4818282b6` |
| GitHub | `https://github.com/ParalelSt` | Shown as `/ParalelSt` |

Facts: `Location: Croatia (Remote-friendly)`, `Response time: Usually within 24 hours`.

Form fields: Name, Email, Message. Submit label `Send Message`, sending label
`Sending...`, success `Email sent successfully!`, failure `Failed to send email`.

## Visual system

A deliberate departure from the current violet-on-black theme. Nothing from
`src/index.css` carries over.

### Color

| Token | Value | Use |
| --- | --- | --- |
| `--color-canvas` | `#0A0A0B` | Page background, warm-cast near-black |
| `--color-surface` | `#121213` | Raised panels, form fields |
| `--color-rule` | `rgba(245, 243, 239, 0.10)` | Hairline dividers and borders |
| `--color-ink` | `#F5F3EF` | Primary text, warm off-white |
| `--color-ink-muted` | `#A3A099` | Secondary text |
| `--color-ink-faint` | `#6B6862` | Metadata, section numbers |
| `--color-accent` | `#E08A3C` | Copper accent |
| `--color-accent-hover` | `#C87330` | Accent hover state |

Accent is used sparingly: the name in the hero, the active nav underline, focus
rings, link hover, and the in-progress status dot. It is never a large fill.

Contrast: ink on canvas is roughly 17:1, ink-muted on canvas roughly 7:1, accent
on canvas roughly 7:1. All clear 4.5:1. `ink-faint` on canvas is roughly 3.6:1 and
is therefore restricted to non-essential decorative metadata at 14px or larger,
never to body copy.

### Type

| Role | Family | Notes |
| --- | --- | --- |
| Display | Instrument Serif | Hero heading, section headings, project titles |
| Body | Inter | Paragraphs, form labels, navigation |
| Mono | JetBrains Mono | Section numbers, stack chips, metadata labels |

The serif display against mono metadata is the primary signal that the site is
designed rather than assembled from defaults. Hero heading is fluid via `clamp()`,
roughly 3rem to 7rem. Body copy is 1rem with 1.65 line height and a 68ch measure.

### Layout and rhythm

- Content column max width 1200px, gutters 1.5rem mobile and 2rem from `md`.
- Section vertical padding roughly 8rem desktop, 5rem mobile.
- Sections are separated by hairline rules, not cards or shadows.
- Each section is labeled with a mono number and title: `01 / About`.
- Projects grid: one column mobile, two from `lg`. Cards are borderless, screenshot
  first at full card width, hairline rule underneath, then text.

### Motion

- Reveal on scroll: opacity 0 to 1 and 12px rise, 500ms, staggered 60ms between
  siblings, triggered by IntersectionObserver at 15% visibility, fired once.
- Nav shrinks in height and gains a hairline bottom rule after 40px of scroll.
- Active nav link underline animates between sections.
- Project screenshot lifts 4px and brightens slightly on hover.
- Every one of these is suppressed under `prefers-reduced-motion: reduce`, which
  is implemented as a single global CSS rule that zeroes transition and animation
  durations, plus a check inside the reveal hook so revealed content starts
  visible rather than transitioning to visible.

## Component behavior

### Nav

Sticky at the top. Left is the `AM` monogram linking to `/`, right is Projects,
About, Contact. On `/` these are anchor links to the corresponding sections; on a
project detail page they are links back to `/#section`. The active link is derived
from `useActiveSection`, which observes the four section elements and reports the
one nearest the top of the viewport. On viewports below `md` the links collapse
into a single row of smaller text rather than a hamburger menu, since there are
only three of them.

### Project card

Screenshot rendered with `next/image` at a 16:10 container with `object-cover`.
Title in display serif. Summary clamped to two lines. Stack chips in mono, capped
at five visible with a `+N` chip when there are more, since Panora and
Minecraft-clone have nine each. In-progress projects show a small copper dot with
the label `In progress`.

The card contains three sibling links and no nested ones: the screenshot and the
title both point at the detail page, and `Live` and `GitHub` sit in a row beneath
the stack chips. Wrapping the whole card in an anchor is explicitly rejected,
because the card has to contain the outbound live and repo links and anchors
cannot nest.

The old `Show More` toggle is removed. It mutated DOM classes through a ref, which
is not how React should express state, and the detail page now serves that purpose.

### Project detail page

`generateStaticParams` over the projects array. Renders the screenshot, the full
description, the complete stack list, live and repo links, and a back link to
`/#projects`. An unknown slug calls `notFound()`.

Per-page metadata: title is the project name, description is the summary, Open
Graph image is the project screenshot.

### Contact form

Client component. Fields Name, Email, Message, plus a visually hidden honeypot
field named `website` that must stay empty.

Validation lives in `lib/validation.ts` as pure functions so it is unit testable
without a DOM:

| Field | Rule |
| --- | --- |
| Name | Trimmed length 2 to 80 |
| Email | Trimmed, non-empty, matches a basic address shape, max 254 |
| Message | Trimmed length 10 to 2000 |
| Honeypot | Must be empty, otherwise submission is silently dropped |

Errors render under the offending field and are announced with `aria-describedby`
and `aria-invalid`. Submission is blocked while any error is present.

On submit the form disables the button, shows `Sending...`, and calls
`emailjs.sendForm` with IDs read from environment variables. Success resets the
form and shows the success message; failure shows the failure message. Either
message clears after 3 seconds and is rendered in an `aria-live="polite"` region.

Environment variables, documented in a committed `.env.example`:

```
NEXT_PUBLIC_EMAILJS_SERVICE_ID=
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=
```

The existing values move from source into `.env.local`, which is gitignored, and
into the Vercel project settings. These are publishable client-side keys by
EmailJS design, so this is a hygiene improvement and a configurability
improvement, not a secrecy fix. If the variables are missing at runtime the form
renders with the submit button disabled and an explanatory message rather than
failing silently on click.

### Copy email button

Uses `navigator.clipboard.writeText`. If the Clipboard API is unavailable the
button falls back to selecting a temporary textarea and calling
`document.execCommand("copy")`, matching current behavior. On success the label
becomes `Copied!` for 2 seconds. On failure it becomes `Press Ctrl+C to copy` and
the email text is selected, rather than only logging to the console as it does
today.

## Error handling

| Situation | Behavior |
| --- | --- |
| Unknown project slug | `notFound()`, custom 404 with a link home |
| EmailJS send fails | Inline failure message, form retains input so nothing is lost |
| EmailJS env vars missing | Submit disabled, explanatory note shown |
| Clipboard unavailable | Fallback copy path, then manual-copy hint |
| Image fails to load | `next/image` renders alt text against the surface color |

## Accessibility

- Landmarks: one `header`, one `main`, one `footer`, sections as `section` with
  `aria-labelledby` pointing at their heading.
- Skip-to-content link, first focusable element, visible on focus.
- Heading order is strictly `h1` once in the hero, then `h2` per section, then
  `h3` for project and stack-group titles.
- Focus-visible rings in accent at 2px offset on every interactive element.
- Alt text on all images: descriptive per project, `Aron Matoic` for the portrait.
- External links carry `rel="noopener noreferrer"`.
- Reduced motion respected as described above.

## SEO

- Root metadata: title `Aron Matoic | Full-Stack Web Developer`, description from
  the hero subheading, canonical URL, Open Graph and Twitter card tags.
- Generated OG image at `app/opengraph-image.tsx` using the display font, name,
  title, and accent rule.
- `sitemap.ts` emits `/` plus one entry per project.
- `robots.ts` allows all and points at the sitemap.
- Profile photo resized from 3516x5274 down to a 1200px-wide source before commit,
  then served responsively.

## Testing

Two layers. Both must pass before the branch merges.

### Vitest units

`npm test`

- `content/projects.ts`: every project has non-empty `slug`, `name`, `description`,
  `summary`, `image`, `imageAlt`, `liveUrl`, `repoUrl`, and at least one stack
  entry; slugs are unique; `liveUrl` and `repoUrl` parse as valid `https:` URLs;
  every `image` path exists on disk under `public/`.
- `content/profile.ts`: identity fields non-empty, three tech stack groups each
  with at least one tool, contact URLs valid.
- `lib/validation.ts`: each field rule at its boundaries, both valid and invalid,
  including whitespace-only input and the honeypot rule.
- `ContactForm`: renders errors for invalid input, blocks submit while invalid,
  disables the button and shows `Sending...` during flight, shows success and
  failure messages, clears them after 3 seconds with fake timers, and drops
  submissions when the honeypot is filled. EmailJS is mocked.
- `useActiveSection`: reports the correct section given mocked observer entries.

### Playwright sims

`npm run sim`, run against a production build.

- Home renders the hero heading, all three nav links, all five project cards, and
  the contact form.
- Clicking each nav link scrolls to the matching section and marks that link active.
- Every project card links to a detail page that renders the matching title and
  full description.
- Every `Live` and `GitHub` href is a well-formed absolute URL. The links are
  checked for shape, not followed, so the suite does not depend on third-party
  uptime.
- `/projects`, `/about`, `/contact` each redirect to the right anchor on `/`.
- An unknown slug such as `/projects/does-not-exist` renders the 404 page.
- Contact form: submitting empty shows validation errors and does not call
  EmailJS; valid input with the EmailJS network call stubbed to success shows the
  success message and clears the fields; stubbed to failure shows the failure
  message and keeps the fields.
- Copy email button sets clipboard content and flips its label.
- Layout holds with no horizontal overflow at 375px, 768px, and 1440px.
- With `prefers-reduced-motion: reduce` emulated, section content is visible
  immediately and no transition is in flight.
- No console errors or failed requests on `/` or on a project detail page.
- Axe accessibility scan on `/` and one detail page reports no violations at
  serious or critical severity.

## Rollout

1. Build on `rebuild`, commit in reviewable steps.
2. Vercel preview deploy from the branch, checked on a real phone and desktop.
3. Set the three EmailJS variables in Vercel project settings for all environments.
4. Merge to `main` once both test suites pass and the preview is approved.

## Open risks

- The Vercel project is currently configured for a Vite build. The framework
  preset needs switching to Next.js at merge time, or the production deploy will
  fail. `vercel.json` currently contains a SPA rewrite that must be deleted, since
  it would swallow the new routes.
- Instrument Serif has a limited weight range. If it reads too thin at small
  sizes, the fallback is to use it for display only, which is already the plan,
  and never below 1.5rem.
