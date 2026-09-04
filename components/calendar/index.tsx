import { ChevronLeft, ChevronRight } from "kui-icons";
import React, { useContext, useMemo, useState } from "react";
import { Button, ButtonGroup } from "../button";
import clsx from "clsx";
import { ConfigContext } from "../config/config-context";
import zhCN from "../locale/zh-CN";

export interface CalendarEventData {
  key: string | number;
  date: string;
  title: string;
  time?: string;
  color?: string;
  [key: string]: unknown;
}
export interface CalendarDateCell {
  date: string;
  day: number;
  currentMonth: boolean;
  events: CalendarEventData[];
}
export interface CalendarProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange" | "title"
> {
  value?: string;
  defaultValue?: string;
  events?: CalendarEventData[];
  firstDayOfWeek?: number;
  maxEvents?: number;
  showToolbar?: boolean;
  todayText?: string;
  weekdays?: string[];
  onChange?: (date: string, cell: CalendarDateCell) => void;
  onMonthChange?: (value: { year: number; month: number }) => void;
  onEventClick?: (event: CalendarEventData, cell: CalendarDateCell) => void;
  title?: React.ReactNode;
  extra?: React.ReactNode;
  dateCell?: (cell: CalendarDateCell) => React.ReactNode;
  event?: (event: CalendarEventData, cell: CalendarDateCell) => React.ReactNode;
  more?: (count: number, cell: CalendarDateCell) => React.ReactNode;
}
const pad = (value: number) => String(value).padStart(2, "0");
const dateKey = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const parseDate = (value?: string) => {
  if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day)
      return date;
  }
  return undefined;
};
const toRenderKey = (value: unknown) => `${typeof value}:${String(value)}`;

