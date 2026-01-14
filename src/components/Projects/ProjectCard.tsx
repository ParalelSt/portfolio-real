import type { Project } from "@/pages/Projects";
import { useRef, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";

interface ProjectCardProp {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProp) => {
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  const [buttonTextToggle, setButtonTextToggle] = useState<
    "Show More" | "Show Less"
  >("Show More");

  const expandDesc = () => {
    if (buttonTextToggle === "Show More") {
      descriptionRef?.current?.classList.add("h-auto");
      descriptionRef?.current?.classList.remove("h-6");

      setButtonTextToggle("Show Less");
    } else {
      descriptionRef?.current?.classList.add("h-6");
      descriptionRef?.current?.classList.remove("h-auto");
      setButtonTextToggle("Show More");
    }
  };

  return (
    <div className="flex flex-col w-full h-full border-2 border-accent rounded-lg md:max-w-80 lg:max-w-110">
      <Link
        to={project.link}
        className="flex w-full min-h-40 justify-center items-center rounded-tl-lg rounded-tr-lg overflow-hidden"
      >
        <img
          className="w-auto h-auto object-cover rounded-tl-lg rounded-tr-lg"
          src={project.image}
          alt="project-image"
        />
      </Link>
      <div className="flex flex-col justify-center px-5 pt-3 pb-4 rounded-bl-lg rounded-br-lg">
        <h3 className="font-bold">{project.name}</h3>
        <p
          className="h-6 mt-3 text-sm leading-sm overflow-y-hidden lg:leading-base"
          ref={descriptionRef}
        >
          {project.description}
        </p>
        <div className="flex gap-2 items-center">
          <Link
            to={project.repoLink}
            className="flex justify-center items-center gap-1 w-25 mt-2 p-1.5 text-sm border-1 border-transparent rounded-xl bg-accent-hover btn-highlight"
          >
            <FaGithub className="bg-transparent" />
            <span className="font-semibold bg-transparent">GitHub</span>
          </Link>
          <button
            className="flex justify-center items-center w-25 mt-2 p-1.5 text-sm border-1 rounded-xl cursor-pointer btn-highlight"
            onClick={expandDesc}
          >
            {buttonTextToggle}
          </button>
        </div>
        <div className="flex flex-wrap items-start gap-2 mt-3">
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
    </div>
  );
};

export default ProjectCard;
