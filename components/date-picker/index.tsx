import clsx from "clsx";
import dayjs, { type Dayjs, type UnitType } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import localeData from "dayjs/plugin/localeData.js";
import isBetween from "dayjs/plugin/isBetween.js";
import {
  ArrowRight,
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
import Teleport from "../base/teleport";
import Transition from "../base/transition";
import { Button } from "../button";
import { ConfigContext } from "../config/config-context";
import type { DropPlacementsType, ShapeType, SizeType, ThemeType } from "../const/types";
import Icon, { type IconType } from "../icon";
import zhCN from "../locale/zh-CN";
import { setPlacement } from "../utils/placement";

dayjs.extend(customParseFormat);
dayjs.extend(localeData);
dayjs.extend(isBetween);

export type DatePickerValueType = "date" | "timestamp" | "unix" | "string";
export type DatePickerModeType =
  "year" | "month" | "date" | "time" | "dateTime" | "dateRange" | "dateTimeRange";
export type DatePickerInput = Date | Dayjs | string | number | null | undefined;
export type DatePickerOutput = Date | string | number | null;
export interface DatePickerPreset {
  label: string;
  value: () => DatePickerInput | DatePickerInput[];
}

export interface DatePickerProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange" | "children" | "defaultValue"
> {
  value?: DatePickerInput | DatePickerInput[];
  defaultValue?: DatePickerInput | DatePickerInput[];
  startDate?: DatePickerInput;
  endDate?: DatePickerInput;
  valueType?: DatePickerValueType;
  mode?: DatePickerModeType;
  presets?: DatePickerPreset[];
  disabled?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
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
  onChange?: (date: DatePickerOutput | DatePickerOutput[], dateStr: string | string[]) => void;
  onStartDateChange?: (value: DatePickerOutput) => void;
  onEndDateChange?: (value: DatePickerOutput) => void;
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
const parse = (value: DatePickerInput, format: string, valueType: DatePickerValueType) => {
  if (value === null || value === undefined || value === "") return null;
  const result =
    valueType === "unix"
      ? dayjs.unix(Number(value))
      : typeof value === "string"
        ? dayjs(value, format, true)
        : dayjs(value);
  return result.isValid() ? result : null;
};

export default function DatePicker({
  value,
  defaultValue,
  startDate,
  endDate,
  valueType = "string",
  mode = "date",
  presets,
  disabled,
  open,
  defaultOpen = false,
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
  const localeName = locale?.name || "zh-cn";
  const fmt = format || defaultFormat(mode);
  const isRange = mode.endsWith("Range");
  const hasTime = mode === "time" || mode.includes("Time");
  const controlled = value;
  const initial = useMemo(() => {
    const source =
      controlled !== undefined
        ? controlled
        : defaultValue !== undefined
          ? defaultValue
          : isRange
            ? [startDate, endDate]
            : null;
    return (Array.isArray(source) ? source : source == null ? [] : [source])
      .map((item) => parse(item, fmt, valueType))
      .filter((item): item is Dayjs => !!item);
  }, [controlled, defaultValue, startDate, endDate, isRange, fmt, valueType]);
  const [inner, setInner] = useState<Dayjs[]>(initial);
  const values =
    controlled !== undefined || startDate !== undefined || endDate !== undefined ? initial : inner;
  const [visibleState, setVisibleState] = useState(defaultOpen);
  const visible = open ?? visibleState;
  const [rendered, setRendered] = useState(open ?? defaultOpen);
  const [panelDate, setPanelDate] = useState(initial[0] ?? dayjs());
  const [view, setView] = useState<"date" | "month" | "year" | "time">(
    mode === "year" ? "year" : mode === "month" ? "month" : mode === "time" ? "time" : "date"
  );
  const [draft, setDraft] = useState<Dayjs[]>(initial);
  const [hoverDate, setHoverDate] = useState<Dayjs | null>(null);
  const [timeEditSide, setTimeEditSide] = useState<"start" | "end">("start");
  const [texts, setTexts] = useState<string[]>(initial.map((item) => item.format(fmt)));
  const [syncedValues, setSyncedValues] = useState(values);
  const [syncedFormat, setSyncedFormat] = useState(fmt);
  if (syncedValues !== values || syncedFormat !== fmt) {
    setSyncedValues(values);
    setSyncedFormat(fmt);
    setDraft(values);
    setTexts(values.map((item) => item.format(fmt)));
    if (values[0]) setPanelDate(values[0]);
  }
  const rootRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ left: 0, top: 0, origin: "left top" });
  const [currentPlacement, setCurrentPlacement] = useState<DropPlacementsType>(placement);
  const placementRef = useRef<string>(placement);
  const transOriginRef = useRef("left top");
  const topRef = useRef(0);
  const leftRef = useRef(0);
  const timeColRefs = useRef<Partial<Record<UnitType, HTMLUListElement | null>>>({});

  const setOpen = useCallback((next: boolean) => {
    if (open === undefined) setVisibleState(next);
    setRendered(true);
    onOpenChange?.(next);
  }, [onOpenChange, open]);
  const updatePosition = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    const overlay = overlayRef.current;
    if (!overlay) return;
    placementRef.current = placement;
    setPlacement({
      refSelection: rootRef,
      refPopper: overlayRef,
      currentPlacement: placementRef,
      transOrigin: transOriginRef,
      top: topRef,
      left: leftRef,
    });
    setCurrentPlacement(placementRef.current as DropPlacementsType);
    setPosition({ left: leftRef.current, top: topRef.current, origin: transOriginRef.current });
  }, [placement]);
  useEffect(() => {
    if (!visible) return;
    requestAnimationFrame(updatePosition);
    const outside = (event: globalThis.MouseEvent) => {
      const target = event.target as Node;
      if (!rootRef.current?.contains(target) && !overlayRef.current?.contains(target)) {
        if (isRange && draft.length === 1) {
          setDraft(values);
          setTexts(values.map((item) => item.format(fmt)));
        }
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", outside);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      document.removeEventListener("mousedown", outside);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [visible, updatePosition, isRange, draft, values, fmt, setOpen]);

  const output = (item: Dayjs) =>
    valueType === "date"
      ? item.toDate()
      : valueType === "timestamp"
        ? item.valueOf()
        : valueType === "unix"
          ? item.unix()
          : item.format(fmt);
  const commit = (next: Dayjs[], closePanel = false) => {
    if (isRange && next.length === 2 && next[1].isBefore(next[0])) next = [next[1], next[0]];
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
    if (closePanel) setOpen(false);
  };
  const choose = (date: Dayjs) => {
    if (disabledDate(date.toDate()) || (hasTime && disabledTime(date.toDate()))) return;
    if (isRange) {
      if (draft.length !== 1) {
        const start = date.startOf("day");
        setDraft([start]);
        setTexts([start.format(fmt), ""]);
      } else {
        const start = date.isBefore(draft[0]) ? date.startOf("day") : draft[0];
        const end = (date.isBefore(draft[0]) ? draft[0] : date).endOf("day");
        commit([start, end], mode !== "dateTimeRange");
      }
    } else {
      if (mode === "dateTime") {
        const old = draft[0] ?? dayjs();
        commit([date.hour(old.hour()).minute(old.minute()).second(old.second())]);
      } else commit([date], true);
    }
  };
  const emitExternal = (next: DatePickerInput | DatePickerInput[]) => {
    const list = (Array.isArray(next) ? next : [next])
      .map((item) => parse(item, fmt, valueType))
      .filter((item): item is Dayjs => !!item);
    if (list.length) commit(list, true);
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
    const parsed = dayjs(text, fmt, localeName, true);
    if (parsed.isValid()) {
      const nextDraft = draft.slice();
      nextDraft[index] = parsed;
      setPanelDate(parsed);
      if (!isRange || (nextDraft[0] && nextDraft[1])) commit(nextDraft);
    } else if (!text && !isRange) commit([]);
  };
  const acceptInput = (index: number) => {
    const parsed = parse(texts[index], fmt, valueType);
    if (!parsed) {
      setTexts(values.map((item) => item.format(fmt)));
      return;
    }
    const next = values.slice();
    next[index] = parsed;
    if (!isRange || next.length === 2) commit(next);
  };

  const localeInfo = useMemo(() => dayjs().locale(localeName).localeData(), [localeName]);
  const months = useMemo(() => localeInfo.monthsShort(), [localeInfo]);
  const isYearFirst = ["zh", "ja", "ko"].some((name) => localeName.toLowerCase().includes(name));
  const yearStart = Math.floor(panelDate.year() / 10) * 10 - 1;
  const calendar = useMemo(() => {
    const startOfMonth = panelDate.startOf("month");
    const diff = (startOfMonth.day() - localeInfo.firstDayOfWeek() + 7) % 7;
    const start = startOfMonth.subtract(diff, "day");
    return Array.from({ length: 42 }, (_, index) => start.add(index, "day"));
  }, [panelDate, localeInfo]);
  const nav = (amount: number, unit: "month" | "year") =>
    setPanelDate((current) => current.add(amount, unit));
  const headerNode = (
    <div className="k-picker-header">
      <Button icon={ChevronsLeft} type="text" onClick={() => nav(-10, "year")} />
      {mode !== "year" && (
        <Button icon={ChevronLeft} type="text" onClick={() => nav(-1, "month")} />
      )}
      <span className="k-picker-header-label">
        {isYearFirst && (
          <span onClick={() => setView("year")}>
            {panelDate.year()}
            {locale?.k?.datePicker?.year}
          </span>
        )}
        {mode !== "year" && (
          <span className="k-picker-header-month-btn" onClick={() => setView("month")}>
            {panelDate.locale(localeName).format("MMM")}
          </span>
        )}
        {!isYearFirst && (
          <span onClick={() => setView("year")}>
            {panelDate.year()}
            {locale?.k?.datePicker?.year}
          </span>
        )}
      </span>
      {mode !== "year" && (
        <Button icon={ChevronRight} type="text" onClick={() => nav(1, "month")} />
      )}
      <Button icon={ChevronsRight} type="text" onClick={() => nav(10, "year")} />
    </div>
  );
  const yearPanel = (
    <div className="k-picker-body">
      <div className="k-picker-year-body">
        {Array.from({ length: 12 }, (_, index) => yearStart + index).map((year) => (
          <div
            key={year}
            className={clsx("k-picker-year-item", {
              "k-picker-year-selected": panelDate.year() === year,
            })}
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
            className={clsx("k-picker-month-item", {
              "k-picker-month-selected": panelDate.month() === month,
            })}
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
        {[
          ...localeInfo.weekdaysMin().slice(localeInfo.firstDayOfWeek()),
          ...localeInfo.weekdaysMin().slice(0, localeInfo.firstDayOfWeek()),
        ].map((day) => (
          <span className="k-picker-weekday" key={day}>
            {day}
          </span>
        ))}
      </div>
      <div className="v-dp-table" onMouseLeave={() => setHoverDate(null)}>
        {calendar.map((date) => {
          const selected = draft.some((item) => item.isSame(date, "day"));
          const rangeEnd = draft[1] ?? hoverDate;
          const inRange = !!(
            isRange &&
            draft[0] &&
            rangeEnd &&
            date.isBetween(
              draft[0].isBefore(rangeEnd) ? draft[0] : rangeEnd,
              draft[0].isBefore(rangeEnd) ? rangeEnd : draft[0],
              "day",
              "[]"
            )
          );
          const off = disabledDate(date.toDate());
          return (
            <div
              key={date.format("YYYY-MM-DD")}
              className={clsx("k-picker-day", {
                "k-picker-day-out": !date.isSame(panelDate, "month"),
                "k-picker-is-today": date.isSame(dayjs(), "day"),
                "k-picker-day-selected": selected,
                "k-picker-day-in": inRange && !selected,
                "k-picker-range-start": draft[0]?.isSame(date, "day"),
                "k-picker-range-end": draft[1]?.isSame(date, "day"),
                "k-picker-day-disabled": off,
              })}
              onClick={() =>
                choose(
                  date.hour(panelDate.hour()).minute(panelDate.minute()).second(panelDate.second())
                )
              }
              onMouseEnter={() => isRange && setHoverDate(date)}
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
        const rangeIndex = timeEditSide === "start" ? 0 : 1;
        const active = (mode === "dateTimeRange" ? draft[rangeIndex] : draft[0]) ?? panelDate;
        const selected = active[unit]();
        return (
          <ul
            className="k-picker-time-col"
            key={unit}
            ref={(node) => {
              timeColRefs.current[unit] = node;
            }}
          >
            {Array.from({ length: max }, (_, number) => {
              const candidate = active.set(unit, number);
              return (
                <li
                  key={number}
                  className={clsx("k-picker-time-item", {
                    active: number === selected,
                    "k-picker-time-disabled": disabledTime(candidate.toDate()),
                  })}
                  onClick={() => {
                    if (disabledTime(candidate.toDate())) return;
                    const next = draft.slice();
                    if (mode === "dateTimeRange") next[rangeIndex] = candidate;
                    else next[0] = candidate;
                    setPanelDate(candidate);
                    commit(next);
                    timeColRefs.current[unit]?.scrollTo({
                      top: number * 32 + 16,
                      behavior: "smooth",
                    });
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
  useEffect(() => {
    if (!visible || view !== "time") return;
    const index = mode === "dateTimeRange" && timeEditSide === "end" ? 1 : 0;
    const active = draft[index] ?? panelDate;
    requestAnimationFrame(() => {
      (["hour", "minute", "second"] as const).forEach((unit) => {
        timeColRefs.current[unit]?.scrollTo({ top: active[unit]() * 32 + 16 });
      });
    });
  }, [visible, view, timeEditSide, draft, mode, panelDate]);
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
  const overlay = rendered && (
    <Teleport to="body">
      <Transition show={visible} name="k-date-picker" nodeRef={overlayRef}>
        <div
          ref={overlayRef}
          className={clsx("k-datepicker-overlay", {
            "k-datepicker-range": isRange,
            "k-datepicker-with-time": hasTime,
          })}
          {...({ mode, "k-placement": currentPlacement } as Record<string, string>)}
          style={{
            position: "absolute",
            zIndex: 1050,
            left: position.left,
            top: position.top,
            transformOrigin: position.origin,
          }}
        >
          {presets?.length ? (
            <div className="k-picker-presets">
              {presets.map((preset) => (
                <Button
                  key={preset.label}
                  size="small"
                  onClick={() => emitExternal(preset.value())}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          ) : null}
          <div className="k-picker-container">
            {header && <div className="k-picker-extra-header">{extra(header)}</div>}
            {view !== "time" && headerNode}
            {panel}
            {hasTime && mode !== "time" && (
              <div className="k-picker-footer">
                {mode === "dateTimeRange" ? (
                  <>
                    <span
                      className={clsx("k-picker-footer-time", {
                        active: view === "time" && timeEditSide === "start",
                      })}
                      onClick={() => {
                        setTimeEditSide("start");
                        setView(view === "time" && timeEditSide === "start" ? "date" : "time");
                      }}
                    >
                      {draft[0]?.format("HH:mm:ss") ?? "--:--:--"}
                    </span>
                    <span className="k-picker-footer-time-split">
                      <Icon type={ArrowRight} />
                    </span>
                    <span
                      className={clsx("k-picker-footer-time", {
                        active: view === "time" && timeEditSide === "end",
                      })}
                      onClick={() => {
                        setTimeEditSide("end");
                        setView(view === "time" && timeEditSide === "end" ? "date" : "time");
                      }}
                    >
                      {draft[1]?.format("HH:mm:ss") ?? "--:--:--"}
                    </span>
                  </>
                ) : (
                  <span
                    className={clsx("k-picker-footer-time", { active: view === "time" })}
                    onClick={() => setView(view === "time" ? "date" : "time")}
                  >
                    {(draft[0] ?? dayjs()).format("HH:mm:ss")}
                  </span>
                )}
              </div>
            )}
            {footer && <div className="k-picker-extra-footer">{extra(footer)}</div>}
          </div>
        </div>
      </Transition>
    </Teleport>
  );
  const datePickerPlaceholders: Record<DatePickerModeType, string> = {
    year: locale.k.datePicker.selectYear,
    month: locale.k.datePicker.selectMonth,
    date: locale.k.datePicker.selectDate,
    dateTime: locale.k.datePicker.selectDate,
    time: locale.k.datePicker.selectTime,
    dateRange: locale.k.datePicker.selectDate,
    dateTimeRange: locale.k.datePicker.selectDate,
  };
  const customPlaceholders = Array.isArray(placeholder)
    ? placeholder
    : [placeholder, placeholder];
  const placeholders = isRange
    ? [
        customPlaceholders[0] || locale.k.datePicker.startDate,
        customPlaceholders[1] || locale.k.datePicker.endDate,
      ]
    : [customPlaceholders[0] || datePickerPlaceholders[mode]];
  const inputSize = Math.max(10, fmt.length);
  const classes = clsx(
    "k-datepicker",
    {
      "k-datepicker-opened": visible,
      "k-datepicker-borderless": !bordered || theme === "plain",
      "k-datepicker-sm": size === "small",
      "k-datepicker-lg": size === "large",
      "k-datepicker-disabled": disabled,
      "k-datepicker-fill": theme === "fill",
      "k-datepicker-circle": shape === "circle",
      "k-datepicker-square": shape === "square",
    },
    className
  );
  return (
    <>
      <div {...rest} ref={rootRef} className={classes} style={style} tabIndex={disabled ? -1 : 0}>
        <div
          className={clsx("k-datepicker-selection", {
            "k-datepicker-has-clear": clearable && values.length,
          })}
          onClick={() => !disabled && setOpen(!visible)}
        >
          {isRange ? (
            <>
              <input
                className="k-datepicker-input"
                size={inputSize}
                value={texts[0] ?? ""}
                placeholder={placeholders[0]}
                readOnly={!editable || disabled}
                onClick={(event) => {
                  event.stopPropagation();
                  setTimeEditSide("start");
                }}
                onFocus={() => !disabled && setOpen(true)}
                onChange={(event) => edit(event.target.value, 0)}
                onBlur={() => acceptInput(0)}
              />
              <span className="k-datepicker-separator">
                <Icon type={ArrowRight} />
              </span>
              <input
                className="k-datepicker-input"
                size={inputSize}
                value={texts[1] ?? ""}
                placeholder={placeholders[1]}
                readOnly={!editable || disabled}
                onClick={(event) => {
                  event.stopPropagation();
                  setTimeEditSide("end");
                }}
                onFocus={() => !disabled && setOpen(true)}
                onChange={(event) => edit(event.target.value, 1)}
                onBlur={() => acceptInput(1)}
              />
            </>
          ) : (
            <input
              className="k-datepicker-input"
              size={inputSize}
              value={texts[0] ?? ""}
              placeholder={placeholders[0]}
              readOnly={!editable || disabled}
              onClick={(event) => event.stopPropagation()}
              onFocus={() => !disabled && setOpen(true)}
              onChange={(event) => edit(event.target.value, 0)}
              onBlur={() => acceptInput(0)}
            />
          )}
          <Icon
            type={mode === "time" ? Clock : dateIcon}
            className="k-icon-calendar"
            strokeWidth={1.5}
          />
          {clearable && !disabled && values.length > 0 && (
            <Icon type={CircleX} className="k-icon-clean" onClick={clear} />
          )}
        </div>
      </div>
      {overlay}
    </>
  );
}
