import { describe, expect, it } from "vitest";
import { profile } from "@/content/profile";

describe("profile content", () => {
  it("carries the identity fields over", () => {
    expect(profile.name).toBe("Aron Matoic");
    expect(profile.title).toBe("Full-Stack Web Developer");
    expect(profile.locationLine).toBe(
      "Križevci, Croatia · CET / CEST (UTC+1 / UTC+2)",
    );
  });

  it("keeps the hero copy split so the name can be accented", () => {
    expect(profile.hero.greeting.before).toBe("Hi, I am ");
    expect(profile.hero.greeting.accent).toBe("Aron");
    expect(profile.hero.greeting.after).toBe("!");
    expect(profile.hero.subheading).toContain("React and TypeScript");
  });

  it("has two bio paragraphs and a learning line", () => {
    expect(profile.bio).toHaveLength(2);
    expect(profile.bio.every((p) => p.trim().length > 0)).toBe(true);
    expect(profile.learning).toBe(
      "Currently learning .Net 8 to build better server-side applications",
    );
  });

  it("has three tech stack groups, each with tools", () => {
    expect(profile.techStacks).toHaveLength(3);
    expect(profile.techStacks.map((g) => g.name)).toEqual([
      "Frontend",
      "Backend",
      "Tools & Platforms",
    ]);
    for (const group of profile.techStacks) {
      expect(group.tools.length).toBeGreaterThan(0);
    }
  });

  it("has three contact channels with valid hrefs", () => {
    expect(profile.contact.channels).toHaveLength(3);
    for (const channel of profile.contact.channels) {
      expect(channel.label.trim().length).toBeGreaterThan(0);
      expect(channel.display.trim().length).toBeGreaterThan(0);
      expect(() => new URL(channel.href)).not.toThrow();
    }
  });

  it("exposes the email address on its own for the copy button", () => {
    expect(profile.contact.email).toBe("aronmatoic@gmail.com");
  });

  it("has two contact facts", () => {
    expect(profile.contact.facts).toEqual([
      { label: "Location", value: "Croatia (Remote-friendly)" },
      { label: "Response time", value: "Usually within 24 hours" },
    ]);
  });

  it("has an https site url for canonical metadata", () => {
    expect(new URL(profile.siteUrl).protocol).toBe("https:");
  });
});
