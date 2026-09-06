import clsx from "clsx";
import { ArrowUp } from "kui-icons";
import {
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type MouseEvent,
} from "react";
import Transition from "../base/transition";
import Teleport from "../base/teleport";
import Icon from "../icon";

const defaultTarget = () => (typeof document === "undefined" ? null : document.body);

export interface BackTopProps extends Omit<HTMLAttributes<HTMLDivElement>, "onClick"> {
  height?: number;
  right?: CSSProperties["right"];
  bottom?: CSSProperties["bottom"];
  behavior?: ScrollBehavior;
  target?: () => HTMLElement | null;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
  onVisibleChange?: (visible: boolean) => void;
}

export default function BackTop({
  height = 100,
  right,
  bottom,
  behavior = "smooth",
  target = defaultTarget,
  onClick,
  onVisibleChange,
  onKeyDown,
  children,
  className,
  style,
  role = "button",
  tabIndex = 0,
  "aria-label": ariaLabel = "Back to top",
  ...rest
}: BackTopProps) {
  const [visible, setVisible] = useState(false);
  const visibleRef = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const emitVisibleChange = useEffectEvent((next: boolean) => onVisibleChange?.(next));

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
          : eventTarget.scrollTop;
      const next = scrollTop >= height;
      if (visibleRef.current !== next) {
        visibleRef.current = next;
        setVisible(next);
        emitVisibleChange(next);
      }
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
    )
      window.scrollTo({ top: 0, behavior });
    else scrollTarget.scrollTo({ top: 0, behavior });
  };

  const rootStyle: CSSProperties = { ...style, bottom, right };
  return (
    <Teleport to="body">
      <Transition show={visible} name="k-back-top-fade" nodeRef={rootRef} appear timeout={400}>
        <div
          {...rest}
          ref={rootRef}
          className={clsx("k-back-top", className)}
          style={rootStyle}
          role={role}
          tabIndex={tabIndex}
          aria-label={ariaLabel}
          onClick={handleClick}
          onKeyDown={(event) => {
            onKeyDown?.(event);
            if (!event.defaultPrevented && (event.key === "Enter" || event.key === " ")) {
              event.preventDefault();
              event.currentTarget.click();
            }
          }}
        >
          {children ?? (
            <div className="k-back-top-content">
              <Icon type={ArrowUp} />
            </div>
          )}
        </div>
      </Transition>
    </Teleport>
  );
}
