// Transition utility for React components
// Provides CSS-based transition helpers similar to Vue's Transition component

export interface TransitionCallbacks {
  onBeforeEnter?: (el: HTMLElement) => void;
  onEnter?: (el: HTMLElement) => void;
  onAfterEnter?: (el: HTMLElement) => void;
  onBeforeLeave?: (el: HTMLElement) => void;
  onLeave?: (el: HTMLElement) => void;
  onAfterLeave?: (el: HTMLElement) => void;
}

export function getTransitionProp(name: string): TransitionCallbacks {
  return {
    onBeforeEnter(el: HTMLElement) {
      el.style.overflow = "hidden";
      el.style.height = "0";
      el.style.opacity = "0.1";
    },
    onEnter(el: HTMLElement) {
      if (el.scrollHeight !== 0) {
        el.style.height = el.scrollHeight + "px";
        el.style.opacity = "1";
      } else {
        el.style.height = "";
        el.style.opacity = "";
      }
    },
    onAfterEnter(el: HTMLElement) {
      el.style.height = "";
      el.style.overflow = "";
      el.style.opacity = "";
    },
    onBeforeLeave(el: HTMLElement) {
      el.style.height = el.scrollHeight + "px";
      el.style.opacity = "1";
    },
    onLeave(el: HTMLElement) {
      if (el.scrollHeight !== 0) {
        el.style.height = "0";
        el.style.paddingTop = "0";
        el.style.paddingBottom = "0";
        el.style.marginTop = "0";
        el.style.marginBottom = "0";
        el.style.opacity = "0";
      }
    },
    onAfterLeave(el: HTMLElement) {
      el.style.height = "";
      el.style.paddingTop = "";
      el.style.paddingBottom = "";
      el.style.marginTop = "";
      el.style.marginBottom = "";
      el.style.opacity = "";
      el.style.overflow = "";
    },
  };
}

export function getTransitionHorProp(name: string): TransitionCallbacks {
  return {
    onBeforeEnter(el: HTMLElement) {
      el.style.overflow = "hidden";
      el.style.width = "0";
      el.style.opacity = "0.1";
    },
    onEnter(el: HTMLElement) {
      if (el.scrollWidth !== 0) {
        el.style.width = el.scrollWidth + "px";
        el.style.opacity = "1";
      } else {
        el.style.width = "";
        el.style.opacity = "";
      }
    },
    onAfterEnter(el: HTMLElement) {
      el.style.width = "";
      el.style.overflow = "";
      el.style.opacity = "";
    },
    onBeforeLeave(el: HTMLElement) {
      el.style.width = el.scrollWidth + "px";
      el.style.opacity = "1";
    },
    onLeave(el: HTMLElement) {
      if (el.scrollWidth !== 0) {
        el.style.width = "0";
        el.style.paddingLeft = "0";
        el.style.paddingRight = "0";
        el.style.marginLeft = "0";
        el.style.marginRight = "0";
        el.style.opacity = "0";
        el.style.overflow = "hidden";
      }
    },
    onAfterLeave(el: HTMLElement) {
      el.style.width = "";
      el.style.paddingLeft = "";
      el.style.paddingRight = "";
      el.style.marginLeft = "";
      el.style.marginRight = "";
      el.style.opacity = "";
      el.style.overflow = "";
    },
  };
}
