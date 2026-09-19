import clsx from "clsx";
import { ChevronUp } from "kui-icons";
import React from "react";
import Transition from "../base/transition";
import Icon from "../icon";

export interface CollapsePanelProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  disabled?: boolean;
  active?: boolean;
  extra?: React.ReactNode;
  panelKey?: string | number;
  onExpand?: (key: string | number) => void;
  children?: React.ReactNode;
}

const CollapsePanel: React.FC<CollapsePanelProps> = ({
  title,
  disabled = false,
  active = false,
  extra,
  panelKey,
  onExpand,
  children,
  className = "",
  ...rest
}) => {
  const setCurrentHeight = (element: HTMLElement) => {
    element.style.height = `${element.getBoundingClientRect().height}px`;
    element.style.opacity = "1";
    void element.offsetHeight;
  };

  const resetTransitionStyles = (element: HTMLElement) => {
    element.style.height = "";
    element.style.paddingTop = "";
    element.style.paddingBottom = "";
    element.style.marginTop = "";
    element.style.marginBottom = "";
    element.style.opacity = "";
    element.style.overflow = "";
  };

  const handleClick = () => {
    if (!disabled && panelKey !== undefined) {
      onExpand?.(panelKey);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    handleClick();
  };

  const classes = clsx(
    "k-collapse-item",
    {
      "k-collapse-item-active": active,
      "k-collapse-item-disabled": disabled,
    },
    className,
  );

  return (
    <div className={classes} {...rest}>
      <div
        className="k-collapse-header"
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-expanded={active}
        aria-disabled={disabled || undefined}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        <Icon type={ChevronUp} className="k-collapse-arrow" />
        <span className="k-collapse-title">{title}</span>
        {extra ? (
          <span
            className="k-collapse-extra"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.stopPropagation()}
          >
            {extra}
          </span>
        ) : null}
      </div>
      <Transition
        show={active}
        name="k-collapse-slide"
        timeout={350}
        onBeforeEnter={(element) => {
          const reversing = element.style.height !== "";
          element.style.overflow = "hidden";
          element.style.height = reversing ? `${element.getBoundingClientRect().height}px` : "0px";
          element.style.opacity = reversing ? getComputedStyle(element).opacity : "0.1";
          void element.offsetHeight;
        }}
        onEnter={(element) => {
          if (element.scrollHeight) {
            element.style.height = `${element.scrollHeight}px`;
            element.style.opacity = "1";
          } else {
            element.style.height = "";
            element.style.opacity = "";
          }
        }}
        onAfterEnter={resetTransitionStyles}
        onBeforeLeave={setCurrentHeight}
        onLeave={(element) => {
          element.style.height = "0px";
          element.style.paddingTop = "0px";
          element.style.paddingBottom = "0px";
          element.style.marginTop = "0px";
          element.style.marginBottom = "0px";
          element.style.opacity = "0";
        }}
        onAfterLeave={resetTransitionStyles}
      >
        <div className="k-collapse-content">
          <div className="k-collapse-content-box">{children}</div>
        </div>
      </Transition>
    </div>
  );
};

export default CollapsePanel;
