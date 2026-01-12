import type { Project } from "@/pages/Projects";
import { Link } from "react-router-dom";

interface ProjectCardProp {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProp) => {
  return (
    <Link
      to={project.link}
      className="flex flex-col w-full h-full border-2 border-accent rounded-lg"
    >
      <div className="flex w-full min-h-40 justify-center items-center rounded-tl-lg rounded-tr-lg overflow-hidden">
        <img
          className="w-auto h-auto object-cover rounded-tl-lg rounded-tr-lg"
          src={project.image}
          alt="project-image"
        />
      </div>
      <div className="flex flex-col justify-center px-5 pt-3 pb-4 rounded-bl-lg rounded-br-lg">
        <h3>{project.name}</h3>
        <p className="mt-3 text-sm">{project.description}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {project.stack.map((t) => (
            <span
              className="p-2 border-1 border-border rounded-xl text-sm"
              key={t}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
