import clsx from "clsx";
import { ChevronLeft, ChevronRight, X } from "kui-icons";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button } from "../button";
import Icon from "../icon";
import { getChildren } from "../utils/react-node";
import type { TabPanelProps } from "./tab-panel";

export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: string | number;
  defaultValue?: string | number;
  card?: boolean;
  sample?: boolean;
  centered?: boolean;
  animated?: boolean;
  extra?: React.ReactNode;
  onTabClick?: (key: string) => void;
  onChange?: (key: string) => void;
  onRemove?: (key: string) => void;
  children?: React.ReactNode;
}

const Tabs: React.FC<TabsProps> = ({
  value,
  defaultValue,
  card = false,
  sample = false,
  centered = false,
  animated = true,
  extra,
  onTabClick,
  onChange,
  onRemove,
  children,
  className = "",
  ...rest
}) => {
  const navRef = useRef<HTMLDivElement>(null);
  const navScrollRef = useRef<HTMLDivElement>(null);
  const navBoxRef = useRef<HTMLDivElement>(null);
  const inkBarRef = useRef<HTMLDivElement>(null);

  // Parse panels from children
  const childList = useMemo(() => getChildren(children), [children]);

  // Determine initial active key from first panel if not provided
  const firstKey =
    childList.length > 0 && React.isValidElement(childList[0])
      ? (childList[0].key as string)
      : undefined;

  const [innerActiveKey, setInnerActiveKey] = useState<string | number | undefined>(
    defaultValue ?? firstKey
  );
  const activeKey = value ?? innerActiveKey;
  const currentIndex = childList.findIndex(
    (child) => React.isValidElement(child) && child.key === activeKey
  );
  const [scrollable, setScrollable] = useState(false);
  const navOffsetRef = useRef(0);
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(false);

  const updateInkBarPosition = useCallback(
    (index: number) => {
      if (!card && !sample && inkBarRef.current && navRef.current) {
        const nav = navRef.current.children[index] as HTMLElement;
        if (nav) {
          inkBarRef.current.style.width = `${nav.offsetWidth}px`;
          inkBarRef.current.style.transform = `translate3d(${nav.offsetLeft}px, 0px, 0px)`;
        }
      }
    },
    [card, sample]
  );

  const getMaxOffset = useCallback(() => {
    const navBoxEl = navBoxRef.current;
    const navEl = navRef.current;
    if (!navBoxEl || !navEl) return 0;
    return Math.max(0, navEl.scrollWidth - navBoxEl.clientWidth);
  }, []);

  const applyOffset = useCallback(
    (offset: number) => {
      const navScrollEl = navScrollRef.current;
      if (!navScrollEl) return;
      const maxOffset = getMaxOffset();
      const next = Math.min(0, Math.max(-maxOffset, offset));
      navOffsetRef.current = next;
      setPrevBtnDisabled(next >= -0.5);
      setNextBtnDisabled(maxOffset <= 0.5 || next <= -maxOffset + 0.5);
      navScrollEl.style.transform = `translate3d(${next}px,0,0)`;
    },
    [getMaxOffset]
  );

  const updateNav = useCallback(() => {
    const maxOffset = getMaxOffset();
    setScrollable(maxOffset > 0.5);
    applyOffset(navOffsetRef.current);
  }, [applyOffset, getMaxOffset]);

  const resetActivePosition = useCallback(
    (index: number) => {
      const navEl = navRef.current;
      const navBoxEl = navBoxRef.current;
      if (!navEl || !navBoxEl) return;
      const target = navEl.children[index] as HTMLElement;
      if (!target) return;

      const left = target.offsetLeft;
      const right = left + target.offsetWidth;
      let next = navOffsetRef.current;
      if (left + next < 0) next = -left;
      else if (right + next > navBoxEl.clientWidth) next = navBoxEl.clientWidth - right;
      applyOffset(next);
    },
    [applyOffset]
  );

  // Recalculate on active change
  useEffect(() => {
    const idx = childList.findIndex((c) => React.isValidElement(c) && c.key === activeKey);
    if (idx >= 0) {
      setTimeout(() => {
        resetActivePosition(idx);
        updateInkBarPosition(idx);
        updateNav();
      }, 0);
    }
  }, [activeKey, childList, resetActivePosition, updateInkBarPosition, updateNav]);

  useLayoutEffect(() => {
    const updateLayout = () => {
      updateNav();
      if (currentIndex >= 0) {
        resetActivePosition(currentIndex);
        updateInkBarPosition(currentIndex);
      }
    };
    let frame = requestAnimationFrame(updateLayout);
    const scheduleUpdate = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateLayout);
    };
    const observer =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(scheduleUpdate);
    if (observer) {
      if (navBoxRef.current) observer.observe(navBoxRef.current);
      if (navRef.current) observer.observe(navRef.current);
    } else {
      window.addEventListener("resize", scheduleUpdate);
    }
    return () => {
      cancelAnimationFrame(frame);
      if (observer) observer.disconnect();
      else window.removeEventListener("resize", scheduleUpdate);
    };
  }, [childList.length, currentIndex, resetActivePosition, updateInkBarPosition, updateNav]);

  const scroll = (direction: "left" | "right") => {
    const navBoxEl = navBoxRef.current;
    if (!navBoxEl) return;
    const clientWidth = navBoxEl.clientWidth;
    const delta = direction === "right" ? -clientWidth : clientWidth;
    applyOffset(navOffsetRef.current + delta);
  };

  const closeTab = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove?.(key);
  };

  const tabClick = (key: string, disabled: boolean) => {
    if (disabled) return;
    onTabClick?.(key);
    if (activeKey !== key) {
      if (value === undefined) setInnerActiveKey(key);
      onChange?.(key);
    }
  };

  // Build nav tabs from children
  const navNodes = childList.map((panel) => {
    if (!React.isValidElement(panel)) return null;
    const key = panel.key as string;
    const { icon, title, closable, disabled } = panel.props as TabPanelProps;
    const isDisabled = disabled !== undefined && disabled !== false;
    const isClosable = closable !== undefined;
    return (
      <div
        key={key}
        className={clsx("k-tabs-tab", {
          "k-tabs-tab-active": key === activeKey,
          "k-tabs-tab-disabled": isDisabled,
        })}
        onClick={() => tabClick(key, isDisabled)}
      >
        {icon ? <Icon type={icon} /> : null}
        {title}
        {isClosable && card ? (
          <Icon type={X} className="k-tabs-close" onClick={(e) => closeTab(key, e)} />
        ) : null}
      </div>
    );
  });

  // Inject activeKey into TabPanel children
  const panelNodes = childList.map((panel) => {
    if (!React.isValidElement<{ tabKey?: React.Key; activeKey?: React.Key }>(panel)) return panel;
    return React.cloneElement(panel, {
      tabKey: panel.key ?? undefined,
      activeKey,
    });
  });

  const classes = clsx(
    "k-tabs",
    {
      "k-tabs-animated": animated && !card && !sample,
      "k-tabs-card": card && !sample,
      "k-tabs-sample": sample && !card,
      "k-tabs-centered": centered,
    },
    className
  );

  const paneStyle: React.CSSProperties =
    animated && !card && !sample && currentIndex >= 0
      ? { marginLeft: `-${100 * currentIndex}%` }
      : {};

  return (
    <div className={classes} {...rest}>
      <div className="k-tabs-bar">
        <div
          className={clsx("k-tabs-nav-container", { "k-tabs-nav-container-scroll": scrollable })}
        >
          {scrollable ? (
            <Button
              type="text"
              size="large"
              disabled={prevBtnDisabled}
              className={clsx("k-tabs-tab-btn-prev", {})}
              onClick={() => scroll("left")}
            >
              <Icon type={ChevronLeft} />
            </Button>
          ) : null}
          <div className="k-tabs-nav-wrap" ref={navBoxRef}>
            <div className="k-tabs-nav" ref={navScrollRef}>
              {!card && !sample ? <div className="k-tabs-ink-bar" ref={inkBarRef} /> : null}
              <div className="k-tabs-nav-inner" ref={navRef}>
                {navNodes}
              </div>
            </div>
          </div>
          {scrollable ? (
            <Button
              type="text"
              size="large"
              disabled={nextBtnDisabled}
              className={clsx("k-tabs-tab-btn-next", {})}
              onClick={() => scroll("right")}
            >
              <Icon type={ChevronRight} />
            </Button>
          ) : null}
        </div>
        {extra ? <div className="k-tabs-extra">{extra}</div> : null}
      </div>
      <div className="k-tabs-wrapper">
        <div className="k-tabs-content" style={paneStyle}>
          {panelNodes}
        </div>
      </div>
    </div>
  );
};

export default Tabs;
