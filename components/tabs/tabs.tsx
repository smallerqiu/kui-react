import clsx from "clsx";
import { ChevronLeft, ChevronRight, X } from "kui-icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Icon from "../icon";
import { getChildren } from "../utils/react-node";

export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: string | number;
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
  const childList = getChildren(children);

  // Determine initial active key from first panel if not provided
  const firstKey =
    childList.length > 0 && React.isValidElement(childList[0])
      ? (childList[0].key as string)
      : undefined;

  const [activeKey, setActiveKey] = useState<string | number | undefined>(
    value !== undefined ? value : firstKey
  );
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [scrollable, setScrollable] = useState(false);
  const [navOffsetLeft, setNavOffsetLeft] = useState(0);
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(false);

  // Sync from prop
  useEffect(() => {
    if (value !== undefined) {
      setActiveKey(value);
    }
  }, [value]);

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

  const resetActivePosition = useCallback(
    (index: number) => {
      const navEl = navRef.current;
      const navBoxEl = navBoxRef.current;
      const navScrollEl = navScrollRef.current;
      if (!navEl || !navBoxEl || !navScrollEl) return;

      const target = navEl.children[index] as HTMLElement;
      if (!target) return;

      const clientWidth = navBoxEl.clientWidth;
      let navLeft = navOffsetLeft;
      const { offsetLeft, offsetWidth } = target;

      if (navLeft + offsetLeft < 0) {
        navLeft = -offsetLeft;
      } else if (clientWidth - navLeft < offsetLeft + offsetWidth) {
        navLeft -= offsetLeft + offsetWidth + navLeft - clientWidth + 2;
      }

      setNavOffsetLeft(navLeft);
      navScrollEl.style.transform = `translate3d(${navLeft}px,0,0)`;
    },
    [navOffsetLeft]
  );

  const updateNav = useCallback(() => {
    const navBoxEl = navBoxRef.current;
    if (!navBoxEl) return;
    setScrollable(navBoxEl.scrollWidth > navBoxEl.clientWidth);
  }, []);

  const resetNavPosition = useCallback(() => {
    setTimeout(() => {
      const navScrollEl = navScrollRef.current;
      const navBoxEl = navBoxRef.current;
      if (!navScrollEl || !navBoxEl) return;
      const totalWidth = navScrollEl.offsetWidth;
      const clientWidth = navBoxEl.clientWidth;
      let navLeft = navOffsetLeft;

      if (clientWidth + navLeft < clientWidth) {
        navLeft = clientWidth - totalWidth;
      }
      if (navLeft > 0) navLeft = 0;

      setNavOffsetLeft(navLeft);
      setNextBtnDisabled(navLeft === clientWidth - totalWidth);
      setPrevBtnDisabled(navLeft === 0);
      navScrollEl.style.transform = `translate3d(${navLeft}px,0,0)`;

      const idx = childList.findIndex((c) => React.isValidElement(c) && c.key === activeKey);
      if (idx >= 0) {
        resetActivePosition(idx);
        updateInkBarPosition(idx);
      }
      updateNav();
    }, 0);
  }, [navOffsetLeft, activeKey, childList]);

  // Recalculate on active change
  useEffect(() => {
    const idx = childList.findIndex((c) => React.isValidElement(c) && c.key === activeKey);
    setCurrentIndex(idx);
    if (idx >= 0) {
      setTimeout(() => {
        resetActivePosition(idx);
        updateInkBarPosition(idx);
        updateNav();
      }, 0);
    }
  }, [activeKey, children]);

  useEffect(() => {
    window.addEventListener("resize", resetNavPosition);
    return () => window.removeEventListener("resize", resetNavPosition);
  }, [resetNavPosition]);

  const scroll = (direction: "left" | "right") => {
    const navScrollEl = navScrollRef.current;
    const navBoxEl = navBoxRef.current;
    if (!navScrollEl || !navBoxEl) return;

    const totalWidth = navScrollEl.offsetWidth;
    const clientWidth = navBoxEl.clientWidth;
    let navLeft = navOffsetLeft;

    if (direction === "right") {
      const endWidth = totalWidth - clientWidth + navLeft;
      if (endWidth > clientWidth) navLeft -= clientWidth;
      else if (endWidth > 0) navLeft -= endWidth;
    } else {
      if (navLeft < -clientWidth) navLeft += clientWidth;
      else if (navLeft < 0) navLeft = 0;
    }

    setNextBtnDisabled(navLeft === clientWidth - totalWidth);
    setPrevBtnDisabled(navLeft === 0);
    setNavOffsetLeft(navLeft);
    navScrollEl.style.transform = `translate3d(${navLeft}px,0,0)`;
  };

  const closeTab = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove?.(key);
  };

  const tabClick = (key: string, disabled: boolean, index: number) => {
    if (disabled) return;
    onTabClick?.(key);
    if (activeKey !== key) {
      if (value === undefined) setActiveKey(key);
      setCurrentIndex(index);
      onChange?.(key);
    }
  };

  // Build nav tabs from children
  const navNodes = childList.map((panel, index) => {
    if (!React.isValidElement(panel)) return null;
    const key = panel.key as string;
    const { icon, title, closable, disabled } = panel.props;
    const isDisabled = disabled !== undefined && disabled !== false;
    const isClosable = closable !== undefined;
    return (
      <div
        key={key}
        className={clsx("k-tabs-tab", {
          "k-tabs-tab-active": key === activeKey,
          "k-tabs-tab-disabled": isDisabled,
        })}
        onClick={() => tabClick(key, isDisabled, index)}
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
    if (!React.isValidElement(panel)) return panel;
    return React.cloneElement(panel as React.ReactElement<any>, {
      tabKey: panel.key,
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
            <span
              className={clsx("k-tabs-tab-btn-prev", {
                "k-tabs-tab-btn-prev-disabled": prevBtnDisabled,
              })}
              onClick={() => scroll("left")}
            >
              <Icon type={ChevronLeft} />
            </span>
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
            <span
              className={clsx("k-tabs-tab-btn-next", {
                "k-tabs-tab-btn-next-disabled": nextBtnDisabled,
              })}
              onClick={() => scroll("right")}
            >
              <Icon type={ChevronRight} />
            </span>
          ) : null}
        </div>
        {extra ? <div className="k-tabs-extra">{extra}</div> : null}
      </div>
      <div className="k-tabs-content" style={paneStyle}>
        {panelNodes}
      </div>
    </div>
  );
};

export default Tabs;
