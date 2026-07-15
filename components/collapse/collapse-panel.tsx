import React, { useState, useEffect, useRef } from "react";
import { ChevronUp } from "kui-icons";
import Icon from "../icon";

export interface CollapsePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  active?: boolean;
  extra?: React.ReactNode;
  panelKey?: string | number;
  onExpand?: (key: string | number) => void;
  children?: React.ReactNode;
}

const CollapsePanel: React.FC<CollapsePanelProps> = ({
  title,
  active = false,
  extra,
  panelKey,
  onExpand,
  children,
  className = "",
  ...rest
}) => {
  const [expanded, setExpanded] = useState(active);
  const [rendered, setRendered] = useState(active);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setRendered(true);
    // Use a small delay to trigger the CSS transition after mount
    const timer = setTimeout(() => {
      setExpanded(active);
    }, 0);
    return () => clearTimeout(timer);
  }, [active]);

  const handleClick = () => {
    if (panelKey !== undefined) {
      onExpand?.(panelKey);
    }
  };

  const classes = [
    "k-collapse-item",
    expanded ? "k-collapse-item-active" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...rest}>
      <div className="k-collapse-header" onClick={handleClick}>
        <Icon type={ChevronUp} className="k-collapse-arrow" />
        <span className="k-collapse-title">{title}</span>
        {extra ? <span className="k-collapse-extra">{extra}</span> : null}
      </div>
      {rendered ? (
        <div
          className="k-collapse-content"
          style={{ display: expanded ? undefined : "none" }}
        >
          <div className="k-collapse-content-box">{children}</div>
        </div>
      ) : null}
    </div>
  );
};

export default CollapsePanel;
