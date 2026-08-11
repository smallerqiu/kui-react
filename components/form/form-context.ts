import { createContext } from "react";
import type { DirectionType, ShapeType, SizeType, ThemeType } from "../const/types";
import type { FormItemHandle } from "./form";
import type { ColProps, FormRule } from "./types";

export interface FormContextValue {
  model: Record<string, any>;
  rules?: Record<string, FormRule[]>;
  layout: DirectionType;
  name?: string;
  size?: SizeType;
  shape?: ShapeType;
  theme?: ThemeType;
  disabled?: boolean;
  labelCol?: ColProps;
  wrapperCol?: ColProps;
  getValue: (path: string) => any;
  setValue: (path: string, value: any) => void;
  register: (item: FormItemHandle) => void;
  unregister: (prop: string) => void;
}

export const FormContext = createContext<FormContextValue | null>(null);
