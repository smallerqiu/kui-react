import Big from "big.js";
import { ChevronDown, ChevronUp } from "kui-icons";
import React, { useContext, useState } from "react";
import { SizeContext } from "../config/size-context";
import type { ShapeType, SizeType, ThemeType } from "../const/types";
import Icon, { type IconType } from "../icon";
import Input from "../input/input";
import { isValidBig, normalize } from "../utils/number";

export interface InputNumberProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange" | "defaultValue" | "prefix"
> {
  value?: number | string;
  defaultValue?: number | string;
  min?: number;
  max?: number;
  step?: number | string;
  precision?: number;
  formatter?: (value: string | number) => string;
  parser?: (value: string) => string | number;
  disabled?: boolean;
  readOnly?: boolean;
  controls?: boolean;
  /** 是否允许通过上下方向键调整数值 */
  keyboard?: boolean;
  suffix?: React.ReactNode;
  prefix?: React.ReactNode;
  theme?: ThemeType;
  shape?: ShapeType;
  icon?: IconType[];
  size?: SizeType;
  placeholder?: string;
  onChange?: (value: number | undefined) => void;
}

const InputNumber: React.FC<InputNumberProps> = ({
  value,
  defaultValue,
  min = -Infinity,
  max = Infinity,
  step = 1,
  precision,
  formatter,
  parser,
  disabled = false,
  readOnly = false,
  controls = true,
  keyboard = true,
  suffix,
  prefix,
  theme = "fill",
  shape,
  icon,
  size,
  placeholder,
  onChange,
  onBlur,
  onKeyDown,
  ...rest
}) => {
  const parentSize = useContext(SizeContext);
  const safePrecision = precision === undefined ? undefined : Math.max(0, Math.trunc(precision));
  const [innerValue, setInnerValue] = useState(normalize(defaultValue, safePrecision));
  const [userInput, setUserInput] = useState<string | null>(null);
  const controlled = value !== undefined;
  const currentValue = controlled ? normalize(value, safePrecision) : innerValue;

  const clamp = (val: string | number): string => {
    if (!isValidBig(val)) {
      return val === "" ? "" : currentValue;
    }
    try {
      let b = new Big(val);
      if (max !== Infinity && b.gt(max)) b = new Big(max);
      if (min !== -Infinity && b.lt(min)) b = new Big(min);
      return safePrecision !== undefined ? b.toFixed(safePrecision) : b.toFixed();
    } catch {
      return currentValue;
    }
  };

  const emitValue = (v: number | undefined) => {
    onChange?.(v);
  };

  const displayValue = (() => {
    if (userInput !== null) return userInput;
    if (currentValue === "") return "";
    return formatter ? formatter(currentValue) : currentValue;
  })();

  const triggerUpdate = (val: string | number) => {
    const parsed = parser ? parser(String(val)) : val;
    const clampedStr = clamp(String(parsed));
    if (!controlled) setInnerValue(clampedStr);
    setUserInput(null);
    const output = clampedStr === "" ? undefined : Number(clampedStr);
    emitValue(output);
  };

  const handleInput = (val: string) => {
    setUserInput(val);
    const parsed = parser ? parser(val) : val;
    if (val === "") {
      if (!controlled) {
        setInnerValue("");
      }
      emitValue(undefined);
      return;
    }
    if (isValidBig(parsed)) {
      const bigVal = new Big(parsed);
      const normalizedStr = bigVal.toFixed();
      if (!controlled) {
        setInnerValue(normalizedStr);
      }
      emitValue(Number(normalizedStr));
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    triggerUpdate(userInput !== null ? userInput : currentValue);
    onBlur?.(event);
  };

  const stepAction = (type: "up" | "down") => {
    if (disabled || readOnly) return;
    const current = isValidBig(currentValue) ? currentValue : 0;
    let safeStep = new Big(1);
    try {
      const candidate = new Big(step);
      if (candidate.gt(0)) safeStep = candidate;
    } catch {
      // Invalid steps fall back to 1.
    }
    const next = type === "up" ? new Big(current).plus(safeStep) : new Big(current).minus(safeStep);
    triggerUpdate(next.toFixed());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;
    if (!keyboard) return;
    if (e.key === "ArrowUp") {
      e.preventDefault();
      stepAction("up");
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      stepAction("down");
    }
  };

  const canStepUp = max === Infinity || !isValidBig(currentValue) || new Big(currentValue).lt(max);
  const canStepDown =
    min === -Infinity || !isValidBig(currentValue) || new Big(currentValue).gt(min);
  const controlsNode =
    controls && !readOnly && !disabled ? (
      <div className="k-input-number-controls">
        <button
          type="button"
          className="k-input-number-control"
          disabled={!canStepUp}
          aria-label="Increase value"
          onClick={() => stepAction("up")}
        >
          <Icon type={ChevronUp} />
        </button>
        <button
          type="button"
          className="k-input-number-control"
          disabled={!canStepDown}
          aria-label="Decrease value"
          onClick={() => stepAction("down")}
        >
          <Icon type={ChevronDown} />
        </button>
      </div>
    ) : undefined;

  return (
    <Input
      {...(rest as React.ComponentProps<typeof Input>)}
      value={displayValue}
      disabled={disabled}
      readOnly={readOnly}
      clearable={false}
      placeholder={placeholder}
      suffix={suffix}
      prefix={prefix}
      size={size || parentSize}
      icon={icon}
      shape={shape}
      theme={theme}
      inputType="input-number"
      role="spinbutton"
      inputMode="decimal"
      aria-valuemin={min === -Infinity ? undefined : min}
      aria-valuemax={max === Infinity ? undefined : max}
      aria-valuenow={isValidBig(currentValue) ? Number(currentValue) : undefined}
      aria-valuetext={formatter && currentValue ? String(displayValue) : undefined}
      onChange={handleInput}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      controls={controlsNode}
    />
  );
};

export default InputNumber;
