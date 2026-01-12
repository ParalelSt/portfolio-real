import ProjectCard from "@/components/Projects/ProjectCard";

export interface Project {
  id: number;
  name: string;
  description: string;
  image: string;
  link: string;
  stack: string[];
}

const Projects = () => {
  const projects: Project[] = [
    {
      id: 1,
      name: "ByteForge Webshop",
      description:
        "ByteForge is a full-stack gaming and tech webshop offering (fake) products such as GFUEL, gaming peripherals, PC components, accessories, and games. It is built with React and TypeScript on the frontend, styled using SCSS, and powered by a Node.js + Express backend with Supabase for database and authentication. The project is deployed on Vercel.",
      image: "../public/images/ByteForge.png",
      link: "https://byte-forge-rho.vercel.app/",
      stack: [
        "React",
        "Typescript",
        "SCSS",
        "Node.js",
        "Express.js",
        "Supabase",
        "Vercel",
      ],
    },

    {
      id: 2,
      name: "Aron's Handbook (Gym Logbook)",
      description: "",
      image: "../public/images/AronSHandBook.png",
      link: "https://arons-handbook.vercel.app/login",
      stack: [
        "React",
        "Typescript",
        "SCSS",
        "Node.js",
        "Express.js",
        "Supabase",
        "Vercel",
      ],
    },
  ];

  return (
    <div className="flex flex-col w-full min-h-full mb-auto p-1 pt-5">
      <h2>Projects</h2>

      <div className="flex flex-col md:flex-row gap-4 py-5 w-full justify-items-center">
        {projects.map((p: Project) => (
          <ProjectCard project={p} key={p.id} />
        ))}
      </div>
    </div>
  );
};

export default Projects;
