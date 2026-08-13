import clsx from "clsx";
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  type FormEvent,
  type FormHTMLAttributes,
} from "react";
import type { DirectionType, ShapeType, SizeType, ThemeType } from "../const/types";
import type { ColProps, FormRule } from "./types";
import { FormContext, type FormContextValue } from "./form-context";

export interface FormSubmitEvent {
  valid: boolean;
}
export interface FormItemHandle {
  prop: string;
  rules?: FormRule | FormRule[];
  validate: (rules?: FormRule | FormRule[]) => boolean;
  reset: () => void;
}
export interface FormExpose {
  validate: (callback?: (result: FormSubmitEvent) => void) => boolean;
  reset: () => void;
  test: (key: string) => boolean | undefined;
  submit: () => void;
}
export interface FormProps extends Omit<
  FormHTMLAttributes<HTMLFormElement>,
  "onSubmit" | "onReset" | "onChange"
> {
  layout?: DirectionType;
  model?: Record<string, unknown>;
  name?: string;
  labelCol?: ColProps;
  wrapperCol?: ColProps;
  rules?: Record<string, FormRule[]>;
  size?: SizeType;
  theme?: ThemeType;
  shape?: ShapeType;
  disabled?: boolean;
  onSubmit?: (event: FormSubmitEvent) => void;
  onReset?: () => void;
  onChange?: (model: Record<string, unknown>) => void;
}

const getByPath = (object: Record<string, unknown>, path: string) => {
  const keys = path
    .replace(/\[(\w+)\]/g, ".$1")
    .replace(/^\./, "")
    .split(".");
  let parent: Record<string, unknown> | undefined = object;
  for (let index = 0; index < keys.length - 1; index++) {
    const next: unknown = parent?.[keys[index]];
    parent = typeof next === "object" && next !== null ? (next as Record<string, unknown>) : undefined;
  }
  const key = keys.at(-1)!;
  return { parent, key, value: parent?.[key] };
};

const setByPath = (object: Record<string, unknown>, path: string, value: unknown) => {
  const keys = path.replace(/\[(\w+)\]/g, ".$1").replace(/^\./, "").split(".");
  const result: Record<string, unknown> = { ...object };
  let source: unknown = object;
  let target: Record<string, unknown> = result;
  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      target[key] = value;
      return;
    }
    const sourceValue =
      typeof source === "object" && source !== null
        ? (source as Record<string, unknown>)[key]
        : undefined;
    const next = Array.isArray(sourceValue)
      ? [...sourceValue]
      : typeof sourceValue === "object" && sourceValue !== null
        ? { ...(sourceValue as Record<string, unknown>) }
        : {};
    target[key] = next;
    target = next as Record<string, unknown>;
    source = sourceValue;
  });
  return result;
};

const Form = forwardRef<FormExpose, FormProps>(function Form(
  {
    layout = "horizontal",
    model = {},
    name,
    labelCol,
    wrapperCol,
    rules,
    size,
    theme,
    shape,
    disabled,
    onSubmit,
    onReset,
    onChange,
    className,
    children,
    ...rest
  },
  ref
) {
  const itemsRef = useRef(new Map<string, FormItemHandle>());
  const setValue = useCallback(
    (path: string, value: unknown) => onChange?.(setByPath(model, path, value)),
    [model, onChange]
  );
  const validate = (callback?: (result: FormSubmitEvent) => void) => {
    let valid = true;
    for (const item of itemsRef.current.values()) {
      if (!item.validate(item.rules ?? rules?.[item.prop])) valid = false;
    }
    callback?.({ valid });
    return valid;
  };
  const reset = () => {
    let nextModel = model;
    for (const item of itemsRef.current.values()) {
      nextModel = setByPath(nextModel, item.prop, undefined);
      item.reset();
    }
    onChange?.(nextModel);
    onReset?.();
  };
  const submit = () => onSubmit?.({ valid: validate() });
  useImperativeHandle(ref, () => ({
    validate,
    reset,
    test: (key) => {
      const item = itemsRef.current.get(key);
      return item?.validate(item.rules ?? rules?.[key]);
    },
    submit,
  }));
  const context = useMemo<FormContextValue>(
    () => ({
      model,
      rules,
      layout,
      name,
      size,
      shape,
      theme,
      disabled,
      labelCol,
      wrapperCol,
      getValue: (path) => getByPath(model, path).value,
      setValue,
      register: (item) => itemsRef.current.set(item.prop, item),
      unregister: (prop) => itemsRef.current.delete(prop),
    }),
    [model, rules, layout, name, size, shape, theme, disabled, labelCol, wrapperCol, setValue]
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submit();
  };
  return (
    <FormContext.Provider value={context}>
      <form
        {...rest}
        id={name}
        className={clsx(
          "k-form",
          `k-form-${layout}`,
          { "k-form-lg": size === "large", "k-form-sm": size === "small" },
          className
        )}
        onSubmit={handleSubmit}
        onReset={(event) => {
          event.preventDefault();
          reset();
        }}
        autoComplete="off"
      >
        {children}
      </form>
    </FormContext.Provider>
  );
});
export default Form;
