import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import About from "@/components/home/About";

describe("About", () => {
  it("renders the section heading", () => {
    render(<About />);
    expect(screen.getByRole("heading", { level: 2, name: "About" })).toBeInTheDocument();
  });

  it("renders both bio paragraphs verbatim", () => {
    render(<About />);
    expect(
      screen.getByText(/I’m a full-stack web developer with a strong focus/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/I like combining solid logic with thoughtful UI design/),
    ).toBeInTheDocument();
  });

  it("renders the portrait with an accessible name", () => {
    render(<About />);
    expect(screen.getByAltText("Aron Matoic")).toBeInTheDocument();
  });

  it("renders all three tech stack groups and every tool", () => {
    render(<About />);
    for (const name of ["Frontend", "Backend", "Tools & Platforms"]) {
      expect(screen.getByRole("heading", { level: 3, name })).toBeInTheDocument();
    }
    for (const tool of ["React", "Typescript", ".Net 8", "Supabase", "Vite"]) {
      expect(screen.getAllByText(tool).length).toBeGreaterThan(0);
    }
  });

  it("renders the learning line and the contact call to action", () => {
    render(<About />);
    expect(
      screen.getByText(
        "Currently learning .Net 8 to build better server-side applications",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Get in touch/ })).toHaveAttribute(
      "href",
      "#contact",
    );
  });
});
