import { createContext } from "react";
import type { ShapeType, SizeType, ThemeType } from "../const/types";
import type { CheckCardValue } from "./types";

export interface CheckCardGroupContextValue {
  value?: CheckCardValue;
  disabled: boolean;
  readOnly: boolean;
  // Typed as the shared tier, not a loose string: a card resolves this through the same guard it
  // applies to its own `theme`, and "whatever the group happened to put in context" would not typecheck.
  // Wide on purpose: this channel carries whatever a `ConfigProvider` or a `Form` said, and a provider
  // can still name a tier the item does not paint. The item resolves it; the group does not vouch for it.
  theme?: ThemeType;
  size?: SizeType;
  shape?: ShapeType;
  select: (value: CheckCardValue) => void;
  register: (value: CheckCardValue, element: HTMLDivElement, disabled: boolean) => void;
  unregister: (value: CheckCardValue) => void;
  selectRelative: (value: CheckCardValue, offset: number) => void;
}

export const CheckCardGroupContext = createContext<CheckCardGroupContextValue | null>(null);
