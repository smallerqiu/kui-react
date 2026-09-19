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
  const hasTitle = title !== null && title !== undefined && title !== false;
  const hasDescription = description !== null && description !== undefined && description !== false;
  const hasBreadcrumb = breadcrumb !== null && breadcrumb !== undefined && breadcrumb !== false;
  const hasBack = back !== null && back !== undefined && back !== false;
  const hasContent = children !== null && children !== undefined && children !== false;
  const hasActions = actions !== null && actions !== undefined && actions !== false;

  return (
    <header {...rest} className={className ? `k-page-header ${className}` : "k-page-header"}>
      <div className="k-page-header-main">
        {hasBreadcrumb ? <div className="k-page-header-breadcrumb">{breadcrumb}</div> : null}
        {hasBack || hasTitle || hasDescription ? (
          <div className="k-page-header-heading">
            {back}
            {hasTitle || hasDescription ? (
              <div className="k-page-header-copy">
                {hasTitle ? <div className="k-page-header-title">{title}</div> : null}
                {hasDescription ? (
                  <div className="k-page-header-description">{description}</div>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}
        {hasContent ? <div className="k-page-header-content">{children}</div> : null}
      </div>
      {hasActions ? <div className="k-page-header-actions">{actions}</div> : null}
    </header>
  );
}
