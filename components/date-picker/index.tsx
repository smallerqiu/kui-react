import dayjs, { type Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localeData from "dayjs/plugin/localeData";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CircleX,
  Clock,
} from "kui-icons";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { ConfigContext } from "../config";
import type { DropPlacementsType, ShapeType, SizeType, ThemeType } from "../const/types";
import Icon, { type IconType } from "../icon";
import zhCN from "../locale/zh-CN";

dayjs.extend(customParseFormat);
dayjs.extend(localeData);

export type DatePickerValueType = "date" | "timestamp" | "unix" | "string";
export type DatePickerModeType =
  "year" | "month" | "date" | "time" | "dateTime" | "dateRange" | "dateTimeRange";
export type DatePickerInput = Date | Dayjs | string | number | null | undefined;
export interface DatePickerPreset {
  label: string;
  value: () => DatePickerInput | DatePickerInput[];
}

export interface DatePickerProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange" | "children"
> {
  value?: DatePickerInput | DatePickerInput[];
  modelValue?: DatePickerInput | DatePickerInput[];
  startDate?: DatePickerInput;
  endDate?: DatePickerInput;
  valueType?: DatePickerValueType;
  mode?: DatePickerModeType;
  presets?: DatePickerPreset[];
  disabled?: boolean;
  opened?: boolean;
  clearable?: boolean;
  editable?: boolean;
  placeholder?: string | string[];
  format?: string;
  disabledDate?: (date: Date) => boolean;
  disabledTime?: (date: Date) => boolean;
  size?: SizeType;
  dateIcon?: IconType[];
  theme?: ThemeType;
  shape?: ShapeType;
  bordered?: boolean;
  placement?: DropPlacementsType;
  header?:
    | ReactNode
    | ((api: { emit: (value: DatePickerInput | DatePickerInput[]) => void }) => ReactNode);
  footer?:
    | ReactNode
    | ((api: { emit: (value: DatePickerInput | DatePickerInput[]) => void }) => ReactNode);
  onChange?: (date: unknown | unknown[], dateStr: string | string[]) => void;
  onStartDateChange?: (value: unknown) => void;
  onEndDateChange?: (value: unknown) => void;
  onOpenChange?: (open: boolean) => void;
  onClear?: () => void;
}

const defaultFormat = (mode: DatePickerModeType) =>
  ({
    year: "YYYY",
    month: "YYYY-MM",
    date: "YYYY-MM-DD",
    time: "HH:mm:ss",
    dateTime: "YYYY-MM-DD HH:mm:ss",
    dateRange: "YYYY-MM-DD",
    dateTimeRange: "YYYY-MM-DD HH:mm:ss",
  })[mode];
const parse = (value: DatePickerInput, format: string) => {
  if (value === null || value === undefined || value === "") return null;
  const result = typeof value === "string" ? dayjs(value, format, true) : dayjs(value);
  return result.isValid() ? result : null;
};

