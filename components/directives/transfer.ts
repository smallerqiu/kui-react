// Transfer (portal) utility for React components
// In React, use the base Teleport component instead of manually transferring DOM nodes.

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
