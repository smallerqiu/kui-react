import clsx from "clsx";
import React from "react";
import type { DirectionType } from "../const/types";

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: DirectionType;
  text?: string;
  dashed?: boolean;
  orientation?: "left" | "right" | "center";
  children?: React.ReactNode;
}

class Divider extends React.Component<DividerProps> {
  static defaultProps: Partial<DividerProps> = {
    type: "horizontal",
    orientation: "center",
  };

  render() {
    const { type, text, dashed, orientation, children, className, ...rest } = this.props;
    const hasText = !!(children || text);
    const textNode = children || text;

    const classes = clsx(
      "k-divider",
      `k-divider-${type}`,
      { "k-divider-dashed": dashed },
      type === "horizontal" && hasText ? `k-divider-with-text-${orientation}` : "",
      className || ""
    );

    return (
      <div className={classes} role="separator" {...rest}>
        {type === "horizontal" && hasText ? (
          <span className="k-divider-inner-text">{textNode}</span>
        ) : null}
      </div>
    );
  }
}

export default Divider;
