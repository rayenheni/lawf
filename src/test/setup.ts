import "@testing-library/jest-dom/vitest";

/**
 * jsdom ships neither IntersectionObserver nor smooth scrolling; the scroll
 * reveal and count-up hooks only need the API surface to exist.
 */
class IntersectionObserverStub {
  readonly root = null;
  readonly rootMargin = "";
  readonly thresholds = [];
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

globalThis.IntersectionObserver =
  globalThis.IntersectionObserver ?? (IntersectionObserverStub as unknown as typeof IntersectionObserver);

window.scrollTo = window.scrollTo ?? (() => {});
window.HTMLElement.prototype.scrollIntoView = window.HTMLElement.prototype.scrollIntoView ?? (() => {});
