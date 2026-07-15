// Resize listener utility for React components
// Usage: Call addResizeListener/removeResizeListener in componentDidMount/Unmount

export type ResizeHandler = () => void;

export function addResizeListener(handler: ResizeHandler) {
  window.addEventListener("resize", handler);
}

export function removeResizeListener(handler: ResizeHandler) {
  window.removeEventListener("resize", handler);
}
