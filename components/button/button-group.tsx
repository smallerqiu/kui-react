import clsx from "clsx";
import React, { useContext } from "react";
import { SizeContext } from "../config/size-context";
import type { ShapeType, SizeType } from "../const/types";

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: SizeType;
  shape?: ShapeType;
  children?: React.ReactNode;
}

export interface ButtonGroupContextValue {
  size?: SizeType;
  shape?: ShapeType;
}

export const ButtonGroupContext = React.createContext<ButtonGroupContextValue | null>(null);

const ButtonGroup: React.FC<ButtonGroupProps> = ({
  size,
  shape,
  children,
  className = "",
  ...rest
}) => {
  const parentSize = useContext(SizeContext);
  const currentSize = size || parentSize;

  const classes = clsx(
    "k-btn-group",
    {
      "k-btn-group-sm": currentSize === "small",
      "k-btn-group-lg": currentSize === "large",
      "k-btn-group-circle": shape === "circle",
      "k-btn-group-square": shape === "square",
    },
    className
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
