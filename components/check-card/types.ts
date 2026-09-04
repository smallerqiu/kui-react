import type { ShapeType, SizeType, ThemeType } from "../const/types";
import type { IconType } from "../icon";

export type CheckCardValue = string | number;
export type CheckCardTheme = ThemeType;

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
  "onChange" | "title"
> {
  checked?: boolean;
  defaultChecked?: boolean;
  value?: CheckCardValue;
  title?: React.ReactNode;
  description?: React.ReactNode;
  symbol?: IconType[];
  checkedSymbol?: IconType[];
  showIndicator?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  theme?: CheckCardTheme;
  size?: SizeType;
  shape?: ShapeType;
  onChange?: (event: CheckCardChangeEvent) => void;
  children?: React.ReactNode;
}

export interface CheckCardGroupProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  value?: CheckCardValue;
  defaultValue?: CheckCardValue;
  options?: CheckCardOption[];
  disabled?: boolean;
  readOnly?: boolean;
  direction?: "horizontal" | "vertical";
  theme?: CheckCardTheme;
  size?: SizeType;
  shape?: ShapeType;
  onChange?: (value: CheckCardValue) => void;
  children?: React.ReactNode;
}
