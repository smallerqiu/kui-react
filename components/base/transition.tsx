import React, { useRef, type ReactElement } from "react";
import { CSSTransition } from "react-transition-group";

export interface TransitionProps {
  /** 控制显隐 */
  show?: boolean;
  /** 动画 class 前缀，默认 'v' */
  name?: string;
  /** 是否在初次挂载时执行动画 */
  appear?: boolean;
  /** 动画超时时间(ms)，Vue 自动测算，RTG 需指定超时兜底 */
  timeout?: number | { enter?: number; exit?: number };
  /** 自定义 Class 映射 */
  enterFromClass?: string;
  enterActiveClass?: string;
  enterToClass?: string;
  leaveFromClass?: string;
  leaveActiveClass?: string;
  leaveToClass?: string;
  /** 生命周期钩子 */
  onBeforeEnter?: (el: HTMLElement) => void;
  onEnter?: (el: HTMLElement) => void;
  onAfterEnter?: (el: HTMLElement) => void;
  onBeforeLeave?: (el: HTMLElement) => void;
  onLeave?: (el: HTMLElement) => void;
  onAfterLeave?: (el: HTMLElement) => void;
  /** 必须是单一元素 */
  children: ReactElement<{ ref?: React.Ref<HTMLElement> }>;
}

export const Transition: React.FC<TransitionProps> = ({
  show,
  name = "v",
  appear = false,
  timeout = 300,
  enterFromClass,
  enterActiveClass,
  enterToClass,
  leaveFromClass,
  leaveActiveClass,
  leaveToClass,
  onBeforeEnter,
  onEnter,
  onAfterEnter,
  onBeforeLeave,
  onLeave,
  onAfterLeave,
  children,
}) => {
  const nodeRef = useRef<HTMLElement>(null);

  const classNames = {
    appear: enterFromClass ?? `${name}-enter-from`,
    appearActive: enterActiveClass ?? `${name}-enter-active`,
    appearDone: enterToClass ?? `${name}-enter-to`,
    enter: enterFromClass ?? `${name}-enter-from`,
    enterActive: enterActiveClass ?? `${name}-enter-active`,
    enterDone: enterToClass ?? `${name}-enter-to`,
    exit: leaveFromClass ?? `${name}-leave-from`,
    exitActive: leaveActiveClass ?? `${name}-leave-active`,
    exitDone: leaveToClass ?? `${name}-leave-to`,
  };

  return (
    <CSSTransition
      in={show}
      nodeRef={nodeRef}
      timeout={timeout}
      classNames={classNames}
      appear={appear}
      mountOnEnter
      unmountOnExit
      onEnter={() => nodeRef.current && onBeforeEnter?.(nodeRef.current)}
      onEntering={() => nodeRef.current && onEnter?.(nodeRef.current)}
      onEntered={() => nodeRef.current && onAfterEnter?.(nodeRef.current)}
      onExit={() => nodeRef.current && onBeforeLeave?.(nodeRef.current)}
      onExiting={() => nodeRef.current && onLeave?.(nodeRef.current)}
      onExited={() => nodeRef.current && onAfterLeave?.(nodeRef.current)}
    >
      {/* 必须给子节点注入 nodeRef 避免 React 严格模式警告 */}
      {React.cloneElement(children, {
        ref: nodeRef,
      })}
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
