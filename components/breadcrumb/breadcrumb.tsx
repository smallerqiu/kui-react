import clsx from "clsx";
import React from "react";
import { BreadcrumbContext } from "./breadcrumb-context";

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  separator?: React.ReactNode;
  children?: React.ReactNode;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  separator = "/",
  children,
  className = "",
  ...rest
}) => {
  const classes = clsx("k-breadcrumb", className);

  return (
    <BreadcrumbContext.Provider value={separator}>
      <nav className={classes} {...rest}>
        <ol>{children}</ol>
      </nav>
    </BreadcrumbContext.Provider>
  );
};

export default Breadcrumb;
