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

  const classes = [
    "k-btn-group",
    currentSize === "small" ? "k-btn-group-sm" : "",
    currentSize === "large" ? "k-btn-group-lg" : "",
    shape === "circle" ? "k-btn-group-circle" : "",
    shape === "square" ? "k-btn-group-square" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <ButtonGroupContext.Provider value={{ size: currentSize, shape }}>
      <div className={classes} {...rest}>
        {children}
      </div>
    </ButtonGroupContext.Provider>
  );
};

export default ButtonGroup;
