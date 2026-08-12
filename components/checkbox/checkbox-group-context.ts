import { createContext } from "react";
import type { SizeType, ThemeType } from "../const/types";
import type { ChangeEvent } from "./checkbox";

export interface CheckboxGroupContextValue {
  value?: unknown[];
  disabled?: boolean;
  theme?: ThemeType;
  size?: SizeType;
  onChange?: (event: ChangeEvent) => void;
}

export const CheckboxGroupContext = createContext<CheckboxGroupContextValue | null>(null);
