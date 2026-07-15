import React, { createContext } from "react";

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  separator?: React.ReactNode;
  children?: React.ReactNode;
}

export const BreadcrumbContext = createContext<React.ReactNode>("/");

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  separator = "/",
  children,
  className = "",
  ...rest
}) => {
  const classes = ["k-breadcrumb", className].filter(Boolean).join(" ");

  return (
    <BreadcrumbContext.Provider value={separator}>
      <nav className={classes} {...rest}>
        <ol>{children}</ol>
      </nav>
    </BreadcrumbContext.Provider>
  );
};

export default Breadcrumb;
