import { useValue } from "../utils/use-value";
import { useConfigAppearance } from "../config/use-config-appearance";
import clsx from "clsx";
import { createFormFieldComponent } from "../form/field-context";
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
  type ReactNode,
  type SetStateAction,
} from "react";
import Popup from "../base/popup";
import { Button } from "../button";
import { ConfigContext } from "../config/config-context";
import type { DropPlacementsType, ShapeType, SizeType, ThemeType } from "../const/types";
import Icon, { type IconType } from "../icon";
import zhCN from "../locale/zh-CN";

dayjs.extend(customParseFormat);
dayjs.extend(localeData);
dayjs.extend(isBetween);

function centerTimeItem(
  column: HTMLUListElement | null | undefined,
  index: number,
  behavior: ScrollBehavior = "auto",
) {
  const item = column?.children.item(index);
  if (!column || !(item instanceof HTMLElement)) return;
  const top = item.offsetTop - (column.clientHeight - item.offsetHeight) / 2;
  column.scrollTo({ top, behavior });
}

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
  startDate?: DatePickerInput;
  endDate?: DatePickerInput;
  valueType?: DatePickerValueType;
  mode?: DatePickerModeType;
  presets?: DatePickerPreset[];
  disabled?: boolean;
  readOnly?: boolean;
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
  /** Render only the picker panel without a trigger or portal. */
  panelOnly?: boolean;
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

