import clsx from "clsx";
import {
  forwardRef,
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
  model?: Record<string, any>;
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
  onChange?: (model: Record<string, any>) => void;
}

const getByPath = (object: Record<string, any>, path: string) => {
  const keys = path
    .replace(/\[(\w+)\]/g, ".$1")
    .replace(/^\./, "")
    .split(".");
  let parent: any = object;
  for (let index = 0; index < keys.length - 1; index++) parent = parent?.[keys[index]];
  const key = keys.at(-1)!;
  return { parent, key, value: parent?.[key] };
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
  const setValue = (path: string, value: any) => {
    const { parent, key } = getByPath(model, path);
    if (parent) parent[key] = value;
    onChange?.(model);
  };
  const validate = (callback?: (result: FormSubmitEvent) => void) => {
    let valid = true;
    for (const item of itemsRef.current.values()) {
      if (!item.validate(item.rules ?? rules?.[item.prop])) valid = false;
    }
    callback?.({ valid });
    return valid;
  };
  const reset = () => {
    for (const item of itemsRef.current.values()) {
      setValue(item.prop, undefined);
      item.reset();
    }
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
    [model, rules, layout, name, size, shape, theme, disabled, labelCol, wrapperCol, onChange]
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
