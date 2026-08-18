import clsx from "clsx";
import React from "react";

export type StepStatus = "wait" | "process" | "finish" | "error";
export interface StepProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  status?: StepStatus;
  disabled?: boolean;
}
export interface StepsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  current?: number;
  direction?: "horizontal" | "vertical";
  status?: "process" | "error";
  items?: StepProps[];
  onChange?: (current: number) => void;
  children?: React.ReactNode;
}
export const Step: React.FC<StepProps> = () => null;
const Steps: React.FC<StepsProps> = ({
  current = 0,
  direction = "horizontal",
  status = "process",
  items,
  onChange,
  children,
  className,
  ...rest
}) => {
  const data =
    items ??
    React.Children.toArray(children).flatMap((child) =>
      React.isValidElement<StepProps>(child) ? [child.props] : []
    );
  return (
    <div {...rest} className={clsx("k-steps", `k-steps-${direction}`, className)}>
      {data.map((item, index) => {
        const state =
          item.status ?? (index < current ? "finish" : index === current ? status : "wait");
        return (
          <div
            className={clsx("k-step", `k-step-${state}`, {
              "k-step-clickable": !!onChange && !item.disabled,
            })}
            key={index}
            onClick={() => !item.disabled && onChange?.(index)}
          >
            <div className="k-step-main">
              <span className="k-step-dot">
                {item.icon ?? (state === "finish" ? "✓" : index + 1)}
              </span>
              <div className="k-step-content">
                <div className="k-step-title">{item.title}</div>
                {item.description && <div className="k-step-description">{item.description}</div>}
              </div>
            </div>
            <span className="k-step-line" />
          </div>
        );
      })}
    </div>
  );
};
export default Steps;
