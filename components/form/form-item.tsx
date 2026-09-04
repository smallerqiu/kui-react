import clsx from "clsx";
import {
  Children,
  cloneElement,
  isValidElement,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ConfigContext } from "../config/config-context";
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
  children?: ReactNode;
}

interface RuleResult {
  ok: boolean;
  message?: string;
}

const PASS: RuleResult = { ok: true };

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

export default function FormItem({
  label,
  prop,
  labelCol,
  wrapperCol,
  rules,
  children,
}: FormItemProps) {
  const form = useContext(FormContext);
  const { locale } = useContext(ConfigContext);
  const messages = (locale ?? zhCN)?.k?.form;
  const [valid, setValid] = useState(true);
  const [message, setMessage] = useState<string>();

  const runRule = useCallback(
    (rule: FormRule, value: unknown): RuleResult | Promise<RuleResult> => {
      let passed = true;
      let errorMessage = rule.message;
      if (rule.required) {
        passed = Array.isArray(value)
          ? value.length > 0
          : value !== null && value !== undefined && value !== "" && value !== false;
        errorMessage ||= messages?.required?.replace("{label}", String(label ?? prop ?? ""));
      } else if (rule.pattern) {
        passed = rule.pattern.test(String(value ?? ""));
      } else if (rule.type === "mail") {
        passed = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/.test(String(value ?? ""));
        errorMessage ||= messages?.email;
      } else if (rule.type === "mobile") {
        passed = /^1[3-9][0-9]{9}$/.test(String(value ?? ""));
        errorMessage ||= messages?.phone;
      } else if (rule.type === "number") {
        passed =
          /^(-?\d+)(\.\d+)?$/.test(String(value ?? "")) &&
          (rule.min === undefined || Number(value) >= rule.min) &&
          (rule.max === undefined || Number(value) <= rule.max);
        errorMessage ||= messages?.number;
      } else if (rule.validator) {
        const returned = rule.validator(rule, value, (error) => {
          passed = !error;
          if (error) errorMessage = error.message;
        });
        // kui-vue 会 await validator 返回的 Promise，这里保持一致
        if (isPromiseLike(returned)) {
          return Promise.resolve(returned).then(
            (resolved) =>
              resolved === false ? ({ ok: false, message: errorMessage } as RuleResult) : PASS,
            (error: unknown) => {
              if (error instanceof Error)
                return { ok: false, message: error.message || errorMessage };
              if (typeof error === "string") return { ok: false, message: error };
              return { ok: false, message: errorMessage };
            },
          );
        }
      } else if (rule.min !== undefined || rule.max !== undefined) {
        const length =
          typeof value === "string" || Array.isArray(value) ? value.length : Number(value);
        passed =
          (rule.min === undefined || length >= rule.min) &&
          (rule.max === undefined || length <= rule.max);
        errorMessage ||= "Incorrect length";
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
      const value = prop ? form?.getValue(prop) : undefined;
      const sorted = [...target].sort((item) => (item.required ? -1 : 0));

      const applyFailure = (result: RuleResult) => {
        setValid(false);
        setMessage(result.message);
        return false;
      };
      const runRest = async (start: number): Promise<boolean> => {
        for (let index = start; index < sorted.length; index++) {
          const result = await runRule(sorted[index], value);
          if (!result.ok) return applyFailure(result);
        }
        setValid(true);
        setMessage(undefined);
        return true;
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
      setValid(true);
      setMessage(undefined);
      return true;
    },
    [form, prop, runRule],
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
    return () => form.unregister(handle.prop);
  }, [form, handle]);

  const effectiveRules = rules ?? (prop ? form?.rules?.[prop] : undefined) ?? [];
  const required = (Array.isArray(effectiveRules) ? effectiveRules : [effectiveRules]).some(
    (rule) => rule.required,
  );
  const id = form?.name && prop ? `${form.name}_${prop}` : undefined;
  const childNodes = Children.map(children, (child) => {
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
    };
    if (!isValidElement<ControlProps>(child)) return child;
    const injected: ControlProps = {
      id: child.props.id ?? id,
      size: child.props.size ?? form?.size,
      disabled: child.props.disabled ?? form?.disabled,
      readOnly: child.props.readOnly ?? form?.readOnly,
      theme: child.props.theme ?? form?.theme,
      shape: child.props.shape ?? form?.shape,
    };
    if (prop) {
      injected.value = form?.getValue(prop);
      const original = child.props.onChange;
      injected.onChange = (value: unknown) => {
        form?.setValue(prop, value);
        original?.(value);
        validate(effectiveRules, "change");
      };
      const originalBlur = child.props.onBlur;
      injected.onBlur = (...args: unknown[]) => {
        originalBlur?.(...args);
        validate(effectiveRules, "blur");
      };
    }
    return cloneElement(child, injected);
  });
  const labelProps = form?.layout === "inline" ? {} : (labelCol ?? form?.labelCol ?? {});
  const contentProps =
    form?.layout === "inline" ? {} : { ...(wrapperCol ?? form?.wrapperCol ?? {}) };
  if (form?.layout === "vertical") delete contentProps.offset;

  return (
    <Row
      className={clsx("k-form-item", {
        "k-form-item-required": required,
        "k-form-item-error": !valid,
      })}
      type="flex"
    >
      {label != null && (
        <Col className="k-form-item-label" {...labelProps}>
          <label htmlFor={id}>{label}</label>
        </Col>
      )}
      <Col {...contentProps}>
        <div className="k-form-item-content">
          {childNodes}
          {prop && !valid && <div className="k-form-item-error-tip">{message}</div>}
        </div>
      </Col>
    </Row>
  );
}