export default function DatePicker({
  value,
  modelValue,
  startDate,
  endDate,
  valueType = "string",
  mode = "date",
  presets,
  disabled,
  opened,
  clearable = true,
  editable = true,
  placeholder = "",
  format,
  disabledDate = () => false,
  disabledTime = () => false,
  size,
  dateIcon = CalendarDays,
  theme = "fill",
  shape,
  bordered = true,
  placement = "bottom-left",
  header,
  footer,
  onChange,
  onStartDateChange,
  onEndDateChange,
  onOpenChange,
  onClear,
  className,
  style,
  ...rest
}: DatePickerProps) {
  const config = useContext(ConfigContext);
  const locale = config?.locale || zhCN;
  const fmt = format || defaultFormat(mode);
  const isRange = mode.endsWith("Range");
  const hasTime = mode === "time" || mode.includes("Time");
  const controlled = modelValue !== undefined ? modelValue : value;
  const initial = useMemo(() => {
    const source = controlled !== undefined ? controlled : isRange ? [startDate, endDate] : null;
    return (Array.isArray(source) ? source : source == null ? [] : [source])
      .map((item) => parse(item, fmt))
      .filter((item): item is Dayjs => !!item);
  }, [controlled, startDate, endDate, isRange, fmt]);
  const [inner, setInner] = useState<Dayjs[]>(initial);
  const values =
    controlled !== undefined || startDate !== undefined || endDate !== undefined ? initial : inner;
  const [visibleState, setVisibleState] = useState(!!opened);
  const visible = opened ?? visibleState;
  const [rendered, setRendered] = useState(!!opened);
  const [panelDate, setPanelDate] = useState(initial[0] ?? dayjs());
  const [view, setView] = useState<"date" | "month" | "year" | "time">(
    mode === "year" ? "year" : mode === "month" ? "month" : mode === "time" ? "time" : "date"
  );
  const [draft, setDraft] = useState<Dayjs[]>(initial);
  const [texts, setTexts] = useState<string[]>(initial.map((item) => item.format(fmt)));
  const rootRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ left: 0, top: 0, origin: "top" });

  useEffect(() => {
    setDraft(values);
    setTexts(values.map((item) => item.format(fmt)));
    if (values[0]) setPanelDate(values[0]);
  }, [controlled, startDate, endDate, fmt]);
  const setOpen = (next: boolean) => {
    if (opened === undefined) setVisibleState(next);
    setRendered(true);
    onOpenChange?.(next);
  };
  const updatePosition = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    const rect = root.getBoundingClientRect();
    const overlay = overlayRef.current;
    const above = placement.startsWith("top");
    const w = overlay?.offsetWidth ?? rect.width;
    const h = overlay?.offsetHeight ?? 0;
    let left = rect.left;
    if (placement.endsWith("right")) left = rect.right - w;
    else if (placement === "top" || placement === "bottom") left += (rect.width - w) / 2;
    setPosition({
      left: left + window.scrollX,
      top: (above ? rect.top - h : rect.bottom) + window.scrollY,
      origin: above ? "bottom" : "top",
    });
  }, [placement]);
  useEffect(() => {
    if (!visible) return;
    requestAnimationFrame(updatePosition);
    const outside = (event: globalThis.MouseEvent) => {
      const target = event.target as Node;
      if (!rootRef.current?.contains(target) && !overlayRef.current?.contains(target))
        setOpen(false);
    };
    document.addEventListener("mousedown", outside);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      document.removeEventListener("mousedown", outside);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [visible, updatePosition]);

  const output = (item: Dayjs) =>
    valueType === "date"
      ? item.toDate()
      : valueType === "timestamp"
        ? item.valueOf()
        : valueType === "unix"
          ? item.unix()
          : item.format(fmt);
  const commit = (next: Dayjs[]) => {
    if (controlled === undefined && startDate === undefined && endDate === undefined)
      setInner(next);
    setDraft(next);
    setTexts(next.map((item) => item.format(fmt)));
    const result = next.map(output);
    const strings = next.map((item) => item.format(fmt));
    onChange?.(isRange ? result : (result[0] ?? null), isRange ? strings : (strings[0] ?? ""));
    if (isRange) {
      onStartDateChange?.(result[0] ?? null);
      onEndDateChange?.(result[1] ?? null);
    }
  };
  const choose = (date: Dayjs) => {
    if (disabledDate(date.toDate()) || (hasTime && disabledTime(date.toDate()))) return;
    if (isRange) {
      if (draft.length !== 1) {
        setDraft([date]);
        setTexts([date.format(fmt), ""]);
      } else {
        const next = date.isBefore(draft[0]) ? [date, draft[0]] : [draft[0], date];
        commit(next);
        setOpen(false);
      }
    } else {
      commit([date]);
      if (!hasTime || mode === "time") setOpen(false);
    }
  };
  const emitExternal = (next: DatePickerInput | DatePickerInput[]) => {
    const list = (Array.isArray(next) ? next : [next])
      .map((item) => parse(item, fmt))
      .filter((item): item is Dayjs => !!item);
    if (list.length) commit(list);
  };
  const clear = (event: MouseEvent) => {
    event.stopPropagation();
    commit([]);
    setDraft([]);
    setTexts([]);
    onClear?.();
  };
  const edit = (text: string, index: number) => {
    const next = texts.slice();
    next[index] = text;
    setTexts(next);
  };
  const acceptInput = (index: number) => {
    const parsed = parse(texts[index], fmt);
    if (!parsed) {
      setTexts(values.map((item) => item.format(fmt)));
      return;
    }
    const next = values.slice();
    next[index] = parsed;
    if (!isRange || next.length === 2) commit(next);
  };

  const months = useMemo(() => dayjs.monthsShort(), [locale?.name]);
  const yearStart = Math.floor(panelDate.year() / 10) * 10 - 1;
  const calendar = useMemo(() => {
    const start = panelDate.startOf("month").startOf("week");
    return Array.from({ length: 42 }, (_, index) => start.add(index, "day"));
  }, [panelDate]);
  const nav = (amount: number, unit: "month" | "year") =>
    setPanelDate((current) => current.add(amount, unit));
  const headerNode = (
    <div className="k-picker-header">
      <Icon type={ChevronsLeft} onClick={() => nav(-1, "year")} />
      <Icon type={ChevronLeft} onClick={() => nav(-1, view === "date" ? "month" : "year")} />
      <span className="k-picker-header-label">
        <span onClick={() => setView("year")}>{panelDate.year()}</span>
        {view !== "year" && (
          <span className="k-picker-header-month-btn" onClick={() => setView("month")}>
            {months[panelDate.month()]}
          </span>
        )}
      </span>
      <Icon type={ChevronRight} onClick={() => nav(1, view === "date" ? "month" : "year")} />
      <Icon type={ChevronsRight} onClick={() => nav(1, "year")} />
    </div>
  );
  const yearPanel = (
    <div className="k-picker-body">
      <div className="k-picker-year-body">
        {Array.from({ length: 12 }, (_, index) => yearStart + index).map((year) => (
          <div
            key={year}
            className={["k-picker-year-item", panelDate.year() === year && "k-picker-year-selected"]
              .filter(Boolean)
              .join(" ")}
            onClick={() => {
              const date = panelDate.year(year);
              setPanelDate(date);
              if (mode === "year") choose(date);
              else setView("month");
            }}
          >
            {year}
          </div>
        ))}
      </div>
    </div>
  );
  const monthPanel = (
    <div className="k-picker-body">
      <div className="k-picker-month-body">
        {months.map((label, month) => (
          <div
            key={label}
            className={[
              "k-picker-month-item",
              panelDate.month() === month && "k-picker-month-selected",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => {
              const date = panelDate.month(month);
              setPanelDate(date);
              if (mode === "month") choose(date);
              else setView("date");
            }}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
  const datePanel = (
    <div className="k-picker-body">
      <div className="k-picker-weekdays">
        {dayjs.weekdaysMin().map((day) => (
          <span className="k-picker-weekday" key={day}>
            {day}
          </span>
        ))}
      </div>
      <div className="v-dp-table">
        {calendar.map((date) => {
          const selected = draft.some((item) => item.isSame(date, "day"));
          const inRange =
            draft.length === 2 && date.isAfter(draft[0], "day") && date.isBefore(draft[1], "day");
          const off = disabledDate(date.toDate());
          return (
            <div
              key={date.format("YYYY-MM-DD")}
              className={[
                "k-picker-day",
                !date.isSame(panelDate, "month") && "k-picker-day-out",
                date.isSame(dayjs(), "day") && "k-picker-is-today",
                selected && "k-picker-day-selected",
                inRange && "k-picker-day-in",
                draft[0]?.isSame(date, "day") && "k-picker-range-start",
                draft[1]?.isSame(date, "day") && "k-picker-range-end",
                off && "k-picker-day-disabled",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() =>
                choose(
                  date.hour(panelDate.hour()).minute(panelDate.minute()).second(panelDate.second())
                )
              }
            >
              {date.date()}
            </div>
          );
        })}
      </div>
    </div>
  );
  const timePanel = (
    <div className="k-picker-time-picker">
      {(["hour", "minute", "second"] as const).map((unit) => {
        const max = unit === "hour" ? 24 : 60;
        const selected = (draft[draft.length - 1] ?? panelDate)[unit]();
        return (
          <ul className="k-picker-time-col" key={unit}>
            {Array.from({ length: max }, (_, number) => {
              const candidate = (draft[draft.length - 1] ?? panelDate).set(unit, number);
              return (
                <li
                  key={number}
                  className={[
                    "k-picker-time-item",
                    number === selected && "k-picker-day-selected",
                    disabledTime(candidate.toDate()) && "k-picker-time-disabled",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => {
                    if (disabledTime(candidate.toDate())) return;
                    setPanelDate(candidate);
                    if (draft.length) {
                      const next = draft.slice();
                      next[next.length - 1] = candidate;
                      setDraft(next);
                    }
                  }}
                >
                  {String(number).padStart(2, "0")}
                </li>
              );
            })}
          </ul>
        );
      })}
    </div>
  );
  const panel =
    view === "year"
      ? yearPanel
      : view === "month"
        ? monthPanel
        : view === "time"
          ? timePanel
          : datePanel;
  const extra = (content: DatePickerProps["header"]) =>
    typeof content === "function" ? content({ emit: emitExternal }) : content;
  const overlay =
    rendered &&
    createPortal(
      <div
        ref={overlayRef}
        className={[
          "k-datepicker-overlay",
          isRange && "k-datepicker-range",
          hasTime && "k-datepicker-with-time",
        ]
          .filter(Boolean)
          .join(" ")}
        style={{
          display: visible ? undefined : "none",
          position: "absolute",
          zIndex: 1050,
          left: position.left,
          top: position.top,
          transformOrigin: position.origin,
        }}
      >
        {header && <div className="k-picker-extra-header">{extra(header)}</div>}
        <div className="k-picker-container">
          {presets?.length ? (
            <div className="k-picker-presets">
              {presets.map((preset) => (
                <div key={preset.label} onClick={() => emitExternal(preset.value())}>
                  {preset.label}
                </div>
              ))}
            </div>
          ) : null}
          <div>
            {view !== "time" && headerNode}
            {panel}
            {hasTime && mode !== "time" && (
              <div className="k-picker-footer">
                <span
                  className="k-picker-footer-time"
                  onClick={() => setView(view === "time" ? "date" : "time")}
                >
                  <Icon type={Clock} /> {view === "time" ? "Date" : "Time"}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (draft.length) {
                      commit(draft);
                      setOpen(false);
                    }
                  }}
                >
                  OK
                </button>
              </div>
            )}
          </div>
        </div>
        {footer && <div className="k-picker-extra-footer">{extra(footer)}</div>}
      </div>,
      document.body
    );
  const placeholders = Array.isArray(placeholder)
    ? placeholder
    : isRange
      ? [placeholder || "Start date", placeholder || "End date"]
      : [placeholder || locale?.k?.datePicker?.placeholder || "Select date"];
  const classes = [
    "k-datepicker",
    visible && "k-datepicker-opened",
    !bordered && "k-datepicker-borderless",
    size === "small" && "k-datepicker-sm",
    size === "large" && "k-datepicker-lg",
    disabled && "k-datepicker-disabled",
    theme === "fill" && "k-datepicker-fill",
    shape === "circle" && "k-datepicker-circle",
    shape === "square" && "k-datepicker-square",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <>
      <div {...rest} ref={rootRef} className={classes} style={style} tabIndex={disabled ? -1 : 0}>
        <div
          className={[
            "k-datepicker-selection",
            clearable && values.length && "k-datepicker-has-clear",
          ]
            .filter(Boolean)
            .join(" ")}
          onClick={() => !disabled && setOpen(!visible)}
        >
          {(isRange ? [0, 1] : [0]).map((index) => (
            <span key={index}>
              <input
                className="k-datepicker-input"
                value={texts[index] ?? ""}
                placeholder={placeholders[index]}
                readOnly={!editable || disabled}
                onClick={(event) => event.stopPropagation()}
                onFocus={() => !disabled && setOpen(true)}
                onChange={(event) => edit(event.target.value, index)}
                onBlur={() => acceptInput(index)}
              />
              {isRange && index === 0 && <span className="k-datepicker-separator">—</span>}
            </span>
          ))}
          <Icon type={dateIcon} className="k-icon-calendar" strokeWidth={1.5} />
          {clearable && !disabled && values.length > 0 && (
            <Icon type={CircleX} className="k-icon-clean" onClick={clear} />
          )}
        </div>
      </div>
      {overlay}
    </>
  );
}
