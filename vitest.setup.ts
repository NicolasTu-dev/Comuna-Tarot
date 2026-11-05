import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
});

// jsdom has no IntersectionObserver; Framer Motion's whileInView needs a stub to mount.
class MockIntersectionObserver {
  observe = () => {};
  unobserve = () => {};
  disconnect = () => {};
}

if (typeof globalThis.IntersectionObserver === "undefined") {
  // @ts-expect-error - minimal test stub, not a full IntersectionObserver implementation
  globalThis.IntersectionObserver = MockIntersectionObserver;
}
