import { useState } from "react";
import { Space, DatePicker } from "react-kui";
export default function Basic() {
  const [year, setYear] = useState("2025"),
    [month, setMonth] = useState("2025-10"),
    [date, setDate] = useState("2025-12-12"),
    [time, setTime] = useState("20:20:20"),
    [datetime, setDatetime] = useState("2021-01-01 20:20:20");
  return (
    <Space wrap vertical>
      <code>value: {year}</code>
      <DatePicker mode="year" value={year} onChange={(_, s) => setYear(s as string)} />
      <code>value: {month}</code>
      <DatePicker mode="month" value={month} onChange={(_, s) => setMonth(s as string)} />
      <code>value: {date}</code>
      <DatePicker mode="date" value={date} onChange={(_, s) => setDate(s as string)} />
      <code>value: {time}</code>
      <DatePicker mode="time" value={time} onChange={(_, s) => setTime(s as string)} />
      <code>value: {datetime}</code>
      <DatePicker mode="dateTime" value={datetime} onChange={(_, s) => setDatetime(s as string)} />
    </Space>
  );
}
