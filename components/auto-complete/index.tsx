import clsx from "clsx";
import { Loading } from "kui-icons";
import React, { useContext, useEffect, useEffectEvent, useMemo, useRef, useState } from "react";
import Teleport from "../base/teleport";
import Transition from "../base/transition";
import { ConfigContext } from "../config/config-context";
import type { ShapeType, SizeType, ThemeType } from "../const/types";
import Icon from "../icon";
import { Input } from "../input";
import zhCN from "../locale/zh-CN";
import { setPlacement } from "../utils/placement";

export interface AutoCompleteOption {
  value: string;
  label?: React.ReactNode;
  disabled?: boolean;
}
export interface AutoCompleteProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "value" | "defaultValue" | "onChange" | "onSelect"
> {
  value?: string;
  defaultValue?: string;
  options?: Array<string | AutoCompleteOption>;
  open?: boolean;
  defaultOpen?: boolean;
  showOnEmpty?: boolean;
  clearable?: boolean;
  loading?: boolean;
  loadingText?: string;
  size?: SizeType;
  shape?: ShapeType;
  theme?: ThemeType;
  filterOption?: boolean | ((input: string, option: AutoCompleteOption) => boolean);
  onChange?: (value: string) => void;
  onClear?: () => void;
  onSearch?: (value: string) => void;
  onSelect?: (value: string, option: AutoCompleteOption) => void;
  onOpenChange?: (open: boolean) => void;
}

