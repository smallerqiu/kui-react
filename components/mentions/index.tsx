import clsx from "clsx";
import { CircleX } from "kui-icons";
import React, { useEffect, useEffectEvent, useMemo, useRef, useState } from "react";
import Teleport from "../base/teleport";
import Transition from "../base/transition";
import type { DropPlacementsType, ShapeType, SizeType, ThemeType } from "../const/types";
import Empty from "../empty";
import Icon from "../icon";
import { TextArea } from "../input";
import { setPlacement } from "../utils/placement";

export interface MentionOption {
  value: string;
  label?: React.ReactNode;
  disabled?: boolean;
}
export interface MentionsProps extends Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "size" | "value" | "defaultValue" | "onChange" | "onSelect"
> {
  value?: string;
  defaultValue?: string;
  options?: Array<string | MentionOption>;
  triggers?: string[];
  rows?: number;
  placement?: DropPlacementsType;
  size?: SizeType;
  shape?: ShapeType;
  theme?: ThemeType;
  emptyText?: string;
  loading?: boolean;
  loadingText?: string;
  /** 是否显示清除按钮，与 kui-vue `mentions/index.tsx:37` 一致，默认开启 */
  clearable?: boolean;
  filterOption?: (query: string, option: MentionOption) => boolean;
  onChange?: (value: string) => void;
  onSearch?: (query: string) => void;
  onSelect?: (option: MentionOption, trigger: string) => void;
  onClear?: () => void;
}
type Query = { start: number; trigger: string; text: string };
const caretPosition = (element: HTMLTextAreaElement) => {
  const style = getComputedStyle(element);
  const rect = element.getBoundingClientRect();
  const mirror = document.createElement("div");
  Object.assign(mirror.style, {
    position: "fixed",
    visibility: "hidden",
    overflow: "hidden",
    whiteSpace: "pre-wrap",
    overflowWrap: "break-word",
    width: `${rect.width}px`,
    left: `${rect.left - element.scrollLeft}px`,
    top: `${rect.top - element.scrollTop}px`,
    boxSizing: style.boxSizing,
    padding: style.padding,
    border: style.border,
    font: style.font,
    lineHeight: style.lineHeight,
    letterSpacing: style.letterSpacing,
  });
  mirror.textContent = element.value.slice(0, element.selectionStart);
  const marker = document.createElement("span");
  marker.textContent = "\u200b";
  mirror.append(marker);
  document.body.append(mirror);
  const markerRect = marker.getBoundingClientRect();
  mirror.remove();
  return markerRect;
};
const Mentions: React.FC<MentionsProps> = ({
  value,
  defaultValue = "",
  options = [],
  triggers = ["@"],
  rows = 2,
  placement = "bottom-left",
  size,
  shape,
  theme = "fill",
  emptyText,
  loading = false,
  loadingText = "Searching",
  clearable = true,
  filterOption,
  onChange,
  onSearch,
  onSelect,
  onClear,
  className,
  disabled,
  ...rest
}) => {
  const [inner, setInner] = useState(defaultValue);
  const [query, setQuery] = useState<Query | null>(null);
  const [active, setActive] = useState(0);
  const [shown, setShown] = useState<MentionOption[]>([]);
  const [position, setPosition] = useState({ left: 0, top: 0, origin: "left top", width: 260 });
  const rootRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const placementRef = useRef<string>(placement);
  const originRef = useRef("left top");
  const topRef = useRef(0);
  const leftRef = useRef(0);
  const current = value ?? inner;
  const normalized = useMemo(
    () => options.map((item) => (typeof item === "string" ? { value: item, label: item } : item)),
    [options],
  );
  const getMatches = (state: Query) =>
    normalized.filter((option) =>
      filterOption
        ? filterOption(state.text, option)
        : option.value.toLocaleLowerCase().includes(state.text.toLocaleLowerCase()),
    );
  const updatePosition = () => {
    if (!query || !textareaRef.current || !dropdownRef.current) return;
    const rect = caretPosition(textareaRef.current);
    placementRef.current = placement;
    setPlacement({
      refSelection: rootRef,
      refPopper: dropdownRef,
      currentPlacement: placementRef,
      transOrigin: originRef,
      top: topRef,
      left: leftRef,
      position: { x: rect.left, y: rect.bottom },
      offset: 4,
    });
    setPosition({
      left: leftRef.current,
      top: topRef.current,
      origin: originRef.current,
      width: Math.min(260, rootRef.current?.offsetWidth || 260),
    });
  };
  const updateQuery = (text: string, caret: number) => {
    const prefix = text.slice(0, caret);
    let found: Query | null = null;
    triggers.forEach((trigger) => {
      const start = prefix.lastIndexOf(trigger);
      if (
        start >= 0 &&
        !/\s/.test(prefix.slice(start + trigger.length)) &&
        (!found || start > found.start)
      )
        found = { start, trigger, text: prefix.slice(start + trigger.length) };
    });
    const nextQuery = found as Query | null;
    setQuery(nextQuery);
    setActive(0);
    if (nextQuery) {
      setShown(getMatches(nextQuery));
      onSearch?.(nextQuery.text);
    }
  };
  const positionDropdown = useEffectEvent(updatePosition);
  useEffect(() => {
    if (!query) return;
    const frame = requestAnimationFrame(positionDropdown);
    const update = () => requestAnimationFrame(positionDropdown);
    window.addEventListener("resize", update);
    document.addEventListener("scroll", update, true);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", update);
      document.removeEventListener("scroll", update, true);
    };
  }, [query, shown, placement]);
  const setValue = (next: string) => {
    if (value === undefined) setInner(next);
    onChange?.(next);
  };
  const clear = () => {
    setValue("");
    setQuery(null);
    onClear?.();
    textareaRef.current?.focus();
  };
  const choose = (option: MentionOption) => {
    const textarea = textareaRef.current;
    if (!query || option.disabled || !textarea) return;
    const state = query;
    const caret = textarea.selectionStart;
    setValue(
      `${current.slice(0, state.start)}${state.trigger}${option.value} ${current.slice(caret)}`,
    );
    setQuery(null);
    onSelect?.(option, state.trigger);
    requestAnimationFrame(() => {
      const at = state.start + state.trigger.length + option.value.length + 1;
      textarea.focus();
      textarea.setSelectionRange(at, at);
    });
  };
  return (
    <div
      ref={rootRef}
      className={clsx("k-mentions", className, {
        "k-mentions-has-clear": clearable && !!current && !disabled,
      })}
    >
      <TextArea
        {...rest}
        ref={textareaRef}
        value={current}
        rows={rows}
        size={size}
        shape={shape}
        theme={theme}
        onChange={(text) => {
          setValue(text);
          if (textareaRef.current) updateQuery(text, textareaRef.current.selectionStart);
        }}
        onClick={() =>
          textareaRef.current && updateQuery(current, textareaRef.current.selectionStart)
        }
        onKeyDown={(event) => {
          if (!query) return;
          if ((event.key === "ArrowDown" || event.key === "ArrowUp") && shown.length) {
            setActive(
              (active + (event.key === "ArrowDown" ? 1 : -1) + shown.length) % shown.length,
            );
            event.preventDefault();
          } else if (event.key === "Enter" && shown.length) {
            choose(shown[active]);
            event.preventDefault();
          } else if (event.key === "Escape") setQuery(null);
        }}
      />
      {clearable && current && !disabled && (
        <Icon className="k-mentions-clearable" type={CircleX} onClick={clear} />
      )}
      <Teleport to="body">
        <Transition show={!!query} name="k-select" nodeRef={dropdownRef}>
          <div
            ref={dropdownRef}
            className={clsx("k-select-dropdown", "k-mentions-dropdown", {
              "k-select-dropdown-sm": size === "small",
            })}
            style={{
              left: position.left,
              top: position.top,
              width: position.width,
              transformOrigin: position.origin,
            }}
            role="listbox"
          >
            {loading ? (
              <div className="k-mentions-loading">{loadingText}</div>
            ) : shown.length ? (
              <ul>
                {shown.map((option, index) => (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={active === index}
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
            ) : (
              <Empty description={emptyText} />
            )}
          </div>
        </Transition>
      </Teleport>
    </div>
  );
};
export default Mentions;
