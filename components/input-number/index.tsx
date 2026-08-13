import Big from "big.js";
import { ChevronDown, ChevronUp } from "kui-icons";
import React, { useContext, useEffect, useRef, useState } from "react";
import { SizeContext } from "../config/size-context";
import type { ShapeType, SizeType, ThemeType } from "../const/types";
import Icon, { type IconType } from "../icon";
import Input from "../input/input";
import { isValidBig, normalize } from "../utils/number";

export interface InputNumberProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange" | "defaultValue"
> {
  value?: number | string;
  defaultValue?: number | string;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  formatter?: (value: string | number) => string;
  parser?: (value: string) => string | number;
  disabled?: boolean;
  readOnly?: boolean;
  controls?: boolean;
  suffix?: string;
  prefix?: string;
  theme?: ThemeType;
  shape?: ShapeType;
  icon?: IconType[];
  size?: SizeType;
  placeholder?: string;
  onChange?: (value: number | undefined) => void;
  suffixSlot?: React.ReactNode;
  prefixSlot?: React.ReactNode;
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
  suffix,
  prefix,
  theme = "fill",
  shape,
  icon,
  size,
  placeholder,
  onChange,
  suffixSlot,
  prefixSlot,
  ...rest
}) => {
  const parentSize = useContext(SizeContext);
  const [innerValue, setInnerValue] = useState(normalize(defaultValue, precision));
  const [userInput, setUserInput] = useState<string | null>(null);
  const prevValueRef = useRef(value);

  useEffect(() => {
    // 仅在外部 value 发生变化时才同步，避免依赖 innerValue 导致的无限循环
    if (value !== prevValueRef.current) {
      prevValueRef.current = value;
      setInnerValue(normalize(value, precision));
    }
  }, [value, precision]);

  const clamp = (val: string | number): string => {
    if (!isValidBig(val)) {
      return val === "" ? "" : innerValue;
    }
    try {
      let b = new Big(val);
      if (max !== Infinity && b.gt(max)) b = new Big(max);
      if (min !== -Infinity && b.lt(min)) b = new Big(min);
      return precision !== undefined ? b.toFixed(precision) : b.toFixed();
    } catch {
      return innerValue;
    }
  };

  const emitValue = (v: number | undefined) => {
    onChange?.(v);
  };

  const displayValue = (() => {
    if (userInput !== null) return userInput;
    if (innerValue === "") return "";
    return formatter ? formatter(innerValue) : innerValue;
  })();

  const triggerUpdate = (val: string | number) => {
    const parsed = parser ? parser(String(val)) : val;
    const clampedStr = clamp(String(parsed));
    setInnerValue(clampedStr);
    setUserInput(null);
    const output = clampedStr === "" ? undefined : Number(clampedStr);
    emitValue(output);
  };

  const handleInput = (val: string) => {
    setUserInput(val);
    const parsed = parser ? parser(val) : val;
    if (val === "") {
      setInnerValue("");
      emitValue(undefined);
      return;
    }
    if (isValidBig(parsed)) {
      const bigVal = new Big(parsed);
      const normalizedStr = bigVal.toFixed();
      setInnerValue(normalizedStr);
      emitValue(Number(normalizedStr));
      if (formatter) {
        const formatted = formatter(normalizedStr);
        // 与当前输入值 val 比较而非异步的 userInput 状态，避免过期闭包导致误判
        if (formatted !== val) setUserInput(formatted);
      }
    }
  };

  const handleBlur = () => {
    triggerUpdate(userInput !== null ? userInput : innerValue);
  };

  const stepAction = (type: "up" | "down") => {
    if (disabled || readOnly) return;
    const current = isValidBig(innerValue) ? innerValue : 0;
    const next = type === "up" ? new Big(current).plus(step) : new Big(current).minus(step);
    triggerUpdate(next.toFixed());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      stepAction("up");
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      stepAction("down");
    }
  };

  const controlsNode =
    controls && !readOnly && !disabled ? (
      <div className="k-input-number-controls">
        <span className="k-input-number-control" onClick={() => stepAction("up")}>
          <Icon type={ChevronUp} />
        </span>
        <span className="k-input-number-control" onClick={() => stepAction("down")}>
          <Icon type={ChevronDown} />
        </span>
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
      suffix={suffixSlot || suffix}
      prefix={prefixSlot || prefix}
      size={size || parentSize}
      icon={icon}
      shape={shape}
      theme={theme}
      inputType="input-number"
      onChange={handleInput}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      controls={controlsNode}
    />
  );
};

export default InputNumber;
