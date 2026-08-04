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
