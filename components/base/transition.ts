import type { RefObject } from "react";

export interface TransitionProps {
  classNames: {
    enterActive: string;
    exitActive: string;
  };
  onEnter: () => void;
  onEntering: () => void;
  onEntered: () => void;
  onExit: () => void;
  onExiting: () => void;
  onExited: () => void;
}

function clearVerticalStyle(el: HTMLElement) {
  el.style.height = "";
  el.style.paddingTop = "";
  el.style.paddingBottom = "";
  el.style.marginTop = "";
  el.style.marginBottom = "";
  el.style.opacity = "";
  el.style.overflow = "";
}

export function getTransitionProp(
  name: string,
  nodeRef: RefObject<HTMLElement | null>
): TransitionProps {
  let height = 0;
  return {
    classNames: {
      enterActive: `${name}-enter-active`,
      exitActive: `${name}-leave-active`,
    },
    onEnter() {
      const el = nodeRef.current;
      if (!el) return;
      height = el.scrollHeight;
      el.style.overflow = "hidden";
      el.style.height = "0";
      el.style.opacity = "0.1";
    },
    onEntering() {
      const el = nodeRef.current;
      if (!el) return;
      if (height !== 0) {
        el.style.height = `${height}px`;
        el.style.opacity = "1";
      } else {
        clearVerticalStyle(el);
      }
    },
    onEntered() {
      const el = nodeRef.current;
      if (el) clearVerticalStyle(el);
    },
    onExit() {
      const el = nodeRef.current;
      if (!el) return;
      el.style.height = `${el.scrollHeight}px`;
      el.style.overflow = "hidden";
      el.style.opacity = "1";
      void el.offsetHeight;
    },
    onExiting() {
      const el = nodeRef.current;
      if (!el || el.scrollHeight === 0) return;
      el.style.height = "0";
      el.style.paddingTop = "0";
      el.style.paddingBottom = "0";
      el.style.marginTop = "0";
      el.style.marginBottom = "0";
      el.style.opacity = "0";
    },
    onExited() {
      const el = nodeRef.current;
      if (el) clearVerticalStyle(el);
    },
  };
}

function clearHorizontalStyle(el: HTMLElement) {
  el.style.width = "";
  el.style.paddingLeft = "";
  el.style.paddingRight = "";
  el.style.marginLeft = "";
  el.style.marginRight = "";
  el.style.opacity = "";
  el.style.overflow = "";
}

export function getTransitionHorProp(
  name: string,
  nodeRef: RefObject<HTMLElement | null>
): TransitionProps {
  let width = 0;
  return {
    classNames: {
      enterActive: `${name}-enter-active`,
      exitActive: `${name}-leave-active`,
    },
    onEnter() {
      const el = nodeRef.current;
      if (!el) return;
      width = el.scrollWidth;
      el.style.overflow = "hidden";
      el.style.width = "0";
      el.style.opacity = "0.1";
    },
    onEntering() {
      const el = nodeRef.current;
      if (!el) return;
      if (width !== 0) {
        el.style.width = `${width}px`;
        el.style.opacity = "1";
      } else {
        clearHorizontalStyle(el);
      }
    },
    onEntered() {
      const el = nodeRef.current;
      if (el) clearHorizontalStyle(el);
    },
    onExit() {
      const el = nodeRef.current;
      if (!el) return;
      el.style.width = `${el.scrollWidth}px`;
      el.style.overflow = "hidden";
      el.style.opacity = "1";
      void el.offsetWidth;
    },
    onExiting() {
      const el = nodeRef.current;
      if (!el || el.scrollWidth === 0) return;
      el.style.width = "0";
      el.style.paddingLeft = "0";
      el.style.paddingRight = "0";
      el.style.marginLeft = "0";
      el.style.marginRight = "0";
      el.style.opacity = "0";
    },
    onExited() {
      const el = nodeRef.current;
      if (el) clearHorizontalStyle(el);
    },
  };
}
