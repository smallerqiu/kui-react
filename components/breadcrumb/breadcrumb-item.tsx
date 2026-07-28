import clsx from "clsx";
import React, { useContext } from "react";
import Icon, { type IconType } from "../icon";
import { BreadcrumbContext } from "./breadcrumb";

export interface BreadcrumbItemProps extends React.HTMLAttributes<HTMLLIElement> {
  href?: string;
  icon?: IconType[] | React.ReactNode;
  children?: React.ReactNode;
}

const BreadcrumbItem: React.FC<BreadcrumbItemProps> = ({
  href,
  icon,
  children,
  className = "",
  onClick,
  ...rest
}) => {
  const separator = useContext(BreadcrumbContext);

  const renderIcon = () => {
    if (!icon) return null;
    if (React.isValidElement(icon) || typeof icon === "string") {
      return icon;
    }
    if (Array.isArray(icon)) {
      return <Icon type={icon as IconType[]} />;
    }
    return null;
  };

  const classes = clsx("k-breadcrumb-item", className);

  const content = (
    <>
      {renderIcon()}
      {children}
    </>
  );

  return (
    <li className={classes} onClick={onClick} {...rest}>
      {href ? (
        <a className="k-breadcrumb-link" href={href}>
          {content}
        </a>
      ) : (
        <span className="k-breadcrumb-link">{content}</span>
      )}
      <span className="k-breadcrumb-separator">{separator}</span>
    </li>
  );
};

export default BreadcrumbItem;
