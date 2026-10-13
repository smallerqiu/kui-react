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

/**
 * Whether an optional content prop deserves its wrapper element.
 *
 * `null` and `undefined` are the documented way to omit a slot, but callers also
 * pass `false` (a conditional like `isAdmin && <Icon />`) or an empty string, and
 * the framework renders `false` as nothing while still mounting the wrapper —
 * which keeps its padding, border and flex gap in the layout with nothing inside
 * it. Numbers count as content, including `0`.
 */
export function hasRenderableContent(value: unknown): boolean {
  if (value == null || value === false || value === true) return false;
  if (typeof value === "string") return value.trim() !== "";
  if (Array.isArray(value)) return value.some(hasRenderableContent);
  return true;
}

// 两个仓库这段实现逐字符相同（vue 在 utils/vnode.tsx，react 在 utils/react-node.tsx）：
// 弹层可以叠着开，锁必须引用计数，否则先关的那一层会把还开着的层的滚动锁一起解掉。
interface ScrollLockState {
  count: number;
  overflow: string;
  overflowY: string;
  width: string;
  paddingRight: string;
  scrollbarWidth: string;
  hadLockClass: boolean;
}

const scrollLocks = new Map<HTMLElement, ScrollLockState>();

export const toggleContainerScroll = (target: HTMLElement | null, lock: boolean) => {
  if (!target || typeof window === "undefined") return;

  if (lock) {
    const current = scrollLocks.get(target);
    if (current) {
      current.count += 1;
      return;
    }

    const state: ScrollLockState = {
      count: 1,
      overflow: target.style.overflow,
      overflowY: target.style.overflowY,
      width: target.style.width,
      paddingRight: target.style.paddingRight,
      scrollbarWidth: target.style.getPropertyValue("--kui-scrollbar-width"),
      hadLockClass: target.classList.contains("k-scroll-locked"),
    };
    const computedPadding = Number.parseFloat(window.getComputedStyle(target).paddingRight) || 0;
    const scrollbarWidth =
      target === document.body
        ? Math.max(0, window.innerWidth - document.documentElement.clientWidth)
        : Math.max(0, target.offsetWidth - target.clientWidth);

    target.classList.add("k-scroll-locked");
    target.style.setProperty("--kui-scrollbar-width", `${scrollbarWidth}px`);
    if (target === document.body) {
      target.style.overflowY = "hidden";
      // target.style.width = `calc(100% - ${scrollbarWidth}px)`;
    } else {
      target.style.overflow = "hidden";
      if (scrollbarWidth > 0) {
        target.style.paddingRight = `${computedPadding + scrollbarWidth}px`;
      }
    }
    scrollLocks.set(target, state);
    return;
  }

  const state = scrollLocks.get(target);
  if (!state) return;
  state.count -= 1;
  if (state.count > 0) return;

  target.style.overflow = state.overflow;
  target.style.overflowY = state.overflowY;
  target.style.width = state.width;
  target.style.paddingRight = state.paddingRight;
  if (state.scrollbarWidth) {
    target.style.setProperty("--kui-scrollbar-width", state.scrollbarWidth);
  } else {
    target.style.removeProperty("--kui-scrollbar-width");
  }
  if (!state.hadLockClass) target.classList.remove("k-scroll-locked");
  scrollLocks.delete(target);
};
