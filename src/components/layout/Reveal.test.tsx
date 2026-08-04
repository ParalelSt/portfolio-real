import { render, screen, act } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Reveal from "@/components/layout/Reveal";
import { observerCallbacks } from "../../../vitest.setup";

function fireIntersection(isIntersecting: boolean) {
  act(() => {
    for (const callback of observerCallbacks) {
      callback([{ isIntersecting } as IntersectionObserverEntry]);
    }
  });
}

describe("Reveal", () => {
  it("starts hidden and reveals once it intersects", () => {
    render(<Reveal>revealed content</Reveal>);
    const wrapper = screen.getByText("revealed content").parentElement;
    expect(wrapper).toHaveClass("opacity-0");

    fireIntersection(true);
    expect(screen.getByText("revealed content").parentElement).toHaveClass(
      "opacity-100",
    );
  });

  it("renders visible immediately when reduced motion is preferred", () => {
    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }));

    render(<Reveal>reduced content</Reveal>);
    expect(screen.getByText("reduced content").parentElement).toHaveClass(
      "opacity-100",
    );
  });
});