export default function Calendar({
  value,
  defaultValue,
  events = [],
  firstDayOfWeek,
  maxEvents = 3,
  showToolbar = true,
  todayText,
  weekdays,
  onChange,
  onMonthChange,
  onEventClick,
  title,
  extra,
  dateCell,
  event: renderEvent,
  more,
  className,
  ...rest
}: CalendarProps) {
  const config = useContext(ConfigContext);
  const locale = config.locale || zhCN;
  const localeName = locale.name || "zh-cn";
  const initial = parseDate(value ?? defaultValue) || new Date();
  const [innerValue, setInnerValue] = useState(value ?? defaultValue);
  const [view, setView] = useState({ year: initial.getFullYear(), month: initial.getMonth() });
  const [syncedValue, setSyncedValue] = useState(value);
  if (value !== syncedValue) {
    setSyncedValue(value);
    const date = parseDate(value);
    if (date) setView({ year: date.getFullYear(), month: date.getMonth() });
  }
  const selected = value ?? innerValue;
  const today = dateKey(new Date());
  const localeFirstDay = useMemo(() => {
    try {
      const firstDay = (
        new Intl.Locale(localeName) as Intl.Locale & {
          weekInfo?: { firstDay: number };
        }
      ).weekInfo?.firstDay;
      if (firstDay) return firstDay % 7;
    } catch {
      // Fall back for runtimes without Intl.Locale week information.
    }
    return /^en(?:-|$)/i.test(localeName) ? 0 : 1;
  }, [localeName]);
  const requestedFirstDay = firstDayOfWeek ?? localeFirstDay;
  const startDay = Number.isFinite(requestedFirstDay)
    ? Math.min(6, Math.max(0, Math.floor(requestedFirstDay)))
    : localeFirstDay;
  const localizedWeekdays = useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) =>
        new Intl.DateTimeFormat(localeName, { weekday: "short" }).format(
          new Date(2021, 7, 1 + index),
        ),
      ),
    [localeName],
  );
  const baseLabels = weekdays?.length === 7 ? weekdays : localizedWeekdays;
  const labels = Array.from({ length: 7 }, (_, index) => baseLabels[(startDay + index) % 7]);
  const visibleEventCount = Number.isFinite(maxEvents) ? Math.max(0, Math.floor(maxEvents)) : 0;
  const eventsByDate = useMemo(() => {
    const grouped = new Map<string, CalendarEventData[]>();
    events.forEach((item) => {
      const list = grouped.get(item.date);
      if (list) list.push(item);
      else grouped.set(item.date, [item]);
    });
    return grouped;
  }, [events]);
  const cells = useMemo(() => {
    const first = new Date(view.year, view.month, 1);
    const offset = (first.getDay() - startDay + 7) % 7;
    const start = new Date(view.year, view.month, 1 - offset);
    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      const key = dateKey(date);
      return {
        date: key,
        day: date.getDate(),
        currentMonth: date.getMonth() === view.month,
        events: eventsByDate.get(key) || [],
      };
    });
  }, [eventsByDate, startDay, view]);

  const select = (cell: CalendarDateCell) => {
    if (!cell.currentMonth) {
      const date = parseDate(cell.date);
      if (date) {
        const next = { year: date.getFullYear(), month: date.getMonth() };
        setView(next);
        onMonthChange?.({ year: next.year, month: next.month + 1 });
      }
    }
    if (value === undefined) setInnerValue(cell.date);
    onChange?.(cell.date, cell);
  };
  const changeMonth = (offset: number) => {
    const date = new Date(view.year, view.month + offset, 1);
    const next = { year: date.getFullYear(), month: date.getMonth() };
    setView(next);
    onMonthChange?.({ year: next.year, month: next.month + 1 });
  };
  const goToday = () => {
    const date = new Date();
    const next = { year: date.getFullYear(), month: date.getMonth() };
    setView(next);
    const cell: CalendarDateCell = {
      date: today,
      day: date.getDate(),
      currentMonth: true,
      events: eventsByDate.get(today) || [],
    };
    if (value === undefined) setInnerValue(today);
    onChange?.(today, cell);
    onMonthChange?.({ year: next.year, month: next.month + 1 });
  };
  const monthTitle = new Intl.DateTimeFormat(localeName, {
    year: "numeric",
    month: "long",
  }).format(new Date(view.year, view.month, 1));
  const resolvedTodayText = todayText ?? locale.k.datePicker.today ?? "Today";
  const focusDate =
    cells.find((cell) => cell.date === selected)?.date ||
    cells.find((cell) => cell.date === today)?.date ||
    cells.find((cell) => cell.currentMonth)?.date;
  const moveFocus = (keyboardEvent: React.KeyboardEvent<HTMLDivElement>) => {
    const offsets: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      ArrowDown: 7,
    };
    let offset = offsets[keyboardEvent.key];
    const current = keyboardEvent.currentTarget;
    const grid = current.closest(".k-calendar-grid");
    if (!grid) return false;
    const items = Array.from(grid.querySelectorAll<HTMLElement>(".k-calendar-cell"));
    const index = items.indexOf(current);
    if (keyboardEvent.key === "Home") offset = -(index % 7);
    if (keyboardEvent.key === "End") offset = 6 - (index % 7);
    if (offset === undefined) return false;
    const target = items[index + offset];
    if (!target) return false;
    keyboardEvent.preventDefault();
    current.tabIndex = -1;
    target.tabIndex = 0;
    target.focus();
    return true;
  };
  return (
    <div {...rest} className={clsx("k-calendar", className)}>
      {showToolbar && (
        <div className="k-calendar-toolbar">
          <ButtonGroup>
            <Button icon={ChevronLeft} onClick={() => changeMonth(-1)} />
            <Button onClick={goToday}>{resolvedTodayText}</Button>
            <Button icon={ChevronRight} onClick={() => changeMonth(1)} />
          </ButtonGroup>
          <div className="k-calendar-title">{title ?? monthTitle}</div>
          <div className="k-calendar-extra">{extra}</div>
        </div>
      )}
      <div className="k-calendar-weekdays">
        {labels.map((day, index) => (
          <span key={index} role="columnheader">
            {day}
          </span>
        ))}
      </div>
      <div className="k-calendar-grid" role="grid" aria-rowcount={6} aria-colcount={7}>
        {Array.from({ length: 6 }, (_, rowIndex) => (
          <div key={rowIndex} className="k-calendar-row" role="row">
            {cells.slice(rowIndex * 7, rowIndex * 7 + 7).map((cell) => (
              <div
                key={cell.date}
                data-date={cell.date}
                className={clsx("k-calendar-cell", {
                  "k-calendar-cell-outside": !cell.currentMonth,
                  "k-calendar-cell-today": cell.date === today,
                  "k-calendar-cell-selected": cell.date === selected,
                })}
                role="gridcell"
                aria-selected={cell.date === selected}
                aria-current={cell.date === today ? "date" : undefined}
                tabIndex={cell.date === focusDate ? 0 : -1}
                onClick={() => select(cell)}
                onKeyDown={(keyboardEvent) => {
                  if (moveFocus(keyboardEvent)) return;
                  if (keyboardEvent.key === "Enter" || keyboardEvent.key === " ") {
                    keyboardEvent.preventDefault();
                    select(cell);
                  }
                }}
              >
                {dateCell?.(cell) ?? <span className="k-calendar-date">{cell.day}</span>}
                <div className="k-calendar-events">
                  {cell.events.slice(0, visibleEventCount).map((item) => {
                    const custom = renderEvent?.(item, cell);
                    return custom ? (
                      <div
                        key={toRenderKey(item.key)}
                        className="k-calendar-event-custom"
                        onClick={(event) => {
                          event.stopPropagation();
                          onEventClick?.(item, cell);
                        }}
                      >
                        {custom}
                      </div>
                    ) : (
                      <button
                        key={toRenderKey(item.key)}
                        type="button"
                        className="k-calendar-event"
                        style={{ "--k-calendar-event-color": item.color } as React.CSSProperties}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick?.(item, cell);
                        }}
                      >
                        <i />
                        {item.time && <em>{item.time}</em>}
                        <span>{item.title}</span>
                      </button>
                    );
                  })}
                  {cell.events.length > visibleEventCount && (
                    <small>
                      {more?.(cell.events.length - visibleEventCount, cell) ??
                        `+${cell.events.length - visibleEventCount}`}
                    </small>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
