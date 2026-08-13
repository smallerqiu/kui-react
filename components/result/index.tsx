import clsx from "clsx";
import { CircleCheck, CircleX, Info, TriangleAlert } from "kui-icons";
import { isValidElement, type HTMLAttributes, type ReactNode } from "react";
import type { ResultStatus } from "../const/types";
import Icon, { type IconType } from "../icon";

export interface ResultProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  status?: ResultStatus;
  title?: ReactNode;
  subTitle?: ReactNode;
  icon?: IconType[] | ReactNode;
  extra?: ReactNode;
}

const statusIcons: Record<Exclude<ResultStatus, "403" | "404" | "500">, IconType[]> = {
  success: CircleCheck,
  error: CircleX,
  info: Info,
  warning: TriangleAlert,
};

export default function Result({
  status = "info",
  title,
  subTitle,
  icon,
  extra,
  children,
  className,
  ...rest
}: ResultProps) {
  const isHttpStatus = status === "403" || status === "404" || status === "500";
  const iconNode =
    icon == null ? (
      isHttpStatus ? (
        <span className="k-result-code">{status}</span>
      ) : (
        <Icon type={statusIcons[status]} />
      )
    ) : Array.isArray(icon) ? (
      <Icon type={icon as IconType[]} />
    ) : isValidElement(icon) || typeof icon !== "object" ? (
      icon
    ) : null;

  return (
    <div {...rest} className={clsx("k-result", `k-result-${status}`, className)} role="status">
      <div className="k-result-icon" aria-hidden="true">{iconNode}</div>
      {title != null && <div className="k-result-title">{title}</div>}
      {subTitle != null && <div className="k-result-subtitle">{subTitle}</div>}
      {children != null && <div className="k-result-content">{children}</div>}
      {extra != null && <div className="k-result-extra">{extra}</div>}
    </div>
  );
}

export type { ResultStatus } from "../const/types";
