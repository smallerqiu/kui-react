import clsx from "clsx";
import { Star as StarIcon } from "kui-icons";
import React from "react";
import Icon, { type IconType } from "../icon";
import Tooltip from "../tooltip";

export interface StarProps {
  character?: string | ((index: number) => React.ReactNode);
  tooltips?: string;
  percent?: number;
  full?: boolean;
  half?: boolean;
  allowHalf?: boolean;
  disabled?: boolean;
  icon?: IconType[] | ((index: number) => IconType[]);
  size?: number | string;
  index: number;
  symbolReverseFill?: boolean;
  strokeWidth?: number;
  onUpdate?: (t: "C" | "M", index: number, percent: number) => void;
}

const Star: React.FC<StarProps> = ({
  character,
  tooltips,
  percent,
  full = false,
  half = false,
  disabled = false,
  icon,
  size,
  index,
  symbolReverseFill = false,
  strokeWidth = 1,
  onUpdate,
}) => {
  const handleEvent = (e: React.MouseEvent<HTMLSpanElement>, t: "C" | "M") => {
    if (disabled) return;
    const target = e.currentTarget as HTMLElement;
    const { clientX } = e;
    let p = 0;
    if (target) {
      const { left, width } = target.getBoundingClientRect();
      p = (clientX - left) / width;
    }
    onUpdate?.(t, index, p);
  };

  const iconType = typeof icon === "function" ? icon(index) : icon;
  const reverse = symbolReverseFill || !iconType;
  const characterNode = (typeof character === "function" ? character(index) : character) || (
    <Icon type={iconType || StarIcon} size={size} reverseFill={reverse} strokeWidth={strokeWidth} />
  );

  const classes = clsx("k-star", { "k-star-full": full, "k-star-half": half });

  const frontStyle: React.CSSProperties = {
    width: disabled && percent !== undefined ? `${percent}%` : undefined,
  };

  const node = (
    <span
      className={classes}
      onClick={(e) => handleEvent(e, "C")}
      onMouseMove={(e) => handleEvent(e, "M")}
    >
      <span className="k-star-front" style={frontStyle}>
        {characterNode}
      </span>
      <span className="k-star-back">{characterNode}</span>
    </span>
  );

  return tooltips ? <Tooltip title={tooltips}>{node}</Tooltip> : node;
};

export default Star;
