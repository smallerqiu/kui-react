// Transfer (portal) utility for React components
// In React, use ReactDOM.createPortal instead of manually transferring DOM nodes.
// This utility is kept as a reference but prefer ReactDOM.createPortal.

export function transferTo(target: HTMLElement | true | null, el: HTMLElement) {
  const container = target === true || !target ? document.body : target;
  container.appendChild(el);
  return container;
}

export function transferBack(parentNode: HTMLElement, el: HTMLElement) {
  if (parentNode && el.parentNode !== parentNode) {
    parentNode.appendChild(el);
  }
}
