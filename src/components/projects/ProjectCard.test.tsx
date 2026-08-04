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
