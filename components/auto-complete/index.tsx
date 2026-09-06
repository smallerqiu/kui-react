import clsx from "clsx";
import { Loading } from "kui-icons";
import React, {
  useContext,
  useEffect,
  useEffectEvent,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
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
  readOnly,
  onFocus,
  onBlur,
  onKeyDown,
  onCompositionStart,
  onCompositionEnd,
  ...rest
}) => {
  const locale = useContext(ConfigContext)?.locale || zhCN;
  const listboxId = `k-auto-complete-listbox-${useId().replace(/:/g, "")}`;
  const normalized = useMemo(
    () => options.map((item) => (typeof item === "string" ? { value: item, label: item } : item)),
    [options],
  );
  const initialCurrent = value ?? defaultValue;
  const initiallyOpen = open ?? defaultOpen;
  const initialShownOptions =
    initiallyOpen && (initialCurrent || showOnEmpty) && !loading
      ? normalized.filter((option) =>
          typeof filterOption === "function"
            ? filterOption(initialCurrent, option)
            : !filterOption ||
              option.value.toLocaleLowerCase().includes(initialCurrent.toLocaleLowerCase()),
        )
      : [];
  const [innerValue, setInnerValue] = useState(defaultValue);
  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const [rendered, setRendered] = useState(
    initiallyOpen && (loading || initialShownOptions.length > 0),
  );
  const [positioned, setPositioned] = useState(false);
  const [active, setActive] = useState(-1);
  const [shownOptions, setShownOptions] = useState<AutoCompleteOption[]>(initialShownOptions);
  const [suppressRemoteOptions, setSuppressRemoteOptions] = useState(false);
  const [syncedOpenChange, setSyncedOpenChange] = useState<{
    value: boolean;
    revision: number;
  } | null>(null);
  const [position, setPosition] = useState({ left: 0, top: 0, origin: "left top", width: 0 });
  const rootRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const blurTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const composing = useRef(false);
  const placementRef = useRef("bottom-left");
  const originRef = useRef("left top");
  const topRef = useRef(0);
  const leftRef = useRef(0);
  const current = value ?? innerValue;
  const requestedOpen = open ?? innerOpen;
  const visible = (loading || (!suppressRemoteOptions && shownOptions.length > 0)) && requestedOpen;
  const getMatches = (input: string) =>
    normalized.filter((option) =>
      typeof filterOption === "function"
        ? filterOption(input, option)
        : !filterOption || option.value.toLocaleLowerCase().includes(input.toLocaleLowerCase()),
    );
  const setOpen = (next: boolean) => {
    if (next && readOnly) return;
    if (next && suppressRemoteOptions && !loading) return;
    if (next) {
      setRendered(true);
      if (!requestedOpen) setPositioned(false);
    }
    if (open === undefined) setInnerOpen(next);
    if (!next) setActive(-1);
    onOpenChange?.(next);
  };
  const commitMatches = (input: string) => {
    const matches = getMatches(input);
    if (matches.length) setShownOptions(matches);
    return matches.length > 0;
  };
  const syncOpen = (next: boolean) => {
    if (next) {
      setRendered(true);
      if (!requestedOpen) setPositioned(false);
    }
    if (open === undefined) setInnerOpen(next);
    if (!next) setActive(-1);
    setSyncedOpenChange((state) => ({ value: next, revision: (state?.revision ?? 0) + 1 }));
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
    setPositioned(true);
  };
  const [previousRemoteState, setPreviousRemoteState] = useState({ loading, normalized });
  if (previousRemoteState.loading !== loading || previousRemoteState.normalized !== normalized) {
    setPreviousRemoteState({ loading, normalized });
    if (loading) {
      setSuppressRemoteOptions(false);
      if (current || showOnEmpty) syncOpen(true);
    } else if (!current && !showOnEmpty) {
      if (onSearch) setSuppressRemoteOptions(true);
      syncOpen(false);
    } else {
      const matched = commitMatches(current);
      setSuppressRemoteOptions(!!onSearch && !matched);
      syncOpen(matched);
    }
  }
  const emitSyncedOpen = useEffectEvent((next: boolean) => onOpenChange?.(next));
  useEffect(() => {
    if (syncedOpenChange) emitSyncedOpen(syncedOpenChange.value);
  }, [syncedOpenChange]);
  useEffect(() => {
    if (!visible) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updatePosition);
    };
    const observer = new ResizeObserver(update);
    if (rootRef.current) observer.observe(rootRef.current);
    if (dropdownRef.current) observer.observe(dropdownRef.current);
    update();
    document.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [visible, shownOptions, loading]);
  useEffect(() => () => clearTimeout(blurTimer.current), []);
  useEffect(() => {
    dropdownRef.current
      ?.querySelector<HTMLElement>(`#${listboxId}-option-${active}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active, listboxId]);

  const update = (next: string) => {
    if (readOnly) return;
    if (value === undefined) setInnerValue(next);
    onChange?.(next);
  };
  const choose = (option: AutoCompleteOption) => {
    if (readOnly || option.disabled) return;
    update(option.value);
    onSelect?.(option.value, option);
    setOpen(false);
    setActive(-1);
  };
  const handleInput = (next: string) => {
    if (readOnly) return;
    update(next);
    if (composing.current) return;
    search(next);
  };
  const search = (next: string) => {
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
    if (readOnly) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      if ((!current && !showOnEmpty) || suppressRemoteOptions) return;
      if (!getMatches(current).length) return;
      if (!shownOptions.length) return;
      if (!visible) setOpen(true);
      const enabled = shownOptions
        .map((option, index) => (!option.disabled ? index : -1))
        .filter((index) => index >= 0);
      if (!enabled.length) return;
      const currentIndex = enabled.indexOf(active);
      setActive(
        currentIndex < 0
          ? enabled[event.key === "ArrowDown" ? 0 : enabled.length - 1]
          : enabled[
              (currentIndex + (event.key === "ArrowDown" ? 1 : -1) + enabled.length) %
                enabled.length
            ],
      );
      event.preventDefault();
    } else if (event.key === "Enter" && visible && active >= 0) {
      const option = shownOptions[active];
      if (option) choose(option);
      event.preventDefault();
    } else if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className={clsx("k-auto-complete", className)}>
      <Input
        {...rest}
        value={current}
        disabled={disabled}
        readOnly={readOnly}
        size={size}
        shape={shape}
        theme={theme}
        clearable={clearable}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={visible}
        aria-controls={visible ? listboxId : undefined}
        aria-activedescendant={visible && active >= 0 ? `${listboxId}-option-${active}` : undefined}
        onFocus={(event) => {
          onFocus?.(event);
          if (event.defaultPrevented) return;
          if (disabled || readOnly) return;
          const matches = getMatches(current);
          if (matches.length) setShownOptions(matches);
          if ((current || showOnEmpty) && (matches.length || loading)) setOpen(true);
        }}
        onBlur={(event) => {
          onBlur?.(event);
          if (event.defaultPrevented) return;
          clearTimeout(blurTimer.current);
          blurTimer.current = setTimeout(() => setOpen(false), 120);
        }}
        onCompositionStart={(event) => {
          composing.current = true;
          onCompositionStart?.(event);
        }}
        onCompositionEnd={(event) => {
          composing.current = false;
          onCompositionEnd?.(event);
          if (!event.defaultPrevented) search(event.currentTarget.value);
        }}
        onClear={onClear}
        onChange={handleInput}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (!event.defaultPrevented) handleKeyDown(event);
        }}
      />
      {rendered && (
        <Teleport to="body">
          <Transition show={visible} name="k-select" nodeRef={dropdownRef} appear>
            <div
              ref={dropdownRef}
              id={listboxId}
              className={clsx("k-select-dropdown", "k-auto-complete-dropdown", {
                "k-select-dropdown-sm": size === "small",
                "k-select-dropdown-lg": size === "large",
              })}
              style={{
                left: position.left,
                top: position.top,
                minWidth: position.width,
                visibility: positioned ? undefined : "hidden",
                transformOrigin: position.origin,
              }}
              role="listbox"
            >
              {loading ? (
                <div className="k-select-loading">
                  <Icon type={Loading} spin />
                  <span>{loadingText || locale.k.select.loading}</span>
                </div>
              ) : (
                <ul>
                  {shownOptions.map((option, index) => (
                    <li
                      key={option.value}
                      id={`${listboxId}-option-${index}`}
                      role="option"
                      aria-selected={active === index}
                      aria-disabled={option.disabled || undefined}
                      className={clsx("k-select-item", {
                        "k-select-item-active": active === index,
                        "k-select-item-disabled": option.disabled,
                      })}
                      onMouseDown={(event) => event.preventDefault()}
                      onMouseEnter={() => !option.disabled && setActive(index)}
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
      )}
    </div>
  );
};
export default AutoComplete;
