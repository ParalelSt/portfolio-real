import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Contact from "@/components/home/Contact";

vi.mock("@emailjs/browser", () => ({ default: { sendForm: vi.fn() } }));

describe("Contact section", () => {
  it("renders the section heading", () => {
    render(<Contact />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Get in Touch" }),
    ).toBeInTheDocument();
  });

  it("renders the intro copy verbatim", () => {
    render(<Contact />);
    expect(
      screen.getByText(
        "Have a question or want to work together? I'm always open to new opportunities. Feel free to reach out and I'll get back to you as soon as possible.",
      ),
    ).toBeInTheDocument();
  });

  it("renders the form and the info panel together", () => {
    render(<Contact />);
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Let's work together" })).toBeInTheDocument();
    expect(screen.getByText("Croatia (Remote-friendly)")).toBeInTheDocument();
    expect(screen.getByText("Usually within 24 hours")).toBeInTheDocument();
  });

  it("links LinkedIn and GitHub externally", () => {
    render(<Contact />);
    const linkedin = screen.getByRole("link", { name: "/aron-matoic-4818282b6" });
    expect(linkedin).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/aron-matoic-4818282b6/",
    );
    expect(linkedin).toHaveAttribute("rel", "noopener noreferrer");
  });
});
