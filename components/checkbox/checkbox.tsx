import { useValue } from "../utils/use-value";
import { resolvePaintedTheme, useFormAppearance } from "../config/use-config-appearance";
import clsx from "clsx";
import { createFormFieldComponent } from "../form/field-context";
import { Check } from "kui-icons";
import React, { useContext, useLayoutEffect, useRef } from "react";
import type { SizeType, MarkThemeType, ValueType } from "../const/types";
import Icon from "../icon";
import { getValueWithType } from "../utils/checked";
import { CheckboxGroupContext } from "./checkbox-group-context";

export interface ChangeEvent {
  value?: unknown;
  label?: React.ReactNode;
  checked: boolean;
}

export interface CheckboxProps extends Omit<
  React.HTMLAttributes<HTMLLabelElement>,
  "onChange" | "defaultValue" | "defaultChecked"
> {
  checked?: boolean;
  valueType?: ValueType;
  value?: unknown;
  label?: React.ReactNode;
  theme?: MarkThemeType;
  disabled?: boolean;
  readOnly?: boolean;
  indeterminate?: boolean;
  size?: SizeType;
  onChange?: (e: ChangeEvent) => void;
  children?: React.ReactNode;
}

// The two looks a check box has: a shallow filled square and a bordered one. `fill` is also what the
// component reaches when nothing is written, so an unsupported value resolves here rather than
// shipping `k-checkbox-<tier>`, a class no LESS rule can answer. The four tiers left out — `plain` (a
// box with no edge is not a check box), `solid` / `dashed` (containers and drop zones) and
// `underlined` (only means something on a field you type into) — land on `fill` too, the same ruling
// `Tag` follows with five tiers instead of two.
const PAINTED_THEMES = ["fill", "outline"] as const;

const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  valueType = "boolean",
  value,
  label,
  theme: themeProp,
  disabled = false,
  readOnly = false,
  indeterminate = false,
  size: sizeProp,
  onChange,
  children,
  className = "",
  id,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  "aria-describedby": ariaDescribedby,
  "aria-invalid": ariaInvalid,
  "aria-required": ariaRequired,
  onClick,
  ...rest
}) => {
  const inheritedAppearance = useFormAppearance();
  const size = sizeProp ?? inheritedAppearance.size;
  const group = useContext(CheckboxGroupContext);
  const inputRef = useRef<HTMLInputElement>(null);

  const isGroup = !!group;
  const groupChecked = isGroup && group.value ? group.value.indexOf(value) > -1 : false;

  const [localChecked, setLocalChecked] = useValue(checked, (next) => next ?? false);
  const isChecked = isGroup ? groupChecked : localChecked;
  const currentDisabled = disabled || (isGroup && group.disabled);
  const currentReadOnly = readOnly || Boolean(isGroup && group.readOnly);
  // Guarded after every inheritance step, so a group or a `ConfigProvider` that hands down
  // `solid` lands on `fill` exactly like the same value written on this check box.
  const currentTheme =
    resolvePaintedTheme(themeProp ?? group?.theme ?? inheritedAppearance.theme, PAINTED_THEMES) ??
    "fill";
  const currentSize = sizeProp ?? group?.size ?? size;

  const emitValue = (newChecked: boolean) => {
    if (!isGroup) {
      setLocalChecked(newChecked);
    }
    const labelVal =
      label ??
      children ??
      (typeof value === "string" || typeof value === "number" ? value : undefined);
    const eventObj: ChangeEvent = {
      checked: newChecked,
      value: isGroup ? value : getValueWithType(newChecked, valueType),
      label: labelVal,
    };
    onChange?.(eventObj);
    group?.onChange?.(eventObj);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (currentDisabled || currentReadOnly) return;
    emitValue(e.target.checked);
  };

  useLayoutEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  });

  const rootClasses = clsx(
    "k-checkbox",
    {
      // Always exactly one tier: `currentTheme` resolves to a painted value or to `fill`.
      [`k-checkbox-${currentTheme}`]: true,
      "k-checkbox-disabled": currentDisabled,
      "k-checkbox-readonly": currentReadOnly,
      "k-checkbox-checked": isChecked && !indeterminate,
      "k-checkbox-indeterminate": indeterminate,
      "k-checkbox-sm": currentSize === "small",
      "k-checkbox-lg": currentSize === "large",
    },
    className,
  );

  const innerNode = isChecked && !indeterminate ? <Icon type={Check} /> : null;
  const labelNode = label ?? children;

  return (
    <label
      className={rootClasses}
      aria-readonly={currentReadOnly || undefined}
      {...rest}
      onClick={(event) => {
        if (currentDisabled) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        onClick?.(event);
      }}
    >
      <span className="k-checkbox-symbol">
        <input
          id={id}
          type="checkbox"
          ref={inputRef}
          className="k-checkbox-input"
          disabled={currentDisabled}
          readOnly={currentReadOnly}
          aria-checked={indeterminate ? "mixed" : isChecked}
          aria-readonly={currentReadOnly || undefined}
          // 无文本的勾选框（比如表格行首列、表头全选）只能靠 aria-label 拿到可访问名，
          // 和 aria-labelledby 一样必须落在 input 上：留在 label 上辅助技术读不到控件名字。
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          aria-describedby={ariaDescribedby}
          aria-invalid={ariaInvalid}
          aria-required={ariaRequired}
          onClick={(event) => {
            if (currentReadOnly) event.preventDefault();
          }}
          checked={!!isChecked}
          onChange={handleInputChange}
        />
        {innerNode}
      </span>
      {labelNode ? <span className="k-checkbox-label">{labelNode}</span> : null}
    </label>
  );
};

export default createFormFieldComponent(Checkbox, {
  valueProp: "checked",
  getFieldValue: (value) => value === true || value === 1 || value === "1",
  getChangeValue: (event) => (event as ChangeEvent).checked,
});
