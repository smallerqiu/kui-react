import type { ShapeType, SizeType, ThemeType } from "../const/types";
import type { IconType } from "../icon";

export type CheckCardValue = string | number;

export interface CheckCardChangeEvent {
  checked: boolean;
  value?: CheckCardValue;
}

export interface CheckCardOption {
  value: CheckCardValue;
  title?: React.ReactNode;
  description?: React.ReactNode;
  symbol?: IconType[];
  checkedSymbol?: IconType[];
  disabled?: boolean;
  readOnly?: boolean;
}

export interface CheckCardProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange" | "title" | "defaultValue" | "defaultChecked"
> {
  checked?: boolean;
  value?: CheckCardValue;
  title?: React.ReactNode;
  description?: React.ReactNode;
  symbol?: IconType[];
  checkedSymbol?: IconType[];
  showIndicator?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  // The shared six-tier type, not a private pair: a check card paints a whole box, so it is a surface
  // component like Card and Collapse, and those name their supported set at the emit point rather than
  // narrowing the type to what one stylesheet happened to draw.
  theme?: ThemeType;
  size?: SizeType;
  shape?: ShapeType;
  onChange?: (event: CheckCardChangeEvent) => void;
  children?: React.ReactNode;
}

export interface CheckCardGroupProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange" | "defaultValue" | "defaultChecked"
> {
  value?: CheckCardValue;

  options?: CheckCardOption[];
  disabled?: boolean;
  readOnly?: boolean;
  direction?: "horizontal" | "vertical";
  // Forwarded verbatim to the cards inside: the group paints no surface of its own, so it is the
  // child's emit guard that decides which of these tiers a card actually draws.
  theme?: ThemeType;
  size?: SizeType;
  shape?: ShapeType;
  onChange?: (value: CheckCardValue) => void;
  children?: React.ReactNode;
}
