import clsx from "clsx";
import React from "react";
import { Avatar } from "../avatar";
import Icon, { type IconType } from "../icon";

export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  bordered?: boolean;
  title?: React.ReactNode;
  icon?: IconType[];
  extra?: React.ReactNode;
  cover?: string | React.ReactNode;
  children?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  bordered = false,
  title,
  icon,
  extra,
  cover,
  children,
  className = "",
  ...rest
}) => {
  const iconNode = icon ? <Icon type={icon} className="k-card-title-icon" /> : null;
  const titleNode =
    typeof title === "string" ? <span className="k-card-title">{title}</span> : title;
  const extraNode = extra ? <div className="k-card-extra">{extra}</div> : null;
  const coverNode =
    typeof cover === "string" ? <img src={cover} alt="" /> : cover;

  const showHead = !!(titleNode || extraNode || iconNode);

  const classes = clsx(
    "k-card",
    { "k-card-bordered": bordered, "k-card-has-cover": !!coverNode },
    className
  );

  return (
    <div className={classes} {...rest}>
      {coverNode && <div className="k-card-cover">{coverNode}</div>}
      {!coverNode && showHead && (
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

export interface CardMetaProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  avatar?: string | React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
}

export function CardMeta({ avatar, title, description, className, ...rest }: CardMetaProps) {
  const avatarNode = typeof avatar === "string" ? <Avatar src={avatar} /> : avatar;
  return (
    <div {...rest} className={clsx("k-card-meta", className)}>
      {avatarNode && <div className="k-card-meta-avatar">{avatarNode}</div>}
      <div className="k-card-meta-content">
        {title != null && <div className="k-card-meta-title">{title}</div>}
        {description != null && <div className="k-card-meta-description">{description}</div>}
      </div>
    </div>
  );
}

export default Card;
