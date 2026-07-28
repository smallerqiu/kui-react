import clsx from "clsx";
import { ArrowUp } from "kui-icons";
import {
  useEffect,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type MouseEvent,
} from "react";
import Icon from "../icon";

export interface BackTopProps extends Omit<HTMLAttributes<HTMLDivElement>, "onClick"> {
  height?: number;
  right?: number;
  bottom?: number;
  target?: () => HTMLElement | null;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
}

export default function BackTop({
  height = 100,
  right,
  bottom,
  target = () => (typeof document === "undefined" ? null : document.body),
  onClick,
  children,
  className,
  style,
  ...rest
}: BackTopProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const scrollTarget = target();
    const eventTarget: HTMLElement | Window =
      !scrollTarget || scrollTarget === document.body || scrollTarget === document.documentElement
        ? window
        : scrollTarget;
    const update = () => {
      const scrollTop =
        eventTarget === window
          ? window.scrollY || document.documentElement.scrollTop || document.body.scrollTop
          : (eventTarget as HTMLElement).scrollTop;
      setVisible(scrollTop >= height);
    };
    eventTarget.addEventListener("scroll", update, { passive: true });
    update();
    return () => eventTarget.removeEventListener("scroll", update);
  }, [height, target]);

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    const scrollTarget = target();
    if (
      !scrollTarget ||
      scrollTarget === document.body ||
      scrollTarget === document.documentElement
    ) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      scrollTarget.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (!visible) return null;
  const rootStyle: CSSProperties = { ...style, bottom, right };
  return (
    <div
      {...rest}
      className={clsx("k-back-top", "k-back-top-fade-enter-active", className)}
      style={rootStyle}
      onClick={handleClick}
    >
      {children ?? (
        <div className="k-back-top-content">
          <Icon type={ArrowUp} />
        </div>
      )}
    </div>
  );
}
