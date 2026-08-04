import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getProject, projects } from "@/content/projects";

const publicDir = join(process.cwd(), "public");

describe("projects content", () => {
  it("has exactly five projects", () => {
    expect(projects).toHaveLength(5);
  });

  it("has unique slugs", () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it.each(projects.map((p) => [p.slug, p] as const))(
    "%s has every required field populated",
    (_slug, project) => {
      expect(project.slug).toMatch(/^[a-z0-9-]+$/);
      expect(project.name.trim().length).toBeGreaterThan(0);
      expect(project.description.trim().length).toBeGreaterThan(0);
      expect(project.summary.trim().length).toBeGreaterThan(0);
      expect(project.imageAlt.trim().length).toBeGreaterThan(0);
      expect(project.stack.length).toBeGreaterThan(0);
      expect(project.stack.every((t) => t.trim().length > 0)).toBe(true);
    },
  );

  it.each(projects.map((p) => [p.slug, p] as const))(
    "%s has https live and repo urls",
    (_slug, project) => {
      expect(new URL(project.liveUrl).protocol).toBe("https:");
      expect(new URL(project.repoUrl).protocol).toBe("https:");
    },
  );

  it.each(projects.map((p) => [p.slug, p] as const))(
    "%s points at a screenshot that exists on disk",
    (_slug, project) => {
      expect(project.image.startsWith("/images/")).toBe(true);
      expect(existsSync(join(publicDir, project.image))).toBe(true);
    },
  );

  it("starts each summary with the same text as its description", () => {
    for (const project of projects) {
      expect(project.description.startsWith(project.summary)).toBe(true);
    }
  });

  it("looks a project up by slug", () => {
    expect(getProject("panora")?.name).toBe("Panora");
  });

  it("returns undefined for an unknown slug", () => {
    expect(getProject("nope")).toBeUndefined();
  });

  it("preserves the original curly apostrophe and em dash in the description", () => {
    const minecraft = getProject("minecraft-clone");
    expect(minecraft?.description).toContain("it’s a learning playground");
    expect(minecraft?.description).toContain("finished game — it");
  });
});
