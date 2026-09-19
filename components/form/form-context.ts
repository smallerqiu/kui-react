import { createContext } from "react";
import type { DirectionType, ShapeType, SizeType, ThemeType } from "../const/types";
import type { FormItemHandle } from "./form";
import type { ColProps, FormRules } from "./types";

export interface FormContextValue {
  model: Record<string, unknown>;
  rules?: FormRules;
  layout: DirectionType;
  name?: string;
  size?: SizeType;
  shape?: ShapeType;
  theme?: ThemeType;
  disabled?: boolean;
  readOnly?: boolean;
  colon?: boolean;
  labelCol?: ColProps;
  wrapperCol?: ColProps;
  getValue: (path: string) => unknown;
  setValue: (path: string, value: unknown) => void;
  register: (item: FormItemHandle) => void;
  unregister: (prop: string, item: FormItemHandle) => void;
}

export const FormContext = createContext<FormContextValue | null>(null);
