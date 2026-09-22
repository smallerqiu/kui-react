import clsx from "clsx";
import {
  forwardRef,
  useCallback,
  useContext,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type FormHTMLAttributes,
} from "react";
import type { DirectionType, ShapeType, SizeType, ThemeType } from "../const/types";
import { ConfigContext } from "../config/config-context";
import type { ColProps, FormRule, FormRules } from "./types";
import { FormContext, type FormContextValue } from "./form-context";
import { getByPath, setByPath } from "./utils";

export interface FormSubmitEvent {
  valid: boolean;
}
type FormChangeHandler = {
  bivarianceHack(model: Record<string, unknown>): void;
}["bivarianceHack"];
export interface FormItemHandle {
  prop: string;
  rules?: FormRule | FormRule[];
  validate: (
    rules?: FormRule | FormRule[],
    trigger?: import("./types").FormValidateTrigger,
  ) => Promise<boolean>;
  reset: (value?: unknown) => void;
}
export interface FormExpose {
  validate: (callback?: (result: FormSubmitEvent) => void) => Promise<FormSubmitEvent>;
  reset: () => void;
  test: (
    key: string,
    trigger?: import("./types").FormValidateTrigger,
  ) => Promise<boolean> | undefined;
  submit: () => Promise<void>;
}
export interface FormProps extends Omit<
  FormHTMLAttributes<HTMLFormElement>,
  "onSubmit" | "onReset" | "onChange" | "defaultValue" | "defaultChecked"
> {
  layout?: DirectionType;
  model?: Record<string, unknown>;
  name?: string;
  labelCol?: ColProps;
  wrapperCol?: ColProps;
  rules?: FormRules;
  size?: SizeType;
  theme?: ThemeType;
  shape?: ShapeType;
  disabled?: boolean;
  readOnly?: boolean;
  colon?: boolean;
  onSubmit?: (event: FormSubmitEvent) => void;
  onReset?: () => void;
  onChange?: FormChangeHandler;
}

const Form = forwardRef<FormExpose, FormProps>(function Form(
  {
    layout = "horizontal",
    model: modelProp,
    name,
    labelCol,
    wrapperCol,
    rules,
    size,
    theme,
    shape,
    disabled,
    readOnly,
    colon = true,
    onSubmit,
    onReset,
    onChange,
    className,
    children,
    ...rest
  },
  ref,
) {
  const [innerModel, setInnerModel] = useState<Record<string, unknown>>({});
  const model = modelProp ?? innerModel;
  const globalConfig = useContext(ConfigContext);
  const currentSize = size ?? globalConfig.size;
  const currentShape = shape ?? globalConfig.shape;
  const currentTheme = theme ?? globalConfig.theme;
  const itemsRef = useRef(new Map<string, FormItemHandle>());
  const register = useCallback((item: FormItemHandle) => itemsRef.current.set(item.prop, item), []);
  const unregister = useCallback((prop: string, item: FormItemHandle) => {
    if (itemsRef.current.get(prop) === item) itemsRef.current.delete(prop);
  }, []);
  const setValue = useCallback(
    (path: string, value: unknown) => {
      const nextModel = setByPath(model, path, value);
      if (modelProp === undefined) setInnerModel(nextModel);
      onChange?.(nextModel);
    },
    [model, modelProp, onChange],
  );
  const validate = useCallback(
    async (callback?: (result: FormSubmitEvent) => void) => {
      const values = await Promise.all(
        [...itemsRef.current.values()].map((item) =>
          item.validate(item.rules ?? rules?.[item.prop]),
        ),
      );
      const result = { valid: values.every(Boolean) };
      callback?.(result);
      return result;
    },
    [rules],
  );
  const reset = useCallback(() => {
    let nextModel = model;
    for (const item of itemsRef.current.values()) {
      nextModel = setByPath(nextModel, item.prop, null);
      item.reset(null);
    }
    if (modelProp === undefined) setInnerModel(nextModel);
    onChange?.(nextModel);
    onReset?.();
  }, [model, modelProp, onChange, onReset]);
  const submit = useCallback(async () => {
    const result = await validate();
    onSubmit?.(result);
  }, [onSubmit, validate]);
  useImperativeHandle(
    ref,
    () => ({
      validate,
      reset,
      test: (key, trigger) => {
        const item = itemsRef.current.get(key);
        return item?.validate(item.rules ?? rules?.[key], trigger);
      },
      submit,
    }),
    [reset, rules, validate, submit],
  );
  const context = useMemo<FormContextValue>(
    () => ({
      model,
      rules,
      layout,
      name,
      size: currentSize,
      shape: currentShape,
      theme: currentTheme,
      disabled,
      readOnly,
      colon,
      labelCol,
      wrapperCol,
      getValue: (path) => getByPath(model, path).value,
      setValue,
      register,
      unregister,
    }),
    [
      model,
      rules,
      layout,
      name,
      currentSize,
      currentShape,
      currentTheme,
      disabled,
      readOnly,
      colon,
      labelCol,
      wrapperCol,
      setValue,
      register,
      unregister,
    ],
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
          { "k-form-lg": currentSize === "large", "k-form-sm": currentSize === "small" },
          className,
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
