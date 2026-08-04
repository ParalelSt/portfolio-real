import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ProjectDetailPage, {
  generateStaticParams,
} from "@/app/projects/[slug]/page";
import { projects } from "@/content/projects";

vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));

describe("project detail page", () => {
  it("generates one static param per project", async () => {
    const params = await generateStaticParams();
    expect(params).toEqual(projects.map((p) => ({ slug: p.slug })));
  });

  it("renders the full description for a known slug", async () => {
    const element = await ProjectDetailPage({
      params: Promise.resolve({ slug: "minecraft-clone" }),
    });
    render(element);

    expect(
      screen.getByRole("heading", { level: 1, name: "Minecraft-clone" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/it’s a learning playground for experimenting/),
    ).toBeInTheDocument();
  });

  it("renders every stack entry, not a capped subset", async () => {
    const element = await ProjectDetailPage({
      params: Promise.resolve({ slug: "minecraft-clone" }),
    });
    render(element);

    for (const tool of ["React", "cannon-es", "@react-three/drei"]) {
      expect(screen.getByText(tool)).toBeInTheDocument();
    }
  });

  it("calls notFound for an unknown slug", async () => {
    await expect(
      ProjectDetailPage({ params: Promise.resolve({ slug: "nope" }) }),
    ).rejects.toThrow("NEXT_NOT_FOUND");
  });
});
