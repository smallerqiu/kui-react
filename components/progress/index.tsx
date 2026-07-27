import { Check, CircleCheck, CircleX, X } from "kui-icons";
import React from "react";
import type { SizeType } from "../const/types";
import Icon from "../icon";

export type ProgressStatus = "active" | "exception" | "success" | "normal";
export type ProgressStroke = "round" | "butt" | "square";
export type ProgressType = "line" | "circle" | "dashboard";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  percent?: number;
  strokeWidth?: number;
  color?: string;
  format?: (percent: number) => React.ReactNode;
  width?: number;
  strokeHeight?: number;
  gapDegree?: number;
  strokeLinecap?: ProgressStroke;
  size?: SizeType;
  status?: ProgressStatus;
  type?: ProgressType;
  showInfo?: boolean;
}

const Progress: React.FC<ProgressProps> = ({
  percent = 0,
  strokeWidth = 6,
  color,
  format,
  width,
  strokeHeight,
  gapDegree = 75,
  strokeLinecap = "round",
  size,
  status = "normal",
  type = "line",
  showInfo = true,
  children,
  className = "",
  style,
  ...rest
}) => {
  const currentPercent = percent;

  const renderTip = (currentStatus: ProgressStatus, currentType: ProgressType) => {
    if (!showInfo) return null;

    let text: React.ReactNode = `${currentPercent}%`;
    if (format) {
      text = format(currentPercent);
    } else {
      if (currentType === "line") {
        if (currentPercent === 100) {
          text = <Icon type={CircleCheck} />;
        }
        if (currentStatus === "exception") {
          text = <Icon type={CircleX} />;
        }
      } else if (currentType === "circle" || currentType === "dashboard") {
        if (children) {
          text = children;
        } else {
          if (currentPercent === 100) {
            text = <Icon type={Check} />;
          }
          if (currentStatus === "exception") {
            text = <Icon type={X} />;
          }
        }
      }
    }
    return <div className="k-progress-text">{text}</div>;
  };

  const renderCircle = (pct: number, strokeColor: string | undefined, dashboard: boolean) => {
    const radius = 50 - strokeWidth / 2;
    const beginX = 0;
    const beginY = radius;
    const endX = 0;
    const endY = 2 * radius;
    let gap = Math.max(0, gapDegree);
    gap = Math.min(259, gap);

    const d = `M 50,50 
             m ${beginX}, ${beginY} 
             a ${radius},${radius} 0 1 1 ${endX}, ${-endY} 
             a ${radius},${radius} 0 1 1 ${-endX},${endY}`;
    const len = Math.PI * 2 * radius;

    const bgStyle: React.CSSProperties = {
      strokeDasharray: `${(pct / 100) * (len - (dashboard ? gap : 0))}px ${len}px`,
      transition: `stroke-dasharray .3s ease 0s,opacity 0.3s ease 0s`,
      strokeDashoffset: dashboard ? -gap / 2 : 0,
      stroke: strokeColor,
      strokeLinecap: strokeLinecap,
      opacity: pct === 0 ? 0 : 1,
    };

    const ds: React.CSSProperties = {};
    if (dashboard) {
      ds.strokeDasharray = `${len - gap}px ${len}px`;
      ds.strokeDashoffset = -gap / 2;
      ds.strokeLinecap = strokeLinecap;
    }

    return (
      <svg viewBox={`0 0 ${100} ${100}`}>
        <path strokeWidth={strokeWidth} d={d} fill="none" style={ds} className="k-progress-inner" />
        <path
          strokeWidth={strokeWidth}
          d={d}
          fill="none"
          style={bgStyle}
          className="k-progress-bg"
        />
      </svg>
    );
  };

  const renderBar = () => {
    if (type === "line") {
      const bgStyle: React.CSSProperties = {
        width: `${currentPercent}%`,
        backgroundColor: color || undefined,
      };
      if (strokeHeight) {
        bgStyle.height = `${strokeHeight}px`;
      }
      return (
        <div className="k-progress-inner">
          <div className="k-progress-bg" style={bgStyle} />
        </div>
      );
    } else if (type === "circle") {
      return renderCircle(currentPercent, color, false);
    } else if (type === "dashboard") {
      return renderCircle(currentPercent, color, true);
    }
    return null;
  };

  let finalStatus = status;
  if (currentPercent === 100 && status !== "exception") {
    finalStatus = "success";
  }

  const classes = [
    "k-progress",
    `k-progress-${type}`,
    `k-progress-${finalStatus}`,
    type === "line" && size === "small" ? "k-progress-sm" : "",
    !showInfo ? "k-progress-hide-info" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const pgStyle: React.CSSProperties = { ...style };
  if (type !== "line" && width !== undefined && width > 10) {
    pgStyle.width = `${width}px`;
    pgStyle.height = `${width}px`;
  }

  return (
    <div className={classes} style={pgStyle} {...rest}>
      {renderBar()}
      {renderTip(finalStatus, type)}
    </div>
  );
};

export default Progress;
