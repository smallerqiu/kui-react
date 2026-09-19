import type { TransitionProps } from "./transition";

type HeightTransitionProps = Pick<
  TransitionProps,
  | "name"
  | "onBeforeEnter"
  | "onEnter"
  | "onAfterEnter"
  | "onBeforeLeave"
  | "onLeave"
  | "onAfterLeave"
>;

export function getTransitionProps(name: string): HeightTransitionProps {
  return {
    name,
    onBeforeEnter(element) {
      element.style.overflow = "hidden";
      element.style.height = "0";
      element.style.opacity = "0.1";
    },
    onEnter(element) {
      if (element.scrollHeight) {
        element.style.height = `${element.scrollHeight}px`;
        element.style.opacity = "1";
      }
    },
    onAfterEnter(element) {
      element.style.height = "";
      element.style.overflow = "";
      element.style.opacity = "";
    },
    onBeforeLeave(element) {
      element.style.height = `${element.scrollHeight}px`;
      element.style.overflow = "hidden";
      element.style.opacity = "1";
    },
    onLeave(element) {
      if (element.scrollHeight) {
        element.style.height = "0";
        element.style.paddingTop = "0";
        element.style.paddingBottom = "0";
        element.style.marginTop = "0";
        element.style.marginBottom = "0";
        element.style.opacity = "0";
      }
    },
    onAfterLeave(element) {
      element.style.height = "";
      element.style.paddingTop = "";
      element.style.paddingBottom = "";
      element.style.marginTop = "";
      element.style.marginBottom = "";
      element.style.opacity = "";
      element.style.overflow = "";
    },
  };
}
