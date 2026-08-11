import { createContext } from "react";
import type { ShapeType, SizeType, ThemeType } from "../const/types";
import type { ChangeEvent } from "./types";

export interface RadioGroupContextValue {
  value?: any;
  disabled?: boolean;
  theme?: ThemeType;
  size?: SizeType;
  shape?: ShapeType;
  onChange?: (event: ChangeEvent) => void;
}

export const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);
