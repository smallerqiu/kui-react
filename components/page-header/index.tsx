import type { HTMLAttributes, ReactNode } from "react";

export interface PageHeaderProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  title?: ReactNode;
  description?: ReactNode;
  breadcrumb?: ReactNode;
  back?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
}

export default function PageHeader({
  title,
  description,
  breadcrumb,
  back,
  actions,
  children,
  className,
  ...rest
}: PageHeaderProps) {
  return (
    <header {...rest} className={className ? `k-page-header ${className}` : "k-page-header"}>
      <div className="k-page-header-main">
        {breadcrumb}
        <div className="k-page-header-heading">
          {back}
          {(title || description) && (
            <div className="k-page-header-copy">
              {title ? <div className="k-page-header-title">{title}</div> : null}
              {description ? <div className="k-page-header-description">{description}</div> : null}
            </div>
          )}
        </div>
        {children}
      </div>
      {actions ? <div className="k-page-header-actions">{actions}</div> : null}
    </header>
  );
}
