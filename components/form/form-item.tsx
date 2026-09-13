import clsx from "clsx";
import {
  Children,
  cloneElement,
  isValidElement,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useId,
  useState,
  type ReactNode,
} from "react";
import { ConfigContext } from "../config/config-context";
import Transition from "../base/transition";
import type { ShapeType, SizeType, ThemeType } from "../const/types";
import zhCN from "../locale/zh-CN";
import { Col, Row } from "../row-col";
import type { FormItemHandle } from "./form";
import { FormContext } from "./form-context";
import type { ColProps, FormRule, FormValidateTrigger } from "./types";

export interface FormItemProps {
  label?: ReactNode;
  prop?: string;
  labelCol?: ColProps;
  wrapperCol?: ColProps;
  rules?: FormRule | FormRule[];
  colon?: boolean;
  children?: ReactNode;
}

interface RuleResult {
  ok: boolean;
  message?: string;
}

const PASS: RuleResult = { ok: true };
const validationVersions = new WeakMap<object, number>();

const isPromiseLike = (value: unknown): value is PromiseLike<unknown> =>
  typeof value === "object" &&
  value !== null &&
  typeof (value as PromiseLike<unknown>).then === "function";

/** 与 kui-vue `form-item.tsx` 的 `matchesTrigger` 保持一致 */
const matchesTrigger = (rule: FormRule, trigger: FormValidateTrigger) => {
  if (!rule.trigger) return trigger === "change";
  const triggers = Array.isArray(rule.trigger) ? rule.trigger : [rule.trigger];
  return triggers.includes(trigger);
};

const isEmptyValue = (value: unknown) =>
  value === null ||
  value === undefined ||
  value === "" ||
  (Array.isArray(value) && value.length === 0);

const FORM_CONTROL_NAMES = new Set([
  "AutoComplete",
  "Cascader",
  "CheckCard",
  "CheckCardGroup",
  "Checkbox",
  "CheckboxGroup",
  "ColorPicker",
  "DatePicker",
  "Input",
  "InputNumber",
  "InputOTP",
  "InputTag",
  "Mentions",
  "Radio",
  "RadioButton",
  "RadioGroup",
  "Rate",
  "Segmented",
  "Select",
  "Slider",
  "Switch",
  "TextArea",
  "TimePicker",
  "TreeSelect",
  "Transfer",
  "Upload",
]);

const getComponentName = (type: unknown) => {
  if ((typeof type !== "function" && typeof type !== "object") || type === null) return undefined;
  const component = type as {
    displayName?: string;
    name?: string;
    render?: { displayName?: string };
  };
  return component.displayName ?? component.render?.displayName ?? component.name;
};

const isFormControlElement = (child: ReactNode) =>
  isValidElement(child) && FORM_CONTROL_NAMES.has(getComponentName(child.type) ?? "");

