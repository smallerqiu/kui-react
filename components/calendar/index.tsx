import { ChevronLeft, ChevronRight } from "kui-icons";
import React, { useMemo, useState } from "react";
import { Button, ButtonGroup } from "../button";
import clsx from "clsx";

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
    return new Date(year, month - 1, day);
  }
  return new Date();
};

export default function Calendar({
  value,
  defaultValue,
  events = [],
  firstDayOfWeek,
  maxEvents = 3,
  showToolbar = true,
  todayText = "Today",
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
  const initial = parseDate(value ?? defaultValue);
  const [innerValue, setInnerValue] = useState(value ?? defaultValue);
  const [view, setView] = useState({ year: initial.getFullYear(), month: initial.getMonth() });
  const selected = value ?? innerValue;
  const today = dateKey(new Date());
  const startDay = firstDayOfWeek ?? 1;
  const labels =
    weekdays?.length === 7
      ? weekdays
      : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
          .slice(startDay)
          .concat(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].slice(0, startDay));
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
        events: events.filter((item) => item.date === key),
      };
    });
  }, [events, startDay, view]);
  const select = (cell: CalendarDateCell) => {
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
    const cell = cells.find((item) => item.date === today);
    if (cell) select(cell);
    onMonthChange?.({ year: next.year, month: next.month + 1 });
  };
  const monthTitle = new Intl.DateTimeFormat(undefined, { year: "numeric", month: "long" }).format(
    new Date(view.year, view.month, 1),
  );
  return (
    <div {...rest} className={clsx("k-calendar", className)}>
      {showToolbar && (
        <div className="k-calendar-toolbar">
          <ButtonGroup>
            <Button icon={ChevronLeft} onClick={() => changeMonth(-1)} />
            <Button onClick={goToday}>{todayText}</Button>
            <Button icon={ChevronRight} onClick={() => changeMonth(1)} />
          </ButtonGroup>
          <div className="k-calendar-title">{title ?? monthTitle}</div>
          <div className="k-calendar-extra">{extra}</div>
        </div>
      )}
      <div className="k-calendar-weekdays">
        {labels.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className="k-calendar-grid">
        {cells.map((cell) => (
          <div
            key={cell.date}
            data-date={cell.date}
            className={clsx("k-calendar-cell", {
              "k-calendar-cell-outside": !cell.currentMonth,
              "k-calendar-cell-today": cell.date === today,
              "k-calendar-cell-selected": cell.date === selected,
            })}
            role="button"
            tabIndex={0}
            onClick={() => select(cell)}
            onKeyDown={(e) => e.key === "Enter" && select(cell)}
          >
            {dateCell?.(cell) ?? <span className="k-calendar-date">{cell.day}</span>}
            <div className="k-calendar-events">
              {cell.events.slice(0, maxEvents).map(
                (item) =>
                  renderEvent?.(item, cell) ?? (
                    <button
                      key={item.key}
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
                  ),
              )}
              {cell.events.length > maxEvents && (
                <small>
                  {more?.(cell.events.length - maxEvents, cell) ??
                    `+${cell.events.length - maxEvents}`}
                </small>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
