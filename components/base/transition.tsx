import React, {
  Fragment,
  forwardRef,
  isValidElement,
  useCallback,
  useLayoutEffect,
  useRef,
  type ReactElement,
  type Ref,
} from "react";
import { CSSTransition } from "react-transition-group";

type TransitionElement = ReactElement<{ ref?: Ref<HTMLElement> }>;

function setRef(ref: Ref<HTMLElement> | undefined, node: HTMLElement | null) {
  if (typeof ref === "function") ref(node);
  else if (ref) (ref as React.MutableRefObject<HTMLElement | null>).current = node;
}

function canHoldRef(element: ReactElement): element is TransitionElement {
  return element.type !== Fragment;
}

export interface TransitionProps {
  show?: boolean;
  name?: string;
  appear?: boolean;
  timeout?: number | { appear?: number; enter?: number; exit?: number };
  nodeRef?: React.RefObject<HTMLElement | null>;
  enterFromClass?: string;
  enterActiveClass?: string;
  enterToClass?: string;
  leaveFromClass?: string;
  leaveActiveClass?: string;
  leaveToClass?: string;
  onBeforeEnter?: (el: HTMLElement) => void;
  onEnter?: (el: HTMLElement) => void;
  onAfterEnter?: (el: HTMLElement) => void;
  onBeforeLeave?: (el: HTMLElement) => void;
  onLeave?: (el: HTMLElement) => void;
  onAfterLeave?: (el: HTMLElement) => void;
  children: ReactElement;
}

export const Transition = forwardRef<HTMLElement, TransitionProps>(function Transition(
  {
    show = false,
    name = "v",
    appear = false,
    timeout = 300,
    nodeRef: externalNodeRef,
    enterFromClass = `${name}-enter-from`,
    enterActiveClass = `${name}-enter-active`,
    enterToClass = `${name}-enter-to`,
    leaveFromClass = `${name}-leave-from`,
    leaveActiveClass = `${name}-leave-active`,
    leaveToClass = `${name}-leave-to`,
    onBeforeEnter,
    onEnter,
    onAfterEnter,
    onBeforeLeave,
    onLeave,
    onAfterLeave,
    children,
  },
  forwardedRef
) {
  const internalNodeRef = useRef<HTMLElement>(null);
  const lastElementRef = useRef<TransitionElement | null>(null);

  const currentElement = isValidElement(children) && canHoldRef(children) ? children : null;
  const element = currentElement ?? lastElementRef.current;
  const childRef = element?.props.ref;

  useLayoutEffect(() => {
    if (show && currentElement) lastElementRef.current = currentElement;
  }, [currentElement, show]);

  const mergedRef = useCallback(
    (node: HTMLElement | null) => {
      internalNodeRef.current = node;
      setRef(childRef, node);
      setRef(externalNodeRef, node);
      setRef(forwardedRef, node);
    },
    [childRef, externalNodeRef, forwardedRef]
  );

  const getNode = () => internalNodeRef.current;
  const remove = (el: HTMLElement, ...classes: string[]) => {
    classes.filter(Boolean).forEach((className) => el.classList.remove(className));
  };

  const transitionChild = element ? React.cloneElement(element, { ref: mergedRef }) : <span />;

  return (
    <CSSTransition
      in={show}
      nodeRef={internalNodeRef}
      timeout={timeout}
      appear={appear}
      mountOnEnter
      unmountOnExit
      classNames={{
        appear: enterFromClass,
        appearActive: enterActiveClass,
        enter: enterFromClass,
        enterActive: enterActiveClass,
        exit: leaveFromClass,
        exitActive: leaveActiveClass,
      }}
      onEnter={() => {
        const el = getNode();
        if (!el) return;
        el.style.display = "";
        el.style.animationFillMode = "";
        remove(el, leaveFromClass, leaveActiveClass, leaveToClass);
        onBeforeEnter?.(el);
      }}
      onEntering={() => {
        const el = getNode();
        if (!el) return;
        remove(el, enterFromClass);
        el.classList.add(enterToClass);
        onEnter?.(el);
      }}
      onEntered={() => {
        const el = getNode();
        if (!el) return;
        remove(el, enterFromClass, enterActiveClass, enterToClass);
        onAfterEnter?.(el);
      }}
      onExit={() => {
        const el = getNode();
        if (!el) return;
        el.style.animationFillMode = "both";
        remove(el, enterFromClass, enterActiveClass, enterToClass);
        onBeforeLeave?.(el);
      }}
      onExiting={() => {
        const el = getNode();
        if (!el) return;
        remove(el, leaveFromClass);
        el.classList.add(leaveToClass);
        onLeave?.(el);
      }}
      onExited={() => {
        const el = getNode();
        if (el) {
          el.style.display = "none";
          remove(el, leaveFromClass, leaveActiveClass, leaveToClass);
          el.style.animationFillMode = "";
          onAfterLeave?.(el);
        }
        lastElementRef.current = null;
      }}
    >
      {transitionChild}
    </CSSTransition>
  );
});

export const getTransitionProp = (name: string): Omit<TransitionProps, "children" | "show"> => {
  return {
    name,
    onBeforeEnter(el) {
      el.style.overflow = "hidden";
      el.style.height = "0";
      el.style.opacity = "0.1";
    },
    onEnter(el) {
      if (el.scrollHeight !== 0) {
        el.style.height = `${el.scrollHeight}px`;
        el.style.opacity = "1";
      } else {
        el.style.height = "";
        el.style.opacity = "";
      }
    },
    onAfterEnter(el) {
      el.style.height = "";
      el.style.overflow = "";
      el.style.opacity = "";
    },
    onBeforeLeave(el) {
      el.style.height = `${el.scrollHeight}px`;
      el.style.opacity = "1";
    },
    onLeave(el) {
      if (el.scrollHeight !== 0) {
        el.style.height = "0";
        el.style.paddingTop = "0";
        el.style.paddingBottom = "0";
        el.style.marginTop = "0";
        el.style.marginBottom = "0";
        el.style.opacity = "0";
      }
    },
    onAfterLeave(el) {
      el.style.height = "";
      el.style.paddingTop = "";
      el.style.paddingBottom = "";
      el.style.marginTop = "";
      el.style.marginBottom = "";
      el.style.opacity = "";
      el.style.overflow = "";
    },
  };
};

export const getTransitionHorProp = (name: string): Omit<TransitionProps, "children" | "show"> => {
  return {
    name,
    onBeforeEnter(el) {
      el.style.overflow = "hidden";
      el.style.width = "0";
      el.style.opacity = "0.1";
    },
    onEnter(el) {
      if (el.scrollWidth !== 0) {
        el.style.width = `${el.scrollWidth}px`;
        el.style.opacity = "1";
      } else {
        el.style.width = "";
        el.style.opacity = "";
      }
    },
    onAfterEnter(el) {
      el.style.width = "";
      el.style.overflow = "";
      el.style.opacity = "";
    },
    onBeforeLeave(el) {
      el.style.width = `${el.scrollWidth}px`;
      el.style.opacity = "1";
    },
    onLeave(el) {
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
    onAfterLeave(el) {
      el.style.width = "";
      el.style.paddingLeft = "";
      el.style.paddingRight = "";
      el.style.marginLeft = "";
      el.style.marginRight = "";
      el.style.opacity = "";
      el.style.overflow = "";
    },
  };
};

export default Transition;
