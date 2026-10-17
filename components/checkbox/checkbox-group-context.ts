import { createContext } from "react";
import type { SizeType, ThemeType } from "../const/types";
import type { ChangeEvent } from "./checkbox";

export interface CheckboxGroupContextValue {
  value?: unknown[];
  disabled?: boolean;
  readOnly?: boolean;
  // Wide on purpose: this channel carries whatever a `ConfigProvider` or a `Form` said, and a provider
  // can still name a tier the item does not paint. The item resolves it; the group does not vouch for it.
  theme?: ThemeType;
  size?: SizeType;
  onChange?: (event: ChangeEvent) => void;
}

export const CheckboxGroupContext = createContext<CheckboxGroupContextValue | null>(null);
