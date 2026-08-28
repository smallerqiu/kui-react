import { createContext } from "react";
import type { CheckCardValue } from "./types";

export interface CheckCardGroupContextValue {
  value?: CheckCardValue;
  disabled: boolean;
  theme?: string;
  size?: string;
  shape?: string;
  select: (value: CheckCardValue) => void;
  register: (value: CheckCardValue, element: HTMLDivElement, disabled: boolean) => void;
  unregister: (value: CheckCardValue) => void;
  selectRelative: (value: CheckCardValue, offset: number) => void;
}

export const CheckCardGroupContext = createContext<CheckCardGroupContextValue | null>(null);
