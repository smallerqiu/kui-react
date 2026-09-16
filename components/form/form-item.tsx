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
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ConfigContext } from "../config/config-context";
import Transition from "../base/transition";
import zhCN from "../locale/zh-CN";
import { Col, Row } from "../row-col";
import type { FormItemHandle } from "./form";
import { FormContext } from "./form-context";
import {
  FormFieldProvider,
  isFormFieldComponent,
  type FormFieldContextValue,
} from "./field-context";
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
const NO_VALUE_OVERRIDE = Symbol("no-value-override");
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

const isFormControlElement = (child: ReactNode) =>
  isValidElement(child) && isFormFieldComponent(child.type);

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
  const fieldValue = prop ? form?.getValue(prop) : undefined;
  const previousFieldValueRef = useRef(fieldValue);

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
        if (rule.validator.length >= 3) {
          return new Promise<RuleResult>((resolve) => {
            let settled = false;
            const done = (error?: Error) => {
              if (settled) return;
              settled = true;
              resolve(error ? { ok: false, message: error.message || errorMessage } : PASS);
            };
            try {
              const returned = rule.validator?.(rule, value, done);
              if (isPromiseLike(returned)) {
                Promise.resolve(returned).then(() => done(), (error: unknown) => {
                  done(error instanceof Error ? error : new Error(String(error)));
                });
              }
            } catch (error) {
              done(error instanceof Error ? error : new Error(String(error)));
            }
          });
        }
        const returned = rule.validator(rule, value, () => undefined);
        if (isPromiseLike(returned)) {
          return Promise.resolve(returned).then(
            (resolved) => {
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
        return PASS;
      }

      return passed ? PASS : { ok: false, message: errorMessage };
    },
    [label, messages, prop],
  );

  const validate = useCallback(
    async (
      ruleInput?: FormRule | FormRule[],
      trigger?: FormValidateTrigger,
      valueOverride: unknown = NO_VALUE_OVERRIDE,
    ): Promise<boolean> => {
      const list = ruleInput ? (Array.isArray(ruleInput) ? ruleInput : [ruleInput]) : [];
      // 指定触发时机时只校验匹配的规则；手动调用与提交校验不区分时机，全部校验
      const target = trigger ? list.filter((rule) => matchesTrigger(rule, trigger)) : list;
      if (target.length === 0) return true;
      const currentVersion = (validationVersions.get(validationKey) ?? 0) + 1;
      validationVersions.set(validationKey, currentVersion);
      const value =
        valueOverride !== NO_VALUE_OVERRIDE
          ? valueOverride
          : prop
            ? form?.getValue(prop)
            : undefined;
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
        }
        return true;
      };
      for (let index = 0; index < sorted.length; index++) {
        const result = await runRule(sorted[index], value);
        if (!result.ok) return applyFailure(result);
      }
      return applySuccess();
    },
    [form, prop, runRule, validationKey],
  );
  const validateRef = useRef(validate);
  const rulesRef = useRef(rules);
  useEffect(() => {
    validateRef.current = validate;
    rulesRef.current = rules;
  }, [rules, validate]);

  const handle = useMemo<FormItemHandle | null>(
    () =>
      prop
        ? {
            prop,
            get rules() {
              return rulesRef.current;
            },
            validate: (...args) => validateRef.current(...args),
            reset: (nextValue) => {
              previousFieldValueRef.current = nextValue;
              setValid(true);
            },
          }
        : null,
    [prop],
  );
  const register = form?.register;
  const unregister = form?.unregister;
  useEffect(() => {
    if (!handle || !register || !unregister) return;
    register(handle);
    return () => unregister(handle.prop, handle);
  }, [handle, register, unregister]);

  const effectiveRules = useMemo(
    () => rules ?? (prop ? form?.rules?.[prop] : undefined) ?? [],
    [form?.rules, prop, rules],
  );
  useEffect(() => {
    if (!prop || Object.is(previousFieldValueRef.current, fieldValue)) return;
    previousFieldValueRef.current = fieldValue;
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) void validate(effectiveRules, "change", fieldValue);
    });
    return () => {
      cancelled = true;
    };
  }, [effectiveRules, fieldValue, prop, validate]);
  const required = (Array.isArray(effectiveRules) ? effectiveRules : [effectiveRules]).some(
    (rule) => rule.required,
  );
  const id = form?.name && prop ? `${form.name}_${prop}` : `${generatedId}_${prop ?? "field"}`;
  const errorId = `${id}_error`;
  const labelId = `${id}_label`;
  const describedBy = !valid && prop ? errorId : undefined;
  const fieldContext: FormFieldContextValue = {
    id,
    labelId,
    errorId,
    prop,
    value: fieldValue,
    size: form?.size,
    shape: form?.shape,
    theme: form?.theme,
    disabled: !!form?.disabled,
    readOnly: !!form?.readOnly,
    invalid: !valid,
    required,
    describedBy,
    update: (nextValue) => {
      if (!prop) return;
      previousFieldValueRef.current = nextValue;
      form?.setValue(prop, nextValue);
      void validate(effectiveRules, "change", nextValue);
    },
    blur: () => void validate(effectiveRules, "blur"),
  };
  const childArray = Children.toArray(children);
  const controlIndex = childArray.findIndex(isFormControlElement);
  const childNodes: ReactNode[] = [];
  for (let index = 0; index < childArray.length; index++) {
    const child = childArray[index];
    if (!isValidElement<Record<string, unknown>>(child)) {
      childNodes.push(child);
      continue;
    }
    const nativeControl =
      typeof child.type === "string" && ["input", "select", "textarea"].includes(child.type);
    if (nativeControl) {
      type NativeControlProps = {
        id?: string;
        type?: string;
        value?: unknown;
        checked?: boolean;
        onChange?: (...args: unknown[]) => void;
        onBlur?: (...args: unknown[]) => void;
      };
      const nativeProps = child.props as NativeControlProps;
      const originalBlur = nativeProps.onBlur;
      const nativeBoolean =
        child.type === "input" && ["checkbox", "radio"].includes(String(nativeProps.type));
      const fieldValue = prop ? form?.getValue(prop) : undefined;
      childNodes.push(
        cloneElement(child, {
          id: nativeProps.id ?? id,
          "aria-describedby": describedBy,
          "aria-invalid": !valid || undefined,
          "aria-required": required || undefined,
          value: prop && !nativeBoolean ? (fieldValue as never) : nativeProps.value,
          checked: prop && nativeBoolean ? Boolean(fieldValue) : nativeProps.checked,
          onChange: prop
            ? (...args: unknown[]) => {
                const event = args[0] as
                  { target?: { value?: unknown; checked?: boolean } } | undefined;
                const nextValue = nativeBoolean ? event?.target?.checked : event?.target?.value;
                form?.setValue(prop, nextValue);
                nativeProps.onChange?.(args[0]);
                validate(effectiveRules, "change", nextValue);
              }
            : nativeProps.onChange,
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
    childNodes.push(
      <FormFieldProvider key={child.key ?? index} value={fieldContext}>
        {child}
      </FormFieldProvider>,
    );
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
    >
      {label != null && (
        <Col className="k-form-item-label" {...labelProps}>
          <label id={labelId} htmlFor={id}>
            <span className="k-form-item-label-main">
              {required ? (
                <span className="k-form-item-required-mark" aria-hidden="true">
                  *
                </span>
              ) : null}
              <span className="k-form-item-label-text">{label}</span>
            </span>
            {colon ?? form?.colon ?? true ? (
              <span className="k-form-item-colon" aria-hidden="true">
                :
              </span>
            ) : null}
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
