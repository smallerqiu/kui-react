import type { ReactElement, RefObject } from "react";
import { CSSTransition } from "react-transition-group";

export interface PopupTransitionProps<T extends HTMLElement> {
  children: ReactElement;
  name: string;
  nodeRef: RefObject<T | null>;
  timeout?: number;
  visible: boolean;
}

export default function PopupTransition<T extends HTMLElement>({
  children,
  name,
  nodeRef,
  timeout = 300,
  visible,
}: PopupTransitionProps<T>) {
  return (
    <CSSTransition
      appear
      in={visible}
      mountOnEnter
      nodeRef={nodeRef}
      timeout={timeout}
      unmountOnExit
      classNames={{
        appear: `${name}-enter-from`,
        appearActive: `${name}-enter-active`,
        enter: `${name}-enter-from`,
        enterActive: `${name}-enter-active`,
        exitActive: `${name}-leave-active ${name}-leave-to`,
      }}
    >
      {children}
    </CSSTransition>
  );
}
