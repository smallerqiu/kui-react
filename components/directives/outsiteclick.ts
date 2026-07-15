// Click outside utility for React components
// Usage: Attach ref to element, then call addClickOutside/removeClickOutside in componentDidMount/Unmount

export type ClickOutsideHandler = (e: MouseEvent) => void;

export function addClickOutside(handler: ClickOutsideHandler) {
  document.addEventListener("click", handler);
}

export function removeClickOutside(handler: ClickOutsideHandler) {
  document.removeEventListener("click", handler);
}
