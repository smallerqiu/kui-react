import clsx from "clsx";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
} from "react";
import { AnchorContext, type AnchorContextValue } from "./anchor-context";

export interface AnchorProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "onClick"> {
  affix?: boolean;
  offsetTop?: number;
  bounds?: number;
  container?: string | HTMLElement | Window;
  onChange?: (activeLink: string) => void;
  onClick?: (link: string) => void;
}

export default function Anchor({
  affix = true,
  offsetTop = 0,
  bounds = 5,
  container,
  onChange,
  onClick,
  className,
  children,
  ...rest
}: AnchorProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef(new Set<string>());
  const clickScrollingRef = useRef(false);
  const scrollEndTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const frameRef = useRef<number | null>(null);
  const unmountedRef = useRef(false);
  const offsetTopRef = useRef(offsetTop);
  const boundsRef = useRef(bounds);
  const onChangeRef = useRef(onChange);
  const onClickRef = useRef(onClick);
  const [activeLink, setActiveLink] = useState("");
  const [inkStyle, setInkStyle] = useState<CSSProperties>({ opacity: 0 });

  useEffect(() => {
    offsetTopRef.current = offsetTop;
    boundsRef.current = bounds;
    onChangeRef.current = onChange;
    onClickRef.current = onClick;
  }, [bounds, offsetTop, onChange, onClick]);

  const getContainer = useCallback((): HTMLElement | Window | null => {
    if (typeof window === "undefined") return null;
    if (!container) return window;
    if (typeof container === "string") {
      return document.querySelector<HTMLElement>(container) ?? window;
    }
    return container;
  }, [container]);

  const getTarget = useCallback((link: string) => {
    if (typeof document === "undefined") return null;
    if (link.startsWith("#")) {
      try {
        return document.getElementById(decodeURIComponent(link.slice(1)));
      } catch {
        return null;
      }
    }
    try {
      return document.querySelector<HTMLElement>(link);
    } catch {
      return null;
    }
  }, []);

  const getElementTop = useCallback(
    (element: HTMLElement, scrollContainer: HTMLElement | Window) => {
      const rect = element.getBoundingClientRect();
      if (scrollContainer === window) return rect.top + window.scrollY;
      const containerElement = scrollContainer as HTMLElement;
      const containerRect = containerElement.getBoundingClientRect();
      return rect.top - containerRect.top - containerElement.clientTop + containerElement.scrollTop;
    },
    []
  );

  const updateInk = useCallback(() => {
    const node = wrapperRef.current?.querySelector<HTMLElement>(
      ".k-anchor-link-active > .k-anchor-link-title"
    );
    const next: CSSProperties = node
      ? { top: (node.parentElement?.offsetTop || 0) + 4, height: node.clientHeight, opacity: 1 }
      : { top: 0, height: 0, opacity: 0 };
    setInkStyle((current) =>
      current.top === next.top && current.height === next.height && current.opacity === next.opacity
        ? current
        : next
    );
  }, []);

  const handleScroll = useCallback(() => {
    frameRef.current = null;
    if (clickScrollingRef.current) return;
    const scrollContainer = getContainer();
    if (!scrollContainer) return;
    const scrollTop =
      scrollContainer === window ? window.pageYOffset : (scrollContainer as HTMLElement).scrollTop;
    const targets = [...linksRef.current]
      .map((link) => {
        const target = getTarget(link);
        return target ? { link, offsetTop: getElementTop(target, scrollContainer) } : null;
      })
      .filter((item): item is { link: string; offsetTop: number } => item !== null)
      .sort((a, b) => a.offsetTop - b.offsetTop);

    let next = "";
    for (let index = targets.length - 1; index >= 0; index -= 1) {
      const target = targets[index];
      if (scrollTop >= target.offsetTop - offsetTopRef.current - boundsRef.current) {
        next = target.link;
        break;
      }
    }
    setActiveLink((current) => {
      if (current === next) return current;
      onChangeRef.current?.(next);
      return next;
    });
  }, [getContainer, getElementTop, getTarget]);

  const scheduleScroll = useCallback(() => {
    if (unmountedRef.current || frameRef.current !== null || typeof window === "undefined") return;
    frameRef.current = window.requestAnimationFrame(handleScroll);
  }, [handleScroll]);

  const finishClickScrolling = useCallback(() => {
    clickScrollingRef.current = false;
    scrollEndTimerRef.current = null;
    scheduleScroll();
    updateInk();
  }, [scheduleScroll, updateInk]);

  const scrollTo = useCallback(
    (link: string) => {
      const target = getTarget(link);
      const scrollContainer = getContainer();
      if (!target || !scrollContainer) return;
      clickScrollingRef.current = true;
      setActiveLink(link);
      onClickRef.current?.(link);
      scrollContainer.scrollTo({
        top: getElementTop(target, scrollContainer) - offsetTopRef.current,
        behavior: "smooth",
      });
      if (scrollEndTimerRef.current) clearTimeout(scrollEndTimerRef.current);
      scrollEndTimerRef.current = setTimeout(finishClickScrolling, 1000);
    },
    [finishClickScrolling, getContainer, getElementTop, getTarget]
  );

  const registerLink = useCallback(
    (link: string) => {
      linksRef.current.add(link);
      scheduleScroll();
    },
    [scheduleScroll]
  );
  const unregisterLink = useCallback(
    (link: string) => {
      linksRef.current.delete(link);
      scheduleScroll();
    },
    [scheduleScroll]
  );

  useEffect(() => {
    updateInk();
  }, [activeLink, updateInk]);

  useEffect(() => {
    unmountedRef.current = false;
    const scrollContainer = getContainer();
    if (!scrollContainer || typeof window === "undefined") return;
    const handleContainerScroll = () => {
      if (!clickScrollingRef.current) {
        scheduleScroll();
        return;
      }
      if (scrollEndTimerRef.current) clearTimeout(scrollEndTimerRef.current);
      scrollEndTimerRef.current = setTimeout(finishClickScrolling, 120);
    };
    const handleResize = () => {
      scheduleScroll();
      updateInk();
    };
    scrollContainer.addEventListener("scroll", handleContainerScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    const observer =
      wrapperRef.current && "ResizeObserver" in window ? new ResizeObserver(updateInk) : null;
    if (wrapperRef.current) observer?.observe(wrapperRef.current);
    const initialTimer = setTimeout(scheduleScroll, 0);

    return () => {
      unmountedRef.current = true;
      scrollContainer.removeEventListener("scroll", handleContainerScroll);
      window.removeEventListener("resize", handleResize);
      observer?.disconnect();
      clearTimeout(initialTimer);
      if (scrollEndTimerRef.current) clearTimeout(scrollEndTimerRef.current);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      scrollEndTimerRef.current = null;
      frameRef.current = null;
      clickScrollingRef.current = false;
    };
  }, [finishClickScrolling, getContainer, scheduleScroll, updateInk]);

  useEffect(scheduleScroll, [bounds, offsetTop, scheduleScroll]);

  const context = useMemo<AnchorContextValue>(
    () => ({ activeLink, registerLink, unregisterLink, scrollTo }),
    [activeLink, registerLink, scrollTo, unregisterLink]
  );

  return (
    <AnchorContext.Provider value={context}>
      <div
        {...rest}
        ref={wrapperRef}
        className={clsx("k-anchor-wrapper", { "k-anchor-affix": affix }, className)}
      >
        <div className="k-anchor">
          <span className="k-anchor-ink-ball" style={inkStyle} />
          {children}
        </div>
      </div>
    </AnchorContext.Provider>
  );
}
