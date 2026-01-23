import ProjectCard from "@/components/Projects/ProjectCard";

export interface Project {
  id: number;
  name: string;
  description: string;
  image: string;
  link: string;
  stack: string[];
  repoLink: string;
}

const Projects = () => {
  const projects: Project[] = [
    {
      id: 1,
      name: "ByteForge Webshop",
      description:
        "ByteForge is a full-stack gaming and tech webshop offering (fake) products such as GFUEL, gaming peripherals, PC components, accessories, and games. It is built with React and TypeScript on the frontend, styled using SCSS, and powered by a Node.js + Express backend with Supabase for database and authentication. The project is deployed on Vercel.",
      image: "../images/ByteForge.png",
      link: "https://byte-forge-rho.vercel.app/",
      stack: [
        "React",
        "Typescript",
        "SCSS",
        "Node.js",
        "Express",
        "Supabase",
        "Vercel",
      ],
      repoLink: "https://github.com/ParalelSt/ByteForge",
    },

    {
      id: 2,
      name: "Aron's Handbook (Gym Logbook)",
      description:
        "Aron's Handbook is a gym logbook application for tracking workouts, including reps and weights, while supporting training templates, structured programs, and personal goals. It is built with React and TypeScript, styled using Tailwind CSS, powered by Supabase for backend and authentication, deployed on Vercel, and developed with the help of AI-assisted prompts.",
      image: "../images/AronSHandBook.png",
      link: "https://arons-handbook.vercel.app/login",
      stack: [
        "React",
        "Typescript",
        "Tailwind",
        "Node.js",
        "Express",
        "Supabase",
        "Vercel",
        "AI development",
      ],
      repoLink: "https://github.com/ParalelSt/Arons-handbook",
    },

    {
      id: 3,
      name: "Minecraft-clone",
      description:
        "A Minecraft-inspired voxel sandbox built as a personal hobby project. This project is work in progress and not intended as a finished game — it’s a learning playground for experimenting with 3D rendering, physics, and game mechanics on the web. Built with React + TypeScript, react-three-fiber, and @react-three/cannon.",
      image: "../images/Minecraft-clone.png",
      link: "https://minecraft-clone-67xl.vercel.app/",
      stack: [
        "React",
        "Typescript",
        "Three.js",
        "@react-three/fiber",
        "@react-three/drei",
        "Zustand",
        "cannon-es",
      ],
      repoLink: "https://github.com/ParalelSt/Minecraft-clone",
    },
  ];

  return (
    <div className="flex flex-col w-full min-h-full mb-auto p-1 pt-5">
      <h2>Projects</h2>

      <div className="flex flex-col gap-10 mt-5 md:mt-7 w-full justify-between sm-custom:flex-row flex-wrap">
        {projects.map((p: Project) => (
          <ProjectCard project={p} key={p.id} />
        ))}
      </div>
    </div>
  );
};

export default Projects;
