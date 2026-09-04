import type { HTMLAttributes } from "react";
import type { DropPlacementsType, ShapeType, SizeType, ThemeType } from "../const/types";
import type { IconType } from "../icon";

export type CascaderValue = Array<string | number>;
export type CascaderLoadData = (
  option: CascaderOption,
  path: CascaderOption[],
) => Promise<CascaderOption[] | void>;

export interface CascaderOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  children?: CascaderOption[];
  isLeaf?: boolean;
}

export interface CascaderProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange" | "defaultValue"
> {
  value?: CascaderValue;
  defaultValue?: CascaderValue;
  open?: boolean;
  defaultOpen?: boolean;
  options?: CascaderOption[];
  theme?: ThemeType;
  bordered?: boolean;
  shape?: ShapeType;
  showArrow?: boolean;
  placeholder?: string;
  icon?: IconType[];
  arrowIcon?: IconType[];
  emptyText?: string;
  loadData?: CascaderLoadData;
  disabled?: boolean;
  readOnly?: boolean;
  clearable?: boolean;
  size?: SizeType;
  expandTrigger?: "click" | "hover";
  showAllLevels?: boolean;
  separator?: string;
  placement?: DropPlacementsType;
  onChange?: (value: CascaderValue) => void;
  onExpandChange?: (value: CascaderValue) => void;
  onOpenChange?: (open: boolean) => void;
}
