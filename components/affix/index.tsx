import clsx from "clsx";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";

export interface AffixProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  children?: ReactNode;
  offsetTop?: number;
  offsetBottom?: number;
  target?: () => HTMLElement | Window | null;
  onChange?: (affixed: boolean) => void;
}

export default function Affix({
  children,
  offsetTop = 0,
  offsetBottom,
  target = () => (typeof window === "undefined" ? null : window),
  onChange,
  className,
  style,
  ...rest
}: AffixProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const fixedRef = useRef(false);
  const [fixed, setFixed] = useState(false);
  const [affixStyle, setAffixStyle] = useState<CSSProperties>({});
  const [placeholderStyle, setPlaceholderStyle] = useState<CSSProperties>({});

  const updatePosition = useCallback(() => {
    const element = wrapperRef.current;
    const scrollTarget = target();
    if (!element || !scrollTarget || typeof window === "undefined") return;

    const rect = element.getBoundingClientRect();
    const isWindow = scrollTarget === window;
    const targetRect = isWindow
      ? { top: 0, bottom: window.innerHeight }
      : (scrollTarget as HTMLElement).getBoundingClientRect();

    let nextFixed: boolean;
    let nextStyle: CSSProperties = {};
    if (offsetBottom !== undefined) {
      nextFixed = targetRect.bottom - rect.bottom - offsetBottom <= 0;
      if (nextFixed) {
        nextStyle = {
          position: "fixed",
          bottom: window.innerHeight - targetRect.bottom + offsetBottom,
          width: rect.width,
        };
      }
    } else {
      nextFixed = rect.top - targetRect.top - offsetTop <= 0;
      if (nextFixed) {
        nextStyle = { position: "fixed", top: targetRect.top + offsetTop, width: rect.width };
      }
    }

    setAffixStyle(nextStyle);
    setPlaceholderStyle(nextFixed ? { height: rect.height, width: rect.width } : {});
    if (fixedRef.current !== nextFixed) {
      fixedRef.current = nextFixed;
      setFixed(nextFixed);
      onChange?.(nextFixed);
    }
  }, [offsetBottom, offsetTop, onChange, target]);

  useEffect(() => {
    const scrollTarget = target();
    if (!scrollTarget || typeof window === "undefined") return;
    scrollTarget.addEventListener("scroll", updatePosition, { passive: true });
    window.addEventListener("resize", updatePosition);
    const observer =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(updatePosition);
    if (scrollTarget !== window) observer?.observe(scrollTarget as HTMLElement);
    observer?.observe(wrapperRef.current!);
    updatePosition();
    return () => {
      scrollTarget.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
      observer?.disconnect();
    };
  }, [target, updatePosition]);

  return (
    <div {...rest} ref={wrapperRef} style={{ ...style, ...placeholderStyle }}>
      <div className={clsx("k-affix", { "k-affix-fixed": fixed }, className)} style={affixStyle}>
        {children}
      </div>
    </div>
  );
}
