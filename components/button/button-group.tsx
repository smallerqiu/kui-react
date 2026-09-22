import { useConfigAppearance } from "../config/use-config-appearance";
import clsx from "clsx";
import React, { useContext } from "react";
import { SizeContext } from "../config/size-context";
import type { ShapeType, SizeType } from "../const/types";
import { ButtonGroupContext } from "./button-group-context";

export interface ButtonGroupProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "defaultValue" | "defaultChecked"
> {
  size?: SizeType;
  shape?: ShapeType;
  children?: React.ReactNode;
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({
  size: sizeProp,
  shape: shapeProp,
  children,
  className = "",
  ...rest
}) => {
  const inheritedAppearance = useConfigAppearance();
  const size = sizeProp ?? inheritedAppearance.size;
  const shape = shapeProp ?? inheritedAppearance.shape;
  const parentSize = useContext(SizeContext);
  const currentSize = sizeProp ?? parentSize ?? size;

  const classes = clsx(
    "k-btn-group",
    {
      "k-btn-group-sm": currentSize === "small",
      "k-btn-group-lg": currentSize === "large",
      "k-btn-group-circle": shape === "circle",
      "k-btn-group-square": shape === "square",
    },
    className,
  );

  return (
    <ButtonGroupContext.Provider value={{ size: currentSize, shape }}>
      <div className={classes} {...rest}>
        {children}
      </div>
    </ButtonGroupContext.Provider>
  );
};

export default ButtonGroup;
