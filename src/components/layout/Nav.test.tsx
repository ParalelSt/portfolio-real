import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Nav from "@/components/layout/Nav";

vi.mock("@/hooks/useActiveSection", () => ({
  useActiveSection: () => "projects",
}));

describe("Nav", () => {
  it("renders the monogram home link", () => {
    render(<Nav />);
    expect(screen.getByRole("link", { name: "Aron Matoic, home" })).toHaveAttribute(
      "href",
      "/",
    );
  });

  it("renders all three section links pointing at anchors on the home page", () => {
    render(<Nav />);
    expect(screen.getByRole("link", { name: "Projects" })).toHaveAttribute(
      "href",
      "/#projects",
    );
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute(
      "href",
      "/#about",
    );
    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute(
      "href",
      "/#contact",
    );
  });

  it("marks the active section link as current", () => {
    render(<Nav />);
    expect(screen.getByRole("link", { name: "Projects" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(screen.getByRole("link", { name: "About" })).not.toHaveAttribute(
      "aria-current",
    );
  });
});