function DatePicker({
  value,
  startDate,
  endDate,
  valueType = "string",
  mode = "date",
  presets,
  disabled,
  readOnly,
  open,
  defaultOpen = false,
  clearable = true,
  editable = true,
  placeholder = "",
  format,
  disabledDate = () => false,
  disabledTime = () => false,
  size: sizeProp,
  dateIcon = CalendarDays,
  theme: themeProp,
  shape: shapeProp,
  bordered = true,
  placement = "bottom-left",
  header,
  footer,
  onChange,
  onStartDateChange,
  onEndDateChange,
  onOpenChange,
  onClear,
  panelOnly = false,
  className,
  style,
  ...rest
}: DatePickerProps) {
  const inheritedAppearance = useConfigAppearance();
  const size = sizeProp ?? inheritedAppearance.size;
  const theme = themeProp ?? inheritedAppearance.theme ?? "fill";
  const shape = shapeProp ?? inheritedAppearance.shape;
  const config = useContext(ConfigContext);
  const locale = config?.locale || zhCN;
  const localeName = locale?.name || "zh-cn";
  const fmt = format || defaultFormat(mode);
  const isRange = mode.endsWith("Range");
  const hasTime = mode === "time" || mode.includes("Time");
  const parsedSource = useMemo(() => {
    const source = value !== undefined ? value : isRange ? [startDate, endDate] : null;
    return (Array.isArray(source) ? source : source == null ? [] : [source]).map((item) =>
      parse(item, fmt, valueType),
    );
  }, [value, startDate, endDate, isRange, fmt, valueType]);
  const initial = useMemo(
    () =>
      isRange && parsedSource.some((item) => !item)
        ? []
        : parsedSource.filter((item): item is Dayjs => !!item),
    [isRange, parsedSource],
  );
  const [inner, setInner] = useValue(initial, (next) => next);
  const rangeControlled = value === undefined && (startDate !== undefined || endDate !== undefined);
  const values = rangeControlled ? initial : inner;
  const [visibleState, setVisibleState] = useState(defaultOpen || panelOnly);
  const visible = panelOnly || (open ?? visibleState);
  const syncSignature = `${fmt}:${parsedSource.map((item) => item?.valueOf() ?? "null").join(",")}`;
  const [panelState, setPanelState] = useState({
    signature: syncSignature,
    value: initial[0] ?? dayjs(),
  });
  const panelDate =
    panelState.signature === syncSignature ? panelState.value : (values[0] ?? panelState.value);
  const setPanelDate = (action: SetStateAction<Dayjs>) => {
    setPanelState((previous) => {
      const current =
        previous.signature === syncSignature ? previous.value : (values[0] ?? previous.value);
      return {
        signature: syncSignature,
        value: typeof action === "function" ? action(current) : action,
      };
    });
  };
  const [view, setView] = useState<"date" | "month" | "year" | "time">(
    mode === "year" ? "year" : mode === "month" ? "month" : mode === "time" ? "time" : "date",
  );
  const [draftState, setDraftState] = useState({ signature: syncSignature, value: initial });
  const draft = draftState.signature === syncSignature ? draftState.value : values;
  const setDraft = useCallback(
    (next: Dayjs[]) => setDraftState({ signature: syncSignature, value: next }),
    [syncSignature],
  );
  const [hoverDate, setHoverDate] = useState<Dayjs | null>(null);
  const [timeEditSide, setTimeEditSide] = useState<"start" | "end">("start");
  const formattedValues = (isRange ? parsedSource : values).map((item) => item?.format(fmt) ?? "");
  const [textState, setTextState] = useState({
    signature: syncSignature,
    value: formattedValues,
  });
  const texts = textState.signature === syncSignature ? textState.value : formattedValues;
  const setTexts = useCallback(
    (next: string[]) => setTextState({ signature: syncSignature, value: next }),
    [syncSignature],
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const timeColRefs = useRef<Partial<Record<UnitType, HTMLUListElement | null>>>({});
  const draftRef = useRef(draft);
  const panelDateRef = useRef(panelDate);
  useEffect(() => {
    draftRef.current = draft;
    panelDateRef.current = panelDate;
  }, [draft, panelDate]);

  const setOpen = useCallback(
    (next: boolean) => {
      if (panelOnly) return;
      if (open === undefined) setVisibleState(next);

      onOpenChange?.(next);
    },
    [onOpenChange, open, panelOnly],
  );
  const closePopup = () => {
    if (isRange && draft.length === 1) {
      setDraft(values);
      setTexts(values.map((item) => item.format(fmt)));
    }
    setOpen(false);
  };

  const output = (item: Dayjs) =>
    valueType === "date"
      ? item.toDate()
      : valueType === "timestamp"
        ? item.valueOf()
        : valueType === "unix"
          ? item.unix()
          : item.format(fmt);
  const isValueDisabled = (item: Dayjs) =>
    disabledDate(item.toDate()) || (hasTime && disabledTime(item.toDate()));
  const commit = (next: Dayjs[], closePanel = false) => {
    if (disabled || readOnly) return;
    if (next.some(isValueDisabled)) return;
    if (isRange && next.length === 2 && next[1].isBefore(next[0])) next = [next[1], next[0]];
    if (!rangeControlled) setInner(next);
    setDraft(rangeControlled ? values : next);
    setTexts(rangeControlled ? formattedValues : next.map((item) => item.format(fmt)));
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
    if (disabled || readOnly) return;
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
  const clear = (event: React.SyntheticEvent) => {
    if (disabled || readOnly) return;
    event.stopPropagation();
    commit([]);
    onClear?.();
  };
  const edit = (text: string, index: number) => {
    if (disabled || readOnly) return;
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
    if (!parsed || isValueDisabled(parsed)) {
      setTexts(formattedValues);
      return;
    }
    if (!isRange) {
      commit([parsed]);
      return;
    }
    const next = texts.map((text, position) =>
      position === index ? parsed : parse(text, fmt, valueType),
    );
    if (next[0] && next[1]) commit(next as Dayjs[]);
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
      <div className="k-picker-date-grid" role="grid" onMouseLeave={() => setHoverDate(null)}>
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
              "[]",
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
              role="gridcell"
              tabIndex={off ? -1 : 0}
              aria-selected={selected || undefined}
              aria-disabled={off || undefined}
              onClick={() =>
                choose(
                  date.hour(panelDate.hour()).minute(panelDate.minute()).second(panelDate.second()),
                )
              }
              onKeyDown={(event) => {
                if (!off && (event.key === "Enter" || event.key === " ")) {
                  event.preventDefault();
                  choose(
                    date
                      .hour(panelDate.hour())
                      .minute(panelDate.minute())
                      .second(panelDate.second()),
                  );
                }
              }}
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
                    if (readOnly || disabledTime(candidate.toDate())) return;
                    const next = draft.slice();
                    if (mode === "dateTimeRange") next[rangeIndex] = candidate;
                    else next[0] = candidate;
                    setPanelDate(candidate);
                    commit(next);
                    centerTimeItem(timeColRefs.current[unit], number, "smooth");
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
    const active = draftRef.current[index] ?? panelDateRef.current;
    const frame = requestAnimationFrame(() => {
      (["hour", "minute", "second"] as const).forEach((unit) => {
        centerTimeItem(timeColRefs.current[unit], active[unit]());
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [visible, view, timeEditSide, mode]);
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
  const overlayContent = (
    <div
      ref={overlayRef}
      className={clsx("k-datepicker-overlay", {
        "k-datepicker-range": isRange,
        "k-datepicker-with-time": hasTime,
        "k-datepicker-panel": panelOnly,
        "k-datepicker-disabled": disabled,
      })}
      {...({ mode, "k-placement": placement } as Record<string, string>)}
      role="dialog"
      aria-disabled={disabled || undefined}
      onClickCapture={(event) => {
        if (!disabled) return;
        event.preventDefault();
        event.stopPropagation();
      }}
      onKeyDownCapture={(event) => {
        if (!disabled) return;
        event.preventDefault();
        event.stopPropagation();
      }}
      style={panelOnly ? undefined : { zIndex: 1050 }}
    >
      {presets?.length ? (
        <div className="k-picker-presets">
          {presets.map((preset) => (
            <Button key={preset.label} size="small" onClick={() => emitExternal(preset.value())}>
              {preset.label}
            </Button>
          ))}
        </div>
      ) : null}
      <div className="k-picker-container">
        {header && <div className="k-picker-extra-header">{extra(header)}</div>}
        {mode !== "time" && headerNode}
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
  );
  const overlay = panelOnly ? (
    overlayContent
  ) : (
    <Popup
      raw
      open={visible}
      target={rootRef}
      trigger="manual"
      placement={placement}
      prefixCls="k-datepicker-overlay"
      transitionName="k-date-picker"
      destroyOnClose
      outsideEvent="mousedown"
      onOpenChange={(next) => {
        if (!next) closePopup();
      }}
      overlay={overlayContent}
    />
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
  const customPlaceholders = Array.isArray(placeholder) ? placeholder : [placeholder, placeholder];
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
      "k-datepicker-readonly": readOnly,
      "k-datepicker-fill": theme === "fill",
      "k-datepicker-circle": shape === "circle",
      "k-datepicker-square": shape === "square",
    },
    className,
  );
  if (panelOnly) return overlay;

  return (
    <>
      <div
        {...rest}
        ref={rootRef}
        className={classes}
        style={style}
        tabIndex={disabled ? -1 : 0}
        aria-readonly={readOnly || undefined}
        aria-expanded={visible}
        onKeyDown={(event) => {
          if (event.key === "Escape" && visible) {
            event.stopPropagation();
            setOpen(false);
          } else if ((event.key === "Enter" || event.key === " ") && !visible) {
            event.preventDefault();
            setOpen(true);
          }
        }}
      >
        <div
          className={clsx("k-datepicker-selection", {
            "k-datepicker-has-clear": clearable && texts.some(Boolean),
          })}
          onClick={() => !disabled && !readOnly && setOpen(!visible)}
        >
          {isRange ? (
            <>
              <input
                className="k-datepicker-input"
                size={inputSize}
                value={texts[0] ?? ""}
                placeholder={placeholders[0]}
                disabled={disabled}
                readOnly={readOnly || !editable}
                onClick={(event) => {
                  event.stopPropagation();
                  setTimeEditSide("start");
                }}
                onFocus={() => !disabled && !readOnly && setOpen(true)}
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
                disabled={disabled}
                readOnly={readOnly || !editable}
                onClick={(event) => {
                  event.stopPropagation();
                  setTimeEditSide("end");
                }}
                onFocus={() => !disabled && !readOnly && setOpen(true)}
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
              disabled={disabled}
              readOnly={readOnly || !editable}
              onClick={(event) => event.stopPropagation()}
              onFocus={() => !disabled && !readOnly && setOpen(true)}
              onChange={(event) => edit(event.target.value, 0)}
              onBlur={() => acceptInput(0)}
            />
          )}
          <Icon
            type={mode === "time" ? Clock : dateIcon}
            className="k-icon-calendar"
            strokeWidth={1.5}
          />
          {clearable && !disabled && !readOnly && texts.some(Boolean) && (
            <Icon
              type={CircleX}
              className="k-icon-clean"
              role="button"
              tabIndex={0}
              aria-label="Clear"
              onPointerDown={(event) => event.preventDefault()}
              onClick={clear}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") clear(event);
              }}
            />
          )}
        </div>
      </div>
      {overlay}
    </>
  );
}

export type DatePickerPanelProps = Omit<DatePickerProps, "panelOnly" | "open" | "defaultOpen">;
export function DatePickerPanel(props: DatePickerPanelProps) {
  return <DatePicker {...props} panelOnly />;
}
export default createFormFieldComponent(DatePicker, {
  getChangeValue: (value) => value,
});
