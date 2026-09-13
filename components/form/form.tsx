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
import type { ColProps, FormRule, FormRules } from "./types";
import { FormContext, type FormContextValue } from "./form-context";
import { getByPath, setByPath } from "./utils";

export interface FormSubmitEvent {
  valid: boolean;
}
export interface FormItemHandle {
  prop: string;
  rules?: FormRule | FormRule[];
  /** 存在异步 `validator` 时返回 Promise，否则同步返回 */
  validate: (rules?: FormRule | FormRule[]) => boolean | Promise<boolean>;
  reset: () => void;
}
export interface FormExpose {
  /** 存在异步 `validator` 时返回 Promise，否则同步返回 */
  validate: (callback?: (result: FormSubmitEvent) => void) => boolean | Promise<boolean>;
  reset: () => void;
  test: (key: string) => boolean | Promise<boolean> | undefined;
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
  rules?: FormRules;
  size?: SizeType;
  theme?: ThemeType;
  shape?: ShapeType;
  disabled?: boolean;
  readOnly?: boolean;
  colon?: boolean;
  onSubmit?: (event: FormSubmitEvent) => void;
  onReset?: () => void;
  onChange?: (model: Record<string, unknown>) => void;
}

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
  const itemsRef = useRef(new Map<string, FormItemHandle>());
  const setValue = useCallback(
    (path: string, value: unknown) => onChange?.(setByPath(model, path, value)),
    [model, onChange],
  );
  const validate = useCallback(
    (callback?: (result: FormSubmitEvent) => void) => {
      const results = [...itemsRef.current.values()].map((item) =>
        item.validate(item.rules ?? rules?.[item.prop]),
      );
      const settle = (valid: boolean) => {
        callback?.({ valid });
        return valid;
      };
      // 只有存在异步校验时才升级为 Promise，保证纯同步规则下 onSubmit 同步触发
      if (results.some((result) => result instanceof Promise)) {
        return Promise.all(results).then((values) => settle(values.every(Boolean)));
      }
      return settle((results as boolean[]).every(Boolean));
    },
    [rules],
  );
  const reset = useCallback(() => {
    let nextModel = model;
    for (const item of itemsRef.current.values()) {
      nextModel = setByPath(nextModel, item.prop, null);
      item.reset();
    }
    onChange?.(nextModel);
    onReset?.();
  }, [model, onChange, onReset]);
  const submit = useCallback(() => {
    const result = validate();
    if (result instanceof Promise)
      return result.then((valid) => {
        onSubmit?.({ valid });
      });
    onSubmit?.({ valid: result });
  }, [onSubmit, validate]);
  useImperativeHandle(
    ref,
    () => ({
      validate,
      reset,
      test: (key) => {
        const item = itemsRef.current.get(key);
        return item?.validate(item.rules ?? rules?.[key]);
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
      size,
      shape,
      theme,
      disabled,
      readOnly,
      colon,
      labelCol,
      wrapperCol,
      getValue: (path) => getByPath(model, path).value,
      setValue,
      register: (item) => itemsRef.current.set(item.prop, item),
      unregister: (prop, item) => {
        if (itemsRef.current.get(prop) === item) itemsRef.current.delete(prop);
      },
    }),
    [
      model,
      rules,
      layout,
      name,
      size,
      shape,
      theme,
      disabled,
      readOnly,
      colon,
      labelCol,
      wrapperCol,
      setValue,
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
          { "k-form-lg": size === "large", "k-form-sm": size === "small" },
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
