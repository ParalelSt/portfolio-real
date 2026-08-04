import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Hero from "@/components/home/Hero";

describe("Hero", () => {
  it("renders the greeting as the page h1", () => {
    render(<Hero />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Hi, I am Aron!");
  });

  it("renders the subheading verbatim", () => {
    render(<Hero />);
    expect(
      screen.getByText(
        "I build modern, scalable web applications with React and TypeScript, focusing on performance and clean UI.",
      ),
    ).toBeInTheDocument();
  });

  it("renders both calls to action pointing at the right anchors", () => {
    render(<Hero />);
    expect(screen.getByRole("link", { name: /View My Work/ })).toHaveAttribute(
      "href",
      "#projects",
    );
    expect(screen.getByRole("link", { name: /More About Me/ })).toHaveAttribute(
      "href",
      "#about",
    );
  });

  it("renders the title and location line", () => {
    render(<Hero />);
    expect(screen.getByText("Full-Stack Web Developer")).toBeInTheDocument();
    expect(
      screen.getByText("Križevci, Croatia · CET / CEST (UTC+1 / UTC+2)"),
    ).toBeInTheDocument();
  });
});
