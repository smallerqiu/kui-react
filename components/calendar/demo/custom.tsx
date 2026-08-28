import { useState } from "react";
import { Calendar, Tag, type CalendarEventData } from "react-kui";
const events: CalendarEventData[] = [
  { key: 1, date: "2026-08-23", title: "需求评审", color: "#3a95ff" },
  { key: 2, date: "2026-08-23", title: "设计同步", color: "#7b61ff" },
  { key: 3, date: "2026-08-23", title: "版本发布", color: "#22a06b" },
];
export default function App() {
  const [date, setDate] = useState("2026-08-23");
  return (
    <Calendar
      value={date}
      onChange={setDate}
      events={events}
      maxEvents={2}
      extra={<Tag color="blue">Team calendar</Tag>}
      event={(item) => (
        <button
          type="button"
          className="k-calendar-event"
          style={{ "--k-calendar-event-color": item.color } as React.CSSProperties}
        >
          <i />
          {item.title}
        </button>
      )}
      more={(count) => <span style={{ color: "var(--kui-color-primary)" }}>还有 {count} 项</span>}
    />
  );
}
