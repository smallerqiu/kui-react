import clsx from "clsx";
import { ChevronDown, X } from "kui-icons";
import React, { useCallback, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Button } from "../button";
import { Dropdown } from "../dropdown";
import Icon from "../icon";
import { Menu, MenuItem } from "../menu";
import { getChildren } from "../utils/react-node";
import type { TabPanelProps } from "./tab-panel";

export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: string | number;
  defaultValue?: string | number;
  variant?: "line" | "card" | "sample" | "browser";
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
  variant,
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
  const currentVariant = variant ?? (card ? "card" : sample ? "sample" : "line");
  const navRef = useRef<HTMLDivElement>(null);
  const tabsId = `k-tabs-${useId().replace(/:/g, "")}`;
  const navScrollRef = useRef<HTMLDivElement>(null);
  const navBoxRef = useRef<HTMLDivElement>(null);
  const inkBarRef = useRef<HTMLDivElement>(null);

  // Parse panels from children
  const childList = useMemo(() => getChildren(children), [children]);

  // Determine initial active key from first panel if not provided
  const firstPanel = childList.find(
    (child) => React.isValidElement<TabPanelProps>(child) && !child.props.disabled,
  );
  const firstKey =
    firstPanel && React.isValidElement(firstPanel) ? String(firstPanel.key) : undefined;

  const [innerActiveKey, setInnerActiveKey] = useState<string | undefined>(
    defaultValue !== undefined ? String(defaultValue) : firstKey,
  );
  const requestedKey = value !== undefined ? String(value) : innerActiveKey;
  const hasRequestedKey = childList.some(
    (child) => React.isValidElement(child) && String(child.key) === requestedKey,
  );
  const activeKey = hasRequestedKey || value !== undefined ? requestedKey : firstKey;
  const currentIndex = childList.findIndex(
    (child) => React.isValidElement(child) && String(child.key) === activeKey,
  );
  const [scrollable, setScrollable] = useState(false);
  const navOffsetRef = useRef(0);

  const updateInkBarPosition = useCallback(
    (index: number) => {
      if (currentVariant === "line" && inkBarRef.current && navRef.current) {
        const nav = navRef.current.children[index] as HTMLElement;
        if (nav) {
          inkBarRef.current.style.width = `${nav.offsetWidth}px`;
          inkBarRef.current.style.transform = `translate3d(${nav.offsetLeft}px, 0px, 0px)`;
        }
      }
    },
    [currentVariant],
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
      navScrollEl.style.transform = `translate3d(${next}px,0,0)`;
    },
    [getMaxOffset],
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

      const edgeOffset = currentVariant === "browser" ? 10 : 0;
      const left = target.offsetLeft - edgeOffset;
      const right = target.offsetLeft + target.offsetWidth + edgeOffset;
      let next = navOffsetRef.current;
      if (left + next < 0) next = -left;
      else if (right + next > navBoxEl.clientWidth) next = navBoxEl.clientWidth - right;
      applyOffset(next);
    },
    [applyOffset, currentVariant],
  );

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

  const closeTab = (key: string, e: React.SyntheticEvent) => {
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

  const moveTabFocus = (event: React.KeyboardEvent, panel: React.ReactNode) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    const enabled = childList.filter(
      (child) => React.isValidElement<TabPanelProps>(child) && !child.props.disabled,
    );
    if (!enabled.length) return;
    const current = enabled.indexOf(panel);
    const nextPanel =
      event.key === "Home"
        ? enabled[0]
        : event.key === "End"
          ? enabled[enabled.length - 1]
          : enabled[
              (Math.max(current, 0) + (event.key === "ArrowRight" ? 1 : -1) + enabled.length) %
                enabled.length
            ];
    if (!React.isValidElement(nextPanel)) return;
    const key = String(nextPanel.key);
    const index = childList.indexOf(nextPanel);
    (navRef.current?.children[index] as HTMLElement | undefined)?.focus();
    tabClick(key, false);
    event.preventDefault();
  };

  const selectOverflowTab = (key: string) => {
    const index = childList.findIndex(
      (panel) => React.isValidElement(panel) && String(panel.key) === key,
    );
    if (index < 0 || !React.isValidElement<TabPanelProps>(childList[index])) return;
    tabClick(key, Boolean(childList[index].props.disabled));
  };

  // Build nav tabs from children
  const navNodes = childList.map((panel) => {
    if (!React.isValidElement(panel)) return null;
    const key = String(panel.key);
    const { icon, title, closable, disabled } = panel.props as TabPanelProps;
    const isDisabled = disabled !== undefined && disabled !== false;
    const isClosable = Boolean(closable);
    return (
      <div
        key={key}
        className={clsx("k-tabs-tab", {
          "k-tabs-tab-active": key === activeKey,
          "k-tabs-tab-disabled": isDisabled,
        })}
        onClick={() => tabClick(key, isDisabled)}
        onKeyDown={(event) => moveTabFocus(event, panel)}
        id={`${tabsId}-tab-${key}`}
        role="tab"
        tabIndex={key === activeKey && !isDisabled ? 0 : -1}
        aria-selected={key === activeKey}
        aria-disabled={isDisabled || undefined}
        aria-controls={`${tabsId}-panel-${key}`}
      >
        {icon ? <Icon type={icon} /> : null}
        <span className="k-tabs-title">{title}</span>
        {isClosable && ["card", "browser"].includes(currentVariant) ? (
          <Icon
            type={X}
            className="k-tabs-close"
            role="button"
            tabIndex={0}
            aria-label="Close"
            onClick={(e) => closeTab(key, e)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                closeTab(key, e);
              }
            }}
          />
        ) : null}
      </div>
    );
  });

  // Inject activeKey into TabPanel children
  const panelNodes = childList.map((panel) => {
    if (!React.isValidElement<TabPanelProps>(panel)) return panel;
    return React.cloneElement(panel, {
      tabKey: panel.key ?? undefined,
      activeKey,
      tabsId,
    });
  });

  const classes = clsx(
    "k-tabs",
    {
      "k-tabs-animated": animated && currentVariant === "line",
      [`k-tabs-${currentVariant}`]: currentVariant !== "line",
      "k-tabs-centered": centered,
    },
    className,
  );

  const paneStyle: React.CSSProperties =
    animated && currentVariant === "line" && currentIndex >= 0
      ? { marginLeft: `-${100 * currentIndex}%` }
      : {};

  return (
    <div className={classes} {...rest}>
      <div className="k-tabs-bar">
        <div
          className={clsx("k-tabs-nav-container", { "k-tabs-nav-container-scroll": scrollable })}
        >
          <div className="k-tabs-nav-wrap" ref={navBoxRef}>
            <div className="k-tabs-nav" ref={navScrollRef}>
              {currentVariant === "line" ? (
                <div className="k-tabs-ink-bar" ref={inkBarRef} />
              ) : null}
              <div
                className="k-tabs-nav-inner"
                ref={navRef}
                role="tablist"
                aria-orientation="horizontal"
              >
                {navNodes}
              </div>
            </div>
          </div>
          {scrollable ? (
            <Dropdown
              trigger="click"
              placement="bottom-right"
              overlay={
                <Menu
                  className="k-tabs-overflow-menu"
                  onSelect={({ key }) => selectOverflowTab(key)}
                >
                  {childList.map((panel) => {
                    if (!React.isValidElement<TabPanelProps>(panel)) return null;
                    const key = String(panel.key);
                    return (
                      <MenuItem
                        key={key}
                        itemKey={key}
                        icon={panel.props.icon}
                        disabled={panel.props.disabled}
                        className={clsx({ "k-tabs-overflow-item-active": key === activeKey })}
                      >
                        {panel.props.title}
                      </MenuItem>
                    );
                  })}
                </Menu>
              }
            >
              <Button
                icon={ChevronDown}
                className="k-tabs-overflow-trigger"
                aria-label="More tabs"
              />
            </Dropdown>
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
