import clsx from "clsx";
import React from "react";
import Icon, { type IconType } from "../icon";

export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  bordered?: boolean;
  title?: React.ReactNode;
  icon?: IconType[];
  extra?: React.ReactNode;
  children?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  bordered = false,
  title,
  icon,
  extra,
  children,
  className = "",
  ...rest
}) => {
  const iconNode = icon ? <Icon type={icon} className="k-card-title-icon" /> : null;
  const titleNode =
    typeof title === "string" ? <span className="k-card-title">{title}</span> : title;
  const extraNode = extra ? <div className="k-card-extra">{extra}</div> : null;

  const showHead = !!(titleNode || extraNode || iconNode);

  const classes = clsx("k-card", { "k-card-bordered": bordered }, className);

  return (
    <div className={classes} {...rest}>
      {showHead && (
        <div className="k-card-head">
          {iconNode}
          {titleNode}
          {extraNode}
        </div>
      )}
      {children ? <div className="k-card-body k-scroll">{children}</div> : null}
    </div>
  );
};

export default Card;
