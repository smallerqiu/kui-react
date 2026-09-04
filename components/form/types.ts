export interface ColProps {
  span?: number;
  offset?: number;
}

/** 校验触发时机，与 kui-vue `form/types.ts:7` 保持一致 */
export type FormValidateTrigger = "change" | "blur";

export interface FormRule {
  required?: boolean;
  message?: string;
  /** 支持 callback 与返回 Promise 两种写法，与 kui-vue 一致 */
  validator?: (
    rule: FormRule,
    value: unknown,
    callback: (error?: Error) => void,
  ) => void | Promise<unknown>;
  pattern?: RegExp;
  type?: "mobile" | "mail" | "number";
  min?: number;
  max?: number;
  /** 该规则在何时触发校验，未设置时默认在 `change` 时校验 */
  trigger?: FormValidateTrigger | FormValidateTrigger[];
  [key: string]: unknown;
}
