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
          <span className="k-collapse-extra" onClick={(event) => event.stopPropagation()}>
            {extra}
          </span>
        ) : null}
      </div>
      <Transition show={active} name="k-collapse-slide" timeout={350}>
        <div className="k-collapse-content">
          <div className="k-collapse-content-box">{children}</div>
        </div>
      </Transition>
    </div>
  );
};

export default CollapsePanel;