const AutoComplete: React.FC<AutoCompleteProps> = ({
  value,
  defaultValue = "",
  options = [],
  open,
  defaultOpen = false,
  showOnEmpty = false,
  clearable = false,
  loading = false,
  loadingText,
  size,
  shape,
  theme = "fill",
  filterOption = true,
  onChange,
  onClear,
  onSearch,
  onSelect,
  onOpenChange,
  className,
  disabled,
  onFocus,
  onBlur,
  ...rest
}) => {
  const locale = useContext(ConfigContext)?.locale || zhCN;
  const [innerValue, setInnerValue] = useState(defaultValue);
  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const [active, setActive] = useState(-1);
  const [shownOptions, setShownOptions] = useState<AutoCompleteOption[]>([]);
  const [suppressRemoteOptions, setSuppressRemoteOptions] = useState(false);
  const [position, setPosition] = useState({ left: 0, top: 0, origin: "left top", width: 0 });
  const rootRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const placementRef = useRef("bottom-left");
  const originRef = useRef("left top");
  const topRef = useRef(0);
  const leftRef = useRef(0);
  const current = value ?? innerValue;
  const requestedOpen = open ?? innerOpen;
  const visible = (loading || shownOptions.length > 0) && requestedOpen;
  const normalized = useMemo(
    () => options.map((item) => (typeof item === "string" ? { value: item, label: item } : item)),
    [options]
  );
  const getMatches = (input: string) =>
    normalized.filter((option) =>
      typeof filterOption === "function"
        ? filterOption(input, option)
        : !filterOption || option.value.toLocaleLowerCase().includes(input.toLocaleLowerCase())
    );
  const setOpen = (next: boolean) => {
    if (open === undefined) setInnerOpen(next);
    onOpenChange?.(next);
  };
  const commitMatches = (input: string) => {
    const matches = getMatches(input);
    if (matches.length) setShownOptions(matches);
    return matches.length > 0;
  };
  const updatePosition = () => {
    if (!rootRef.current || !dropdownRef.current) return;
    setPlacement({
      refSelection: rootRef,
      refPopper: dropdownRef,
      currentPlacement: placementRef,
      transOrigin: originRef,
      top: topRef,
      left: leftRef,
      offset: 6,
    });
    setPosition({
      left: leftRef.current,
      top: topRef.current,
      origin: originRef.current,
      width: rootRef.current.offsetWidth,
    });
  };
  const syncRemoteState = useEffectEvent(() => {
    if (loading) {
      setSuppressRemoteOptions(false);
      if (current || showOnEmpty) setOpen(true);
      return;
    }
    if (!current && !showOnEmpty) {
      if (onSearch) setSuppressRemoteOptions(true);
      setOpen(false);
      return;
    }
    const matched = commitMatches(current);
    setSuppressRemoteOptions(!!onSearch && !matched);
    setOpen(matched);
  });
  useEffect(() => {
    const timer = setTimeout(syncRemoteState, 0);
    return () => clearTimeout(timer);
  }, [loading, normalized]);
  useEffect(() => {
    if (!visible) return;
    const frame = requestAnimationFrame(updatePosition);
    const update = () => requestAnimationFrame(updatePosition);
    document.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [visible, shownOptions, loading]);

  const update = (next: string) => {
    if (value === undefined) setInnerValue(next);
    onChange?.(next);
  };
  const choose = (option: AutoCompleteOption) => {
    if (option.disabled) return;
    update(option.value);
    onSelect?.(option.value, option);
    setOpen(false);
    setActive(-1);
  };
  const handleInput = (next: string) => {
    update(next);
    onSearch?.(next);
    if (!next && !showOnEmpty) {
      setSuppressRemoteOptions(!!onSearch);
      setOpen(false);
    } else if (loading) {
      setSuppressRemoteOptions(false);
      setOpen(true);
    } else {
      const matched = commitMatches(next);
      setSuppressRemoteOptions(!!onSearch && !matched);
      setOpen(matched);
    }
    setActive(-1);
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      if (!shownOptions.length) return;
      if (!visible) setOpen(true);
      const direction = event.key === "ArrowDown" ? 1 : -1;
      let next = active;
      for (let i = 0; i < shownOptions.length; i += 1) {
        next = (next + direction + shownOptions.length) % shownOptions.length;
        if (!shownOptions[next]?.disabled) {
          setActive(next);
          break;
        }
      }
      event.preventDefault();
    } else if (event.key === "Enter" && active >= 0) {
      const option = shownOptions[active];
      if (option) choose(option);
      event.preventDefault();
    } else if (event.key === "Escape") setOpen(false);
  };

  return (
    <div ref={rootRef} className={clsx("k-auto-complete", className)}>
      <Input
        {...rest}
        value={current}
        disabled={disabled}
        size={size}
        shape={shape}
        theme={theme}
        clearable={clearable}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={visible}
        onFocus={(event) => {
          onFocus?.(event);
          if (disabled) return;
          const matches = getMatches(current);
          if (matches.length) setShownOptions(matches);
          if ((current || showOnEmpty) && (matches.length || loading)) setOpen(true);
        }}
        onBlur={(event) => {
          onBlur?.(event);
          setTimeout(() => setOpen(false), 120);
        }}
        onClear={onClear}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
      />
      <Teleport to="body">
        <Transition show={visible} name="k-select" nodeRef={dropdownRef}>
          <div
            ref={dropdownRef}
            className={clsx("k-select-dropdown", "k-auto-complete-dropdown", {
              "k-select-dropdown-sm": size === "small",
            })}
            style={{
              left: position.left,
              top: position.top,
              minWidth: position.width,
              transformOrigin: position.origin,
            }}
            role="listbox"
          >
            {loading || suppressRemoteOptions ? (
              <div className="k-select-loading">
                <Icon type={Loading} spin />
                <span>{loadingText || locale.k.select.loading}</span>
              </div>
            ) : (
              <ul>
                {shownOptions.map((option, index) => (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={active === index}
                    aria-disabled={option.disabled || undefined}
                    className={clsx("k-select-item", {
                      "k-select-item-active": active === index,
                      "k-select-item-disabled": option.disabled,
                    })}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => choose(option)}
                  >
                    {option.label ?? option.value}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Transition>
      </Teleport>
    </div>
  );
};
export default AutoComplete;
