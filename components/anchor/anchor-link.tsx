import clsx from "clsx";
import { useContext, useEffect, type AnchorHTMLAttributes, type ReactNode } from "react";
import { AnchorContext } from "./anchor";

export interface AnchorLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "title"> {
  href: string;
  title?: ReactNode;
}

export default function AnchorLink({
  href,
  title,
  className,
  children,
  onClick,
  ...rest
}: AnchorLinkProps) {
  const context = useContext(AnchorContext);
  const registerLink = context?.registerLink;
  const unregisterLink = context?.unregisterLink;
  useEffect(() => {
    registerLink?.(href);
    return () => unregisterLink?.(href);
  }, [href, registerLink, unregisterLink]);

  return (
    <div
      className={clsx("k-anchor-link", { "k-anchor-link-active": context?.activeLink === href })}
    >
      <a
        {...rest}
        href={href}
        className={clsx("k-anchor-link-title", className)}
        onClick={(event) => {
          onClick?.(event);
          if (event.defaultPrevented) return;
          event.preventDefault();
          context?.scrollTo(href);
        }}
      >
        {title}
      </a>
      {children}
    </div>
  );
}
