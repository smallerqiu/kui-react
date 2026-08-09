import React, { useRef } from "react";
import { CSSTransition } from "react-transition-group";

type ElementRef = React.Ref<HTMLElement> | undefined;

function setRef(ref: ElementRef, node: HTMLElement | null) {
  if (typeof ref === "function") ref(node);
  else if (ref) (ref as React.MutableRefObject<HTMLElement | null>).current = node;
}

export interface TransitionProps {
  name?: string;
  show?: boolean;
  appear?: boolean;
  timeout?: number;
  children: React.ReactElement<React.HTMLAttributes<HTMLElement>>;
  onBeforeEnter?: (el: HTMLElement) => void;
  onEnter?: (el: HTMLElement) => void;
  onAfterEnter?: (el: HTMLElement) => void;
  onBeforeLeave?: (el: HTMLElement) => void;
  onLeave?: (el: HTMLElement) => void;
  onAfterLeave?: (el: HTMLElement) => void;
}

const Transition: React.FC<TransitionProps> = ({
  name = "v",
  show = true,
  appear = false,
  timeout = 300,
  children,
  onBeforeEnter,
  onEnter,
  onAfterEnter,
  onBeforeLeave,
  onLeave,
  onAfterLeave,
}) => {
  const nodeRef = useRef<HTMLElement>(null);
  const hidden = useRef(!show);
  const childRef = (children.props as { ref?: ElementRef }).ref;
  const child = React.cloneElement(children, {
    ref: (node: HTMLElement | null) => {
      nodeRef.current = node;
      setRef(childRef, node);
    },
    style: {
      ...children.props.style,
      display: !show && hidden.current ? "none" : children.props.style?.display,
    },
  } as React.HTMLAttributes<HTMLElement> & { ref: React.Ref<HTMLElement> });

  return (
    <CSSTransition
      appear={appear}
      in={show}
      nodeRef={nodeRef}
      timeout={timeout}
      classNames={{
        appear: `${name}-enter-from`,
        appearActive: `${name}-enter-active`,
        enter: `${name}-enter-from`,
        enterActive: `${name}-enter-active`,
        exit: `${name}-leave-from`,
        exitActive: `${name}-leave-active ${name}-leave-to`,
      }}
      onEnter={() => {
        const el = nodeRef.current;
        if (!el) return;
        hidden.current = false;
        el.style.display = children.props.style?.display ?? "";
        onBeforeEnter?.(el);
      }}
      onEntering={() => {
        if (nodeRef.current) onEnter?.(nodeRef.current);
      }}
      onEntered={() => {
        if (nodeRef.current) onAfterEnter?.(nodeRef.current);
      }}
      onExit={() => {
        if (nodeRef.current) onBeforeLeave?.(nodeRef.current);
      }}
      onExiting={() => {
        if (nodeRef.current) onLeave?.(nodeRef.current);
      }}
      onExited={() => {
        const el = nodeRef.current;
        if (!el) return;
        onAfterLeave?.(el);
        hidden.current = true;
        el.style.display = "none";
      }}
    >
      {child}
    </CSSTransition>
  );
};

export function getTransitionProp(name: string): Omit<TransitionProps, "children" | "show"> {
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
}

export function getTransitionHorProp(name: string): Omit<TransitionProps, "children" | "show"> {
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
}

export default Transition;
