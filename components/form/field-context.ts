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

export const FormFieldContext = createContext<FormFieldContextValue | null>(null);

export interface FormFieldAdapter {
  valueProp?: "value" | "checked" | "fileList" | "targetKeys";
  getChangeValue?: (...args: unknown[]) => unknown;
  getFieldValue?: (value: unknown) => unknown;
  inherit?: Array<"size" | "shape" | "theme" | "disabled" | "readOnly">;
}

const formFieldComponents = new WeakSet<object>();

export const resolveFormControlAttrs = (
  props: Record<string, unknown>,
  field: FormFieldContextValue | null,
) => ({
  id: props.id ?? (field?.prop ? field.id : undefined),
  "aria-labelledby":
    props["aria-labelledby"] ?? (field?.prop ? field.labelId : undefined),
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
    if (!field?.prop) return createElement(Control, props as Record<string, unknown>);

    const source = props as Record<string, unknown>;
    const valueProp = adapter.valueProp ?? "value";
    const originalChange = source.onChange as ((...args: unknown[]) => void) | undefined;
    const originalBlur = source.onBlur as ((...args: unknown[]) => void) | undefined;
    const inherit = adapter.inherit ?? ["size", "shape", "theme", "disabled", "readOnly"];
    const controlProps = {
      ...source,
      ...resolveFormControlAttrs(source, field),
      [valueProp]: adapter.getFieldValue ? adapter.getFieldValue(field.value) : field.value,
      onChange: (...args: unknown[]) => {
        originalChange?.(...args);
        field.update(adapter.getChangeValue ? adapter.getChangeValue(...args) : args[0]);
      },
      onBlur: (...args: unknown[]) => {
        originalBlur?.(...args);
        field.blur();
      },
    } as Record<string, unknown>;
    if (inherit.includes("size") && source.size === undefined) controlProps.size = field.size;
    if (inherit.includes("shape") && source.shape === undefined) controlProps.shape = field.shape;
    if (inherit.includes("theme") && source.theme === undefined) controlProps.theme = field.theme;
    if (inherit.includes("disabled") && source.disabled === undefined)
      controlProps.disabled = field.disabled;
    if (inherit.includes("readOnly") && source.readOnly === undefined)
      controlProps.readOnly = field.readOnly;

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
