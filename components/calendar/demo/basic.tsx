import { useState } from "react";
import { Calendar, message, type CalendarEventData } from "react-kui";
const events: CalendarEventData[] = [
  { key: 1, date: "2026-08-23", time: "10:00", title: "Product review", color: "#3a95ff" },
  { key: 2, date: "2026-08-25", title: "Release", color: "#22a06b" },
];
export default function App() {
  const [date, setDate] = useState("2026-08-23");
  return (
    <Calendar
      value={date}
      events={events}
      onChange={setDate}
      onEventClick={(event) => message.info(event.title)}
    />
  );
}