export default function FormItem({
  label,
  prop,
  labelCol,
  wrapperCol,
  rules,
  colon,
  children,
}: FormItemProps) {
  const form = useContext(FormContext);
  const { locale } = useContext(ConfigContext);
  const messages = (locale ?? zhCN)?.k?.form;
  const [valid, setValid] = useState(true);
  const [message, setMessage] = useState<string>();
  const generatedId = `form_${useId().replace(/:/g, "")}`;
  const validationKey = useMemo(() => ({}), []);

  const runRule = useCallback(
    (rule: FormRule, value: unknown): RuleResult | Promise<RuleResult> => {
      let passed = true;
      let errorMessage = rule.message;
      const empty = isEmptyValue(value);

      if (rule.required) {
        passed = !empty && value !== false;
        if (!passed) {
          errorMessage ||= messages?.required?.replace("{label}", String(label ?? prop ?? ""));
        }
      } else if (empty) {
        return PASS;
      }

      if (passed && rule.pattern) {
        rule.pattern.lastIndex = 0;
        passed = rule.pattern.test(String(value));
        rule.pattern.lastIndex = 0;
      }

      if (passed && rule.type === "mail") {
        passed = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/.test(String(value));
        errorMessage ||= messages?.email;
      } else if (passed && rule.type === "mobile") {
        passed = /^1[3-9][0-9]{9}$/.test(String(value));
        errorMessage ||= messages?.phone;
      } else if (passed && rule.type === "number") {
        passed = /^(-?\d+)(\.\d+)?$/.test(String(value));
        errorMessage ||= messages?.number;
      }

      if (passed && (rule.min !== undefined || rule.max !== undefined)) {
        const numeric = rule.type === "number" || typeof value === "number";
        const comparable =
          typeof value === "string"
            ? numeric
              ? Number(value)
              : value.replace(/[\u0391-\uFFE5]/g, "aa").length
            : Array.isArray(value)
              ? value.length
              : Number(value);
        passed =
          (rule.min === undefined || comparable >= rule.min) &&
          (rule.max === undefined || comparable <= rule.max);
        errorMessage ||= "Incorrect length";
      }

      if (passed && rule.validator) {
        let callbackResult: RuleResult = PASS;
        const returned = rule.validator(rule, value, (error) => {
          callbackResult = error ? { ok: false, message: error.message || errorMessage } : PASS;
        });
        if (isPromiseLike(returned)) {
          return Promise.resolve(returned).then(
            (resolved) => {
              if (!callbackResult.ok) return callbackResult;
              return resolved === false ? { ok: false, message: errorMessage } : PASS;
            },
            (error: unknown) => {
              if (error instanceof Error)
                return { ok: false, message: error.message || errorMessage };
              if (typeof error === "string") return { ok: false, message: error };
              return { ok: false, message: errorMessage };
            },
          );
        }
        return callbackResult;
      }

      return passed ? PASS : { ok: false, message: errorMessage };
    },
    [label, messages, prop],
  );

  const validate = useCallback(
    (
      ruleInput?: FormRule | FormRule[],
      trigger?: FormValidateTrigger,
    ): boolean | Promise<boolean> => {
      const list = ruleInput ? (Array.isArray(ruleInput) ? ruleInput : [ruleInput]) : [];
      // 指定触发时机时只校验匹配的规则；手动调用与提交校验不区分时机，全部校验
      const target = trigger ? list.filter((rule) => matchesTrigger(rule, trigger)) : list;
      if (target.length === 0) return true;
      const currentVersion = (validationVersions.get(validationKey) ?? 0) + 1;
      validationVersions.set(validationKey, currentVersion);
      const value = prop ? form?.getValue(prop) : undefined;
      const sorted = [...target].sort((item) => (item.required ? -1 : 0));

      const applyFailure = (result: RuleResult) => {
        if (currentVersion === validationVersions.get(validationKey)) {
          setValid(false);
          setMessage(result.message);
        }
        return false;
      };
      const applySuccess = () => {
        if (currentVersion === validationVersions.get(validationKey)) {
          setValid(true);
          setMessage(undefined);
        }
        return true;
      };
      const runRest = async (start: number): Promise<boolean> => {
        for (let index = start; index < sorted.length; index++) {
          const result = await runRule(sorted[index], value);
          if (!result.ok) return applyFailure(result);
        }
        return applySuccess();
      };

      for (let index = 0; index < sorted.length; index++) {
        const result = runRule(sorted[index], value);
        if (isPromiseLike(result)) {
          return Promise.resolve(result).then((resolved) =>
            resolved.ok ? runRest(index + 1) : applyFailure(resolved),
          );
        }
        if (!result.ok) return applyFailure(result);
      }
      return applySuccess();
    },
    [form, prop, runRule, validationKey],
  );

  const handle = useMemo<FormItemHandle | null>(
    () =>
      prop
        ? {
            prop,
            rules,
            validate,
            reset: () => {
              setValid(true);
              setMessage(undefined);
            },
          }
        : null,
    [prop, rules, validate],
  );
  useEffect(() => {
    if (!handle || !form) return;
    form.register(handle);
    return () => form.unregister(handle.prop, handle);
  }, [form, handle]);

  const effectiveRules = rules ?? (prop ? form?.rules?.[prop] : undefined) ?? [];
  const required = (Array.isArray(effectiveRules) ? effectiveRules : [effectiveRules]).some(
    (rule) => rule.required,
  );
  const id = form?.name && prop ? `${form.name}_${prop}` : `${generatedId}_${prop ?? "field"}`;
  const errorId = `${id}_error`;
  const labelId = `${id}_label`;
  const describedBy = !valid && prop ? errorId : undefined;
  const childArray = Children.toArray(children);
  const controlIndex = childArray.findIndex(isFormControlElement);
  const childNodes: ReactNode[] = [];
  for (let index = 0; index < childArray.length; index++) {
    const child = childArray[index];
    type ControlProps = {
      id?: string;
      size?: SizeType;
      disabled?: boolean;
      readOnly?: boolean;
      theme?: ThemeType;
      shape?: ShapeType;
      value?: unknown;
      onChange?: (value: unknown) => void;
      onBlur?: (...args: unknown[]) => void;
      "aria-describedby"?: string;
      "aria-invalid"?: boolean;
      "aria-labelledby"?: string;
      "aria-required"?: boolean;
      checked?: boolean;
      fileList?: unknown[];
      targetKeys?: unknown[];
    };
    if (!isValidElement<ControlProps>(child)) {
      childNodes.push(child);
      continue;
    }
    const nativeControl =
      typeof child.type === "string" && ["input", "select", "textarea"].includes(child.type);
    if (nativeControl) {
      const originalBlur = child.props.onBlur;
      const nativeBoolean =
        child.type === "input" && ["checkbox", "radio"].includes(String(child.props.type));
      const fieldValue = prop ? form?.getValue(prop) : undefined;
      childNodes.push(
        cloneElement(child, {
          id: child.props.id ?? id,
          "aria-describedby": describedBy,
          "aria-invalid": !valid || undefined,
          "aria-required": required || undefined,
          value: prop && !nativeBoolean ? (fieldValue as never) : child.props.value,
          checked: prop && nativeBoolean ? Boolean(fieldValue) : child.props.checked,
          onChange: prop
            ? (...args: unknown[]) => {
                const event = args[0] as
                  { target?: { value?: unknown; checked?: boolean } } | undefined;
                form?.setValue(prop, nativeBoolean ? event?.target?.checked : event?.target?.value);
                child.props.onChange?.(args[0]);
                validate(effectiveRules, "change");
              }
            : child.props.onChange,
          onBlur: prop
            ? (...args: unknown[]) => {
                originalBlur?.(...args);
                validate(effectiveRules, "blur");
              }
            : originalBlur,
        }),
      );
      continue;
    }
    if (index !== controlIndex) {
      childNodes.push(child);
      continue;
    }
    const injected: ControlProps = {
      id: child.props.id ?? id,
      "aria-describedby": describedBy,
      "aria-invalid": !valid || undefined,
      "aria-labelledby": label != null ? labelId : undefined,
      "aria-required": required || undefined,
      size: child.props.size ?? form?.size,
      disabled: child.props.disabled ?? form?.disabled,
      readOnly: child.props.readOnly ?? form?.readOnly,
      theme: child.props.theme ?? form?.theme,
      shape: child.props.shape ?? form?.shape,
    };
    if (prop) {
      const componentName = getComponentName(child.type);
      const fieldValue = form?.getValue(prop);
      if (
        ["Checkbox", "Radio", "RadioButton", "CheckCard", "Switch"].includes(componentName ?? "")
      ) {
        injected.checked = Boolean(fieldValue === true || fieldValue === 1 || fieldValue === "1");
      } else if (componentName === "Transfer") {
        injected.targetKeys = Array.isArray(fieldValue) ? fieldValue : [];
      } else if (componentName === "Upload") {
        injected.fileList = Array.isArray(fieldValue) ? fieldValue : [];
      } else {
        injected.value = fieldValue;
      }
      const original = child.props.onChange;
      injected.onChange = (value: unknown) => {
        const eventValue = value as {
          checked?: boolean;
          targetKeys?: unknown[];
          fileList?: unknown[];
        };
        const nextValue = ["Checkbox", "Radio", "RadioButton", "CheckCard"].includes(
          componentName ?? "",
        )
          ? eventValue?.checked
          : componentName === "Transfer"
            ? eventValue?.targetKeys
            : componentName === "Upload"
              ? eventValue?.fileList
              : value;
        form?.setValue(prop, nextValue);
        original?.(value);
        validate(effectiveRules, "change");
      };
      const originalBlur = child.props.onBlur;
      injected.onBlur = (...args: unknown[]) => {
        originalBlur?.(...args);
        validate(effectiveRules, "blur");
      };
    }
    childNodes.push(cloneElement(child, injected));
  }
  const labelProps = form?.layout === "inline" ? {} : (labelCol ?? form?.labelCol ?? {});
  const contentProps =
    form?.layout === "inline" ? {} : { ...(wrapperCol ?? form?.wrapperCol ?? {}) };
  if (form?.layout === "vertical") delete contentProps.offset;

  return (
    <Row
      className={clsx("k-form-item", {
        "k-form-item-required": required,
        "k-form-item-error": !valid,
        "k-form-item-no-colon": !(colon ?? form?.colon ?? true),
      })}
      type="flex"
    >
      {label != null && (
        <Col className="k-form-item-label" {...labelProps}>
          <label id={labelId} htmlFor={id}>
            {label}
          </label>
        </Col>
      )}
      <Col {...contentProps}>
        <div className="k-form-item-content">{childNodes}</div>
        {prop && (
          <Transition show={!valid} name="k-form-item-fade">
            <div id={errorId} className="k-form-item-error-tip" role="alert">
              {message}
            </div>
          </Transition>
        )}
      </Col>
    </Row>
  );
}
