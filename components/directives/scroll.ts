// Scroll listener utility for React components
// Usage: Call addScrollListener/removeScrollListener in componentDidMount/Unmount

export type ScrollHandler = () => void;

export function addScrollListener(handler: ScrollHandler) {
  window.addEventListener("scroll", handler);
}

export function removeScrollListener(handler: ScrollHandler) {
  window.removeEventListener("scroll", handler);
}
