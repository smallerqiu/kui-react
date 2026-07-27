import Big from "big.js";
import { ChevronDown, ChevronUp } from "kui-icons";
import React, { useState, useEffect, useRef, useContext } from "react";
import type { ShapeType, SizeType, ThemeType } from "../const/types";
import Icon, { type IconType } from "../icon";
import Input from "../input/input";
import { SizeContext } from "../config/size-context";
import { isValidBig, normalize } from "../utils/number";

export interface InputNumberProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: number | string;
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
  className = "",
  ...rest
}) => {
  const parentSize = useContext(SizeContext);
  const [innerValue, setInnerValue] = useState(normalize(value, precision));
  const [userInput, setUserInput] = useState<string | null>(null);

  useEffect(() => {
    const next = normalize(value, precision);
    if (next !== innerValue) {
      setInnerValue(next);
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
        if (formatted !== userInput) setUserInput(formatted);
      }
    }
  };

  const handleBlur = () => {
    triggerUpdate(userInput !== null ? userInput : innerValue);
  };

  const stepAction = (type: "up" | "down") => {
    if (disabled || readOnly) return;
    const current = isValidBig(innerValue) ? innerValue : 0;
    const next =
      type === "up" ? new Big(current).plus(step) : new Big(current).minus(step);
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
      onChange={handleInput}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      controls={controlsNode}
      suffixSlot={suffixSlot}
      prefixSlot={prefixSlot}
    />
  );
};

export default InputNumber;
