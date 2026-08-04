import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useActiveSection } from "@/hooks/useActiveSection";
import { observerCallbacks } from "../../vitest.setup";

const IDS = ["about", "projects", "contact"] as const;

function entryFor(id: string, top: number, isIntersecting: boolean) {
  return {
    isIntersecting,
    target: { id } as Element,
    boundingClientRect: { top } as DOMRectReadOnly,
  } as IntersectionObserverEntry;
}

describe("useActiveSection", () => {
  it("returns null before anything intersects", () => {
    const { result } = renderHook(() => useActiveSection(IDS));
    expect(result.current).toBeNull();
  });

  it("returns the intersecting section nearest the top", () => {
    const { result } = renderHook(() => useActiveSection(IDS));

    act(() => {
      for (const callback of observerCallbacks) {
        callback([
          entryFor("contact", 800, true),
          entryFor("projects", 120, true),
        ]);
      }
    });

    expect(result.current).toBe("projects");
  });

  it("ignores entries that are not intersecting", () => {
    const { result } = renderHook(() => useActiveSection(IDS));

    act(() => {
      for (const callback of observerCallbacks) {
        callback([entryFor("about", 10, false), entryFor("contact", 500, true)]);
      }
    });

    expect(result.current).toBe("contact");
  });
});
