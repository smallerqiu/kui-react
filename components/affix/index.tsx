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

const defaultTarget = () => (typeof window === "undefined" ? null : window);

function isSameStyle(current: CSSProperties, next: CSSProperties) {
  const currentStyle = current as Record<string, unknown>;
  const nextStyle = next as Record<string, unknown>;
  const currentKeys = Object.keys(currentStyle);
  const nextKeys = Object.keys(nextStyle);
  return (
    currentKeys.length === nextKeys.length &&
    currentKeys.every((key) => currentStyle[key] === nextStyle[key])
  );
}

export default function Affix({
  children,
  offsetTop = 0,
  offsetBottom,
  target = defaultTarget,
  onChange,
  className,
  style,
  ...rest
}: AffixProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLElement | Window | null>(null);
  const frameRef = useRef<number | null>(null);
  const fixedRef = useRef(false);
  const onChangeRef = useRef(onChange);
  const [fixed, setFixed] = useState(false);
  const [affixStyle, setAffixStyle] = useState<CSSProperties>({});
  const [placeholderStyle, setPlaceholderStyle] = useState<CSSProperties>({});

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const updatePosition = useCallback(() => {
    frameRef.current = null;
    const wrapper = wrapperRef.current;
    const inner = innerRef.current;
    const scrollTarget = targetRef.current;
    if (!wrapper || !inner || !scrollTarget || typeof window === "undefined") return;

    const rect = wrapper.getBoundingClientRect();
    const targetRect =
      scrollTarget === window
        ? { top: 0, bottom: window.innerHeight }
        : (scrollTarget as HTMLElement).getBoundingClientRect();
    const nextFixed =
      offsetBottom !== undefined
        ? targetRect.bottom - rect.bottom - offsetBottom <= 0
        : rect.top - targetRect.top - offsetTop <= 0;
    let nextStyle: CSSProperties = {};

    if (offsetBottom !== undefined) {
      if (nextFixed) {
        nextStyle = {
          position: "fixed",
          bottom: window.innerHeight - targetRect.bottom + offsetBottom,
          left: rect.left,
          width: rect.width,
        };
      }
    } else {
      if (nextFixed) {
        nextStyle = {
          position: "fixed",
          top: targetRect.top + offsetTop,
          left: rect.left,
          width: rect.width,
        };
      }
    }

    const nextPlaceholderStyle: CSSProperties = nextFixed
      ? { height: inner.getBoundingClientRect().height }
      : {};
    setAffixStyle((current) => (isSameStyle(current, nextStyle) ? current : nextStyle));
    setPlaceholderStyle((current) =>
      isSameStyle(current, nextPlaceholderStyle) ? current : nextPlaceholderStyle
    );
    if (fixedRef.current !== nextFixed) {
      fixedRef.current = nextFixed;
      setFixed(nextFixed);
      onChangeRef.current?.(nextFixed);
    }
  }, [offsetBottom, offsetTop]);

  const scheduleUpdate = useCallback(() => {
    if (frameRef.current !== null || typeof window === "undefined") return;
    frameRef.current = window.requestAnimationFrame(updatePosition);
  }, [updatePosition]);

  useEffect(() => {
    if (typeof window === "undefined" || !wrapperRef.current || !innerRef.current) return;
    targetRef.current = target();
    const scrollTarget = targetRef.current;
    if (!scrollTarget) return;

    window.addEventListener("scroll", scheduleUpdate, true);
    window.addEventListener("resize", scheduleUpdate);
    const observer =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(scheduleUpdate);
    observer?.observe(wrapperRef.current);
    observer?.observe(innerRef.current);
    if (scrollTarget !== window) observer?.observe(scrollTarget as HTMLElement);
    scheduleUpdate();

    return () => {
      window.removeEventListener("scroll", scheduleUpdate, true);
      window.removeEventListener("resize", scheduleUpdate);
      observer?.disconnect();
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
      targetRef.current = null;
    };
  }, [scheduleUpdate, target]);

  return (
    <div {...rest} ref={wrapperRef} style={{ ...style, ...placeholderStyle }}>
      <div
        ref={innerRef}
        className={clsx("k-affix", { "k-affix-fixed": fixed }, className)}
        style={affixStyle}
      >
        {children}
      </div>
    </div>
  );
}
