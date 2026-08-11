import { createContext } from "react";
import type { ShapeType, SizeType } from "../const/types";

export interface ButtonGroupContextValue {
  size?: SizeType;
  shape?: ShapeType;
}

export const ButtonGroupContext = createContext<ButtonGroupContextValue | null>(null);
