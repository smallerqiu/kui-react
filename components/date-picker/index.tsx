import { useValue } from "../utils/use-value";
import { resolveTheme, useFormAppearance } from "../config/use-config-appearance";
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
import Popup from "../popup";
import { Button } from "../button";
import { ConfigContext, DEFAULT_LOCALE } from "../config/config-context";
import type { DropPlacementsType, ShapeType, SizeType, ThemeType } from "../const/types";
import Icon, { type IconType } from "../icon";

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
  "onChange" | "children" | "defaultValue" | "defaultChecked"
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
  /** 关闭后是否销毁面板内容。默认销毁（重开时重新挂载）；设为 false 可保留面板内的表单状态，代价是每个打开过的实例留一份隐藏 DOM。 */
  destroyOnClose?: boolean;
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
  destroyOnClose = true,
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
  const inheritedAppearance = useFormAppearance();
  const size = sizeProp ?? inheritedAppearance.size;
  const theme = resolveTheme(themeProp ?? inheritedAppearance.theme, "fill");
  const shape = shapeProp ?? inheritedAppearance.shape;
  const config = useContext(ConfigContext);
  const locale = config?.locale || DEFAULT_LOCALE;
  const localeName = locale?.name || "en";
  const fmt = format || defaultFormat(mode);
  const isRange = mode.endsWith("Range");
  const hasTime = mode === "time" || mode.includes("Time");
  const parsedSource = useMemo(() => {
    const source = value !== undefined ? value : isRange ? [startDate, endDate] : null;
    return (Array.isArray(source) ? source : source == null ? [] : [source]).map((item) =>
      parse(item, fmt, valueType),
    );
  }, [value, startDate, endDate, isRange, fmt, valueType]);
  // 区间值一律长成 `[起, 止]`，缺的那一头留 null，而不是整段丢掉：
  // 面板草稿和输入框文本必须同源，否则只受控单边时框里显示着 endDate、
  // 面板却是空的，下一次点日历会按"第一次点击 = 起点"把已有的 endDate 覆盖掉。
  const initial: (Dayjs | null)[] = useMemo(
    () =>
      isRange
        ? [parsedSource[0] ?? null, parsedSource[1] ?? null]
        : parsedSource.filter((item): item is Dayjs => !!item),
    [isRange, parsedSource],
  );
  const [inner, setInner] = useValue(initial, (next) => next);
  const rangeControlled = value === undefined && (startDate !== undefined || endDate !== undefined);
  const values = rangeControlled ? initial : inner;
  const [visibleState, setVisibleState] = useValue(open, (next) => next ?? false);
  const visible = panelOnly || visibleState;
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
    (next: (Dayjs | null)[]) => setDraftState({ signature: syncSignature, value: next }),
    [syncSignature],
  );
  const [hoverDate, setHoverDate] = useState<Dayjs | null>(null);
  const [timeEditSide, setTimeEditSide] = useState<"start" | "end">("start");
  // 文本回退的唯一来源是"当前这份值"——受控时由 props 派生，非受控时是最近一次提交的结果。
  // 原来区间模式恒取 parsedSource（props 那份），于是非受控提交过新值后删空再失焦，
  // 文本会弹回 props 里的原始值，和内部已提交的那份漂移。
  const formattedValues = values.map((item) => item?.format(fmt) ?? "");
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
      setVisibleState(next);

      onOpenChange?.(next);
    },
    [onOpenChange, setVisibleState, panelOnly],
  );
  const closePopup = () => {
    // 首尾没凑齐就关闭，说明这次区间选了一半，丢掉草稿回到上次提交的值。
    // 判据只能是"首尾是否都在"，不能是数组长度：日历点一下留下的是长度 1 的草稿，
    // 手输只填一个框留下的是文本有值、草稿没动，两种都得回滚；按长度判会把后者漏掉。
    if (isRange && !(draft[0] && draft[1])) {
      setDraft(values);
      setTexts(formattedValues);
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
    // 区间的内部值固定是 `[起, 止]` 两格：清空得到 `[null, null]` 而不是 `[]`，
    // 只有一头时另一格留 null——文本和面板草稿同源才谈得上"下一次点选补空位"。
    const pair = isRange ? [next[0] ?? null, next[1] ?? null] : next;
    // 值没变就不要再通知：重复点已经选中的日期、重复点已经对准的时/分/秒，
    // 原来都会原样再发一次 onChange（区间还带 onStartDateChange/onEndDateChange）。
    // 父级在 onChange 里发请求的话，这一趟是白跑的。
    // 比的是显示出来的文本，不是毫秒时间戳：日历格子每渲染一拨就重算一个 Dayjs，
    // 同一天可能带着不同的时分秒落进来，比时间戳会把"同一天"误判成变了。
    const unchanged =
      next.map((item) => item.format(fmt)).join("\u0000") ===
      values.map((item) => item?.format(fmt) ?? "").join("\u0000");
    if (!rangeControlled) setInner(pair);
    setDraft(rangeControlled ? values : pair);
    setTexts(rangeControlled ? formattedValues : pair.map((item) => item?.format(fmt) ?? ""));
    if (!unchanged) {
      const result = next.map(output);
      const strings = next.map((item) => item.format(fmt));
      onChange?.(isRange ? result : (result[0] ?? null), isRange ? strings : (strings[0] ?? ""));
      if (isRange) {
        onStartDateChange?.(result[0] ?? null);
        onEndDateChange?.(result[1] ?? null);
      }
    }
    if (closePanel) setOpen(false);
  };
  const choose = (date: Dayjs) => {
    if (disabled || readOnly) return;
    if (disabledDate(date.toDate()) || (hasTime && disabledTime(date.toDate()))) return;
    if (isRange) {
      const [start, end] = draft;
      // 只有一头已定时（父级单边受控也长这样）这一枪是去补空着的那一头，已有的那头不动。
      // 原来按 `draft.length !== 1` 判"是不是重新开始"，单边受控时草稿是空的、
      // 框里却显示着 endDate，于是下一次点选会当成第一次点击、把 endDate 覆盖掉。
      const fill = start && !end ? "end" : !start && end ? "start" : null;
      if (!fill) {
        const s = date.startOf("day");
        setDraft([s, null]);
        setTexts([s.format(fmt), ""]);
        return;
      }
      const kept = (fill === "end" ? start : end) as Dayjs;
      const before = date.isBefore(kept);
      // 已有的那头留在自己那一格时保留父级给的时刻；被挪到另一格才补 00:00:00 / 23:59:59。
      const pair: [Dayjs, Dayjs] =
        fill === "end"
          ? before
            ? [date.startOf("day"), kept.endOf("day")]
            : [kept, date.endOf("day")]
          : before
            ? [date.startOf("day"), kept]
            : [kept.startOf("day"), date.endOf("day")];
      commit(pair, mode !== "dateTimeRange");
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
      if (!isRange || (nextDraft[0] && nextDraft[1])) commit(nextDraft as Dayjs[]);
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
  // 切进年 / 月面板的那两个标签原来只有 onClick。格子做得再可达也没用——
  // 键盘用户根本进不了年/月面板，所以这里一并补成能 Tab 到、Enter/空格能按的按钮。
  const switchLabel = (target: "year" | "month", label: ReactNode, className?: string) => (
    <span
      className={className}
      role="button"
      tabIndex={0}
      onClick={() => setView(target)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setView(target);
        }
      }}
    >
      {label}
    </span>
  );
  const headerNode = (
    <div className="k-picker-header">
      <Button icon={ChevronsLeft} type="text" onClick={() => nav(-10, "year")} />
      {mode !== "year" && (
        <Button icon={ChevronLeft} type="text" onClick={() => nav(-1, "month")} />
      )}
      <span className="k-picker-header-label">
        {isYearFirst &&
          switchLabel(
            "year",
            <>
              {panelDate.year()}
              {locale?.k?.datePicker?.year}
            </>,
          )}
        {mode !== "year" &&
          switchLabel(
            "month",
            panelDate.locale(localeName).format("MMM"),
            "k-picker-header-month-btn",
          )}
        {!isYearFirst &&
          switchLabel(
            "year",
            <>
              {panelDate.year()}
              {locale?.k?.datePicker?.year}
            </>,
          )}
      </span>
      {mode !== "year" && (
        <Button icon={ChevronRight} type="text" onClick={() => nav(1, "month")} />
      )}
      <Button icon={ChevronsRight} type="text" onClick={() => nav(10, "year")} />
    </div>
  );
  // 年 / 月格子只在"这一枪就是落值"时（mode="year" / "month"）才认 disabledDate：
  // 浏览态把格子拦死，用户连"翻到那年看看有没有能选的"都做不到，
  // 而翻过去以后日期格那道 disabledDate 本来就兜着。
  // 判据是"这一整格里一天都挑不出来"，不是"格子对准的那一天被禁"——
  // disabledDate 只禁了 3 月 5 号时，3 月这格照样得点得进去。
  // 返回 null 表示整格禁用，返回一个日子表示这一格能落值；
  // 优先用当前浏览位置的那一天（和没改之前一致），那天被禁时往后找第一个能选的，
  // 这样"格子看着能点、点了没反应"不再出现。
  const unitPick = (base: Dayjs, unit: "year" | "month"): Dayjs | null => {
    if (!disabledDate(base.toDate())) return base;
    const first = base.startOf(unit).hour(base.hour()).minute(base.minute()).second(base.second());
    const end = base.endOf(unit);
    for (let day = first; day.isBefore(end); day = day.add(1, "day")) {
      if (!disabledDate(day.toDate())) return day;
    }
    return null;
  };
  // 平移整年 / 整月不用自己钳位：dayjs 的 `.year()` 和 `.month()` 都会钳
  // （2024-02-29 的 `.year(2027)` 是 2027-02-28，不会溢出成 3 月 1 日），
  // 格子就落在浏览位置的那一天上。
  const yearPanel = (
    <div className="k-picker-body">
      <div className="k-picker-year-body" role="grid">
        {Array.from({ length: 12 }, (_, index) => yearStart + index).map((year) => {
          const browsing = panelDate.year(year);
          const selects = mode === "year";
          const candidate = selects ? unitPick(browsing, "year") : browsing;
          const off = selects && !candidate;
          // 选中态取当前值，不取浏览位置：原来高亮跟着 panelDate，
          // 已有值时翻几年，选中样式就跑到别的年份上去了。
          const selected = draft.some((item) => !!item && item.year() === year);
          const pick = () => {
            if (off || !candidate) return;
            setPanelDate(browsing);
            if (selects) choose(candidate);
            else setView("month");
          };
          return (
            <div
              key={year}
              className={clsx("k-picker-year-item", {
                "k-picker-year-selected": selected,
                "k-picker-year-disabled": off,
              })}
              role="gridcell"
              tabIndex={off ? -1 : 0}
              aria-selected={selected || undefined}
              aria-disabled={off || undefined}
              onClick={pick}
              onKeyDown={(event) => {
                if (!off && (event.key === "Enter" || event.key === " ")) {
                  event.preventDefault();
                  pick();
                }
              }}
            >
              {year}
            </div>
          );
        })}
      </div>
    </div>
  );
  const monthPanel = (
    <div className="k-picker-body">
      <div className="k-picker-month-body" role="grid">
        {months.map((label, month) => {
          const browsing = panelDate.month(month);
          const selects = mode === "month";
          const candidate = selects ? unitPick(browsing, "month") : browsing;
          const off = selects && !candidate;
          const selected = draft.some(
            (item) => !!item && item.year() === panelDate.year() && item.month() === month,
          );
          const pick = () => {
            if (off || !candidate) return;
            setPanelDate(browsing);
            if (selects) choose(candidate);
            else setView("date");
          };
          return (
            <div
              key={label}
              className={clsx("k-picker-month-item", {
                "k-picker-month-selected": selected,
                "k-picker-month-disabled": off,
              })}
              role="gridcell"
              tabIndex={off ? -1 : 0}
              aria-selected={selected || undefined}
              aria-disabled={off || undefined}
              onClick={pick}
              onKeyDown={(event) => {
                if (!off && (event.key === "Enter" || event.key === " ")) {
                  event.preventDefault();
                  pick();
                }
              }}
            >
              {label}
            </div>
          );
        })}
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
          const selected = draft.some((item) => !!item && item.isSame(date, "day"));
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
                    // 和手输同一条口径：区间还缺另一头时只把时间挪进草稿和文本，
                    // 不把半截区间当成结果发给 onChange——另一头还没选，草稿里是个洞。
                    if (isRange && !(next[0] && next[1])) {
                      setDraft(next);
                      setTexts(next.map((item) => item?.format(fmt) ?? ""));
                    } else commit(next as Dayjs[]);
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
      destroyOnClose={destroyOnClose}
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
      "k-datepicker-borderless": !bordered,
      [`k-datepicker-${theme}`]: true,
      "k-datepicker-sm": size === "small",
      "k-datepicker-lg": size === "large",
      "k-datepicker-disabled": disabled,
      "k-datepicker-readonly": readOnly,
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
            // 和点外面同一条关闭路径：半截区间要在关闭时清掉草稿，
            // 这里直接 setOpen(false) 会让 Esc 关完下次打开还留着上一次的半成品。
            closePopup();
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

export type DatePickerPanelProps = Omit<DatePickerProps, "panelOnly" | "open">;
export function DatePickerPanel(props: DatePickerPanelProps) {
  return <DatePicker {...props} panelOnly />;
}
export default createFormFieldComponent(DatePicker, {
  getChangeValue: (value) => value,
});
