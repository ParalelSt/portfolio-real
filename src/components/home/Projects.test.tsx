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
