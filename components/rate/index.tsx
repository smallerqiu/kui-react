import clsx from "clsx";
import React, { useState } from "react";
import type { SizeType } from "../const/types";
import type { IconType } from "../icon";
import Star from "./star";

export interface RateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: number;
  defaultValue?: number;
  allowClear?: boolean;
  allowHalf?: boolean;
  color?: string;
  size?: number | SizeType;
  showScore?: boolean;
  tooltips?: string[];
  disabled?: boolean;
  count?: number;
  character?: string | ((index: number) => React.ReactNode);
  icon?: IconType[] | ((index: number) => IconType[]);
  symbolReverseFill?: boolean;
  strokeWidth?: number;
  onChange?: (value: number) => void;
}

const Rate: React.FC<RateProps> = ({
  value,
  defaultValue = 0,
  allowClear = true,
  allowHalf = false,
  color,
  size,
  showScore = false,
  tooltips = [],
  disabled = false,
  count = 5,
  character,
  icon,
  symbolReverseFill = false,
  strokeWidth = 1,
  onChange,
  className = "",
  ...rest
}) => {
  const [innerValue, setInnerValue] = useState(defaultValue);
  const [tempValue, setTempValue] = useState<number | null>(null);
  const [cleared, setCleared] = useState(false);
  const currentValue = value ?? innerValue;

  const update = (t: "C" | "M", index: number, percent: number) => {
    if (t === "M") {
      if (cleared) return;
      if (allowHalf) {
        setTempValue(index - (percent < 0.5 ? 0.5 : 0));
      } else {
        setTempValue(index);
      }
    } else {
      let v = index - (allowHalf ? (percent < 0.5 ? 0.5 : 0) : 0);
      v = parseFloat(v.toFixed(2));

      const nextValue = v === currentValue && allowClear ? 0 : v;
      if (value === undefined) setInnerValue(nextValue);

      if (nextValue === 0) {
        setCleared(true);
        setTempValue(null);
      } else {
        setCleared(false);
      }
      onChange?.(nextValue);
    }
  };

  const mouseLeave = () => {
    setTempValue(null);
    setCleared(false);
  };

  const tpValue = tempValue !== null ? tempValue : currentValue;

  // Normalize count
  let actualCount = count;
  if (isNaN(Number(count)) || count <= 0) actualCount = 5;
  if (actualCount > 15) actualCount = 15;

  // Resolve numeric size
  let numSize: number | undefined;
  if (typeof size === "string") {
    const sizeMap: Record<string, number> = { small: 20, medium: 24, large: 32, default: 24 };
    numSize = sizeMap[size] ?? 24;
  } else {
    numSize = size;
  }

  const stars = [];
  for (let i = 1; i <= actualCount; i++) {
    const mod = i - tpValue;
    const starPercent = (1 - (i - tpValue)) * 100;
    stars.push(
      <Star
        key={i}
        allowHalf={allowHalf}
        full={tpValue >= i}
        half={mod > 0 && mod < 1}
        icon={icon}
        character={character}
        size={numSize}
        disabled={disabled}
        percent={starPercent < 100 ? starPercent : undefined}
        tooltips={tooltips[i - 1]}
        index={i}
        symbolReverseFill={symbolReverseFill}
        strokeWidth={strokeWidth}
        onUpdate={update}
      />
    );
  }

  const containerStyle: React.CSSProperties = {
    fontSize: numSize ? `${numSize}px` : undefined,
    color: color || undefined,
  };

  return (
    <div
      className={clsx("k-rate", { "k-rate-disabled": disabled }, className)}
      style={containerStyle}
      onMouseLeave={mouseLeave}
      {...rest}
    >
      {stars}
      {showScore ? <span className="k-rate-score">{currentValue}</span> : null}
    </div>
  );
};

export default Rate;
