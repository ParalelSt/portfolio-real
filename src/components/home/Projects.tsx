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
