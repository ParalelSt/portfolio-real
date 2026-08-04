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
