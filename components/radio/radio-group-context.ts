import { createContext } from "react";
import type { ShapeType, SizeType, ThemeType } from "../const/types";
import type { ChangeEvent } from "./types";

export interface RadioGroupContextValue {
  name: string;
  value?: string | number;
  disabled?: boolean;
  readOnly?: boolean;
  // Wide on purpose: this channel carries whatever a `ConfigProvider` or a `Form` said, and a provider
  // can still name a tier the item does not paint. The item resolves it; the group does not vouch for it.
  theme?: ThemeType;
  size?: SizeType;
  shape?: ShapeType;
  onChange?: (event: ChangeEvent) => void;
}

export const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);
