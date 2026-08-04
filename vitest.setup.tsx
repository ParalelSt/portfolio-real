import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => {
  cleanup();
});

vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    fill: _fill,
    priority: _priority,
    sizes: _sizes,
    ...rest
  }: {
    src: string;
    alt: string;
    fill?: boolean;
    priority?: boolean;
    sizes?: string;
    className?: string;
  }) => <img src={src} alt={alt} {...rest} />,
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

type ObserverCallback = (entries: IntersectionObserverEntry[]) => void;

export const observerCallbacks = new Set<ObserverCallback>();

class IntersectionObserverStub {
  constructor(private readonly callback: ObserverCallback) {
    observerCallbacks.add(callback);
  }
  observe() {}
  unobserve() {}
  disconnect() {
    observerCallbacks.delete(this.callback);
  }
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

vi.stubGlobal("IntersectionObserver", IntersectionObserverStub);

vi.stubGlobal(
  "matchMedia",
  (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
);
