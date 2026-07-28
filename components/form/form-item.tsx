import clsx from "clsx";
import {
  Children,
  cloneElement,
  isValidElement,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { ConfigContext } from "../config";
import zhCN from "../locale/zh-CN";
import { Col, Row } from "../row-col";
import { FormContext, type FormItemHandle } from "./form";
import type { ColProps, FormRule } from "./types";

export interface FormItemProps {
  label?: ReactNode;
  prop?: string;
  labelCol?: ColProps;
  wrapperCol?: ColProps;
  rules?: FormRule | FormRule[];
  children?: ReactNode;
}

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

  const validate = (ruleInput?: FormRule | FormRule[]) => {
    const list = ruleInput ? (Array.isArray(ruleInput) ? ruleInput : [ruleInput]) : [];
    const value = prop ? form?.getValue(prop) : undefined;
    for (const rule of [...list].sort((item) => (item.required ? -1 : 0))) {
      let passed = true;
      let errorMessage = rule.message;
      if (rule.required) {
        passed = Array.isArray(value)
          ? value.length > 0
          : value !== null && value !== undefined && value !== "" && value !== false;
        errorMessage ||= messages?.required?.replace("{label}", String(label ?? prop ?? ""));
      } else if (rule.pattern) passed = rule.pattern.test(value);
      else if (rule.type === "mail") {
        passed = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/.test(value);
        errorMessage ||= messages?.email;
      } else if (rule.type === "mobile") {
        passed = /^1[3-9][0-9]{9}$/.test(value);
        errorMessage ||= messages?.mobile;
      } else if (rule.type === "number") {
        passed =
          /^(-?\d+)(\.\d+)?$/.test(value) &&
          (rule.min === undefined || value >= rule.min) &&
          (rule.max === undefined || value <= rule.max);
        errorMessage ||= messages?.number;
      } else if (rule.validator) {
        rule.validator(rule, value, (error) => {
          passed = !error;
          if (error) errorMessage = error.message;
        });
      } else if (rule.min !== undefined || rule.max !== undefined) {
        const length = typeof value === "string" || Array.isArray(value) ? value.length : value;
        passed =
          (rule.min === undefined || length >= rule.min) &&
          (rule.max === undefined || length <= rule.max);
        errorMessage ||= "Incorrect length";
      }
      if (!passed) {
        setValid(false);
        setMessage(errorMessage);
        return false;
      }
    }
    setValid(true);
    setMessage(undefined);
    return true;
  };
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
    [prop, rules, form, label, messages]
  );
  useEffect(() => {
    if (!handle || !form) return;
    form.register(handle);
    return () => form.unregister(handle.prop);
  }, [form, handle]);

  const effectiveRules = rules ?? (prop ? form?.rules?.[prop] : undefined) ?? [];
  const required = (Array.isArray(effectiveRules) ? effectiveRules : [effectiveRules]).some(
    (rule) => rule.required
  );
  const id = form?.name && prop ? `${form.name}_${prop}` : undefined;
  const childNodes = Children.map(children, (child) => {
    if (!isValidElement<Record<string, any>>(child)) return child;
    const injected: Record<string, any> = {
      id: child.props.id ?? id,
      size: child.props.size ?? form?.size,
      disabled: child.props.disabled ?? form?.disabled,
      theme: child.props.theme ?? form?.theme,
      shape: child.props.shape ?? form?.shape,
    };
    if (prop) {
      injected.value = form?.getValue(prop);
      const original = child.props.onChange;
      injected.onChange = (value: any) => {
        form?.setValue(prop, value);
        original?.(value);
        validate(effectiveRules);
      };
    }
    return cloneElement(child as ReactElement<Record<string, any>>, injected);
  });
  const labelProps = form?.layout === "inline" ? {} : (labelCol ?? form?.labelCol ?? {});
  const contentProps =
    form?.layout === "inline" ? {} : { ...(wrapperCol ?? form?.wrapperCol ?? {}) };
  if (form?.layout === "vertical") delete contentProps.offset;

  return (
    <Row
      className={clsx(
        "k-form-item",
        required && "k-form-item-required",
        !valid && "k-form-item-error"
      )}
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
