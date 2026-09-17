import {
  createContext,
  createElement,
  useContext,
  type ComponentPropsWithoutRef,
  type ComponentType,
  type ElementType,
  type ReactNode,
} from "react";
import type { ShapeType, SizeType, ThemeType } from "../const/types";
import { FormContext } from "./form-context";

export interface FormFieldContextValue {
  id: string;
  labelId: string;
  errorId: string;
  prop?: string;
  value: unknown;
  size?: SizeType;
  shape?: ShapeType;
  theme?: ThemeType;
  disabled: boolean;
  readOnly: boolean;
  invalid: boolean;
  required: boolean;
  describedBy?: string;
  update: (value: unknown) => void;
  blur: () => void;
}

// undefined: no FormItem; null: the enclosing control has already consumed the defaults.
export const FormFieldContext = createContext<FormFieldContextValue | null | undefined>(undefined);

export interface FormFieldAdapter {
  valueProp?: "value" | "checked" | "fileList" | "targetKeys";
  getChangeValue?: (...args: unknown[]) => unknown;
  getFieldValue?: (value: unknown) => unknown;
  inherit?: Array<"size" | "shape" | "theme" | "disabled" | "readOnly">;
}

const formFieldComponents = new WeakSet<object>();

export const resolveFormControlAttrs = (
  props: Record<string, unknown>,
  field: FormFieldContextValue | null | undefined,
) => ({
  id: props.id ?? (field?.prop ? field.id : undefined),
  "aria-labelledby": props["aria-labelledby"] ?? (field?.prop ? field.labelId : undefined),
  "aria-describedby": props["aria-describedby"] ?? field?.describedBy,
  "aria-invalid": props["aria-invalid"] ?? (field?.invalid || undefined),
  "aria-required": props["aria-required"] ?? (field?.required || undefined),
});

export const isFormFieldComponent = (component: unknown) =>
  (typeof component === "object" || typeof component === "function") &&
  component !== null &&
  formFieldComponents.has(component);

export function createFormFieldComponent<T extends ElementType>(
  Component: T,
  adapter: FormFieldAdapter = {},
): T {
  type Props = ComponentPropsWithoutRef<T>;
  const Control = Component as ComponentType<Record<string, unknown>>;
  const FormFieldComponent = (props: Props) => {
    const field = useContext(FormFieldContext);
    const form = useContext(FormContext);
    if (field === null || (!field && !form))
      return createElement(Control, props as Record<string, unknown>);

    const source = props as Record<string, unknown>;
    const valueProp = adapter.valueProp ?? "value";
    const originalChange = source.onChange as ((...args: unknown[]) => void) | undefined;
    const originalBlur = source.onBlur as ((...args: unknown[]) => void) | undefined;
    const inherit = adapter.inherit ?? ["size", "shape", "theme", "disabled", "readOnly"];
    const controlProps = {
      ...source,
      ...resolveFormControlAttrs(source, field),
    } as Record<string, unknown>;
    // Presentation and interaction state are inherited even without a model binding.
    if (field?.prop) {
      controlProps[valueProp] = adapter.getFieldValue
        ? adapter.getFieldValue(field.value)
        : field.value;
      controlProps.onChange = (...args: unknown[]) => {
        originalChange?.(...args);
        field.update(adapter.getChangeValue ? adapter.getChangeValue(...args) : args[0]);
      };
      controlProps.onBlur = (...args: unknown[]) => {
        originalBlur?.(...args);
        field.blur();
      };
    }
    for (const name of inherit) {
      if (source[name] === undefined) controlProps[name] = field?.[name] ?? form?.[name];
    }

    return createElement(
      FormFieldContext.Provider,
      { value: null },
      createElement(Control, controlProps as Record<string, unknown>),
    );
  };
  const componentInfo = Component as { displayName?: string; name?: string };
  FormFieldComponent.displayName = `FormField(${componentInfo.displayName ?? componentInfo.name})`;
  formFieldComponents.add(FormFieldComponent);
  return FormFieldComponent as unknown as T;
}

export function FormFieldProvider({
  value,
  children,
}: {
  value: FormFieldContextValue;
  children: ReactNode;
}) {
  return createElement(FormFieldContext.Provider, { value }, children);
}
