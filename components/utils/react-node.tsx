import React from "react";

export function setRef<T>(ref: React.Ref<T> | undefined, node: T | null) {
  if (typeof ref === "function") {
    ref(node);
  } else if (ref) {
    ref.current = node;
  }
}

export function cloneNodes(vnode: React.ReactNode, props: React.HTMLAttributes<HTMLElement>) {
  if (React.Children.count(vnode) === 1) {
    return React.cloneElement(vnode as React.ReactElement, props);
  }
  return <span {...props}>{vnode}</span>;
}

export function getChildren(children?: React.ReactNode): React.ReactNode[] {
  const result: React.ReactNode[] = [];
  React.Children.forEach(children, (child) => {
    if (child == null || child === false || child === true) return;
    if (typeof child === "string" && child.trim() === "") return;
    if (
      React.isValidElement<{ children?: React.ReactNode }>(child) &&
      child.type === React.Fragment
    ) {
      result.push(...getChildren(child.props.children));
      return;
    }
    result.push(child);
  });
  return result;
}

let scrollbarWidth: number | null = null;

const getScrollbarWidth = () => {
  if (scrollbarWidth !== null) {
    return scrollbarWidth;
  }

  const outer = document.createElement("div");
  outer.style.visibility = "hidden";
  outer.style.overflow = "scroll";
  document.body.appendChild(outer);

  const inner = document.createElement("div");
  outer.appendChild(inner);

  scrollbarWidth = outer.offsetWidth - outer.clientWidth;

  outer.parentNode?.removeChild(outer);

  return scrollbarWidth;
};

const injectedStyles = new Map<string, HTMLStyleElement>();
export const toggleContainerScroll = (target: HTMLElement | null, lock: boolean) => {
  if (!target || target != document.body) return;
  if (lock) {
    if (injectedStyles.has("body")) return;
    const scrollbarWidth = getScrollbarWidth();
    const styleElement = document.createElement("style");
    styleElement.type = "text/css";
    const styleContent = `html body { overflow: hidden !important; width: calc(100vw - ${scrollbarWidth}px); }`;
    styleElement.appendChild(document.createTextNode(styleContent));
    document.head.appendChild(styleElement);

    injectedStyles.set("body", styleElement);
  } else {
    // 移除对应的样式
    const styleElement = injectedStyles.get("body");
    if (styleElement && styleElement.parentNode) {
      styleElement.parentNode.removeChild(styleElement);
      injectedStyles.delete("body");
    }
  }
};
