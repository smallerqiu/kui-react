import { useState } from "react";
import { Space, DatePicker, type DatePickerOutput } from "react-kui";
export default function App() {
  const [query, setQuery] = useState({
    startDate: "2025-10-01" as DatePickerOutput,
    endDate: "2025-11-25" as DatePickerOutput,
    startTime: "2025-09-01 10:10:10" as DatePickerOutput,
    endTime: "2025-10-01 21:28:28" as DatePickerOutput,
  });
  return (
    <Space wrap vertical>
      <code>start date: {String(query.startDate)}</code>
      <code>end date: {String(query.endDate)}</code>
      <DatePicker
        mode="dateRange"
        startDate={query.startDate}
        endDate={query.endDate}
        onStartDateChange={(startDate) => setQuery((value) => ({ ...value, startDate }))}
        onEndDateChange={(endDate) => setQuery((value) => ({ ...value, endDate }))}
      />
      <br />
      <code>start date: {String(query.startTime)}</code>
      <code>end date: {String(query.endTime)}</code>
      <DatePicker
        mode="dateTimeRange"
        startDate={query.startTime}
        endDate={query.endTime}
        onStartDateChange={(startTime) => setQuery((value) => ({ ...value, startTime }))}
        onEndDateChange={(endTime) => setQuery((value) => ({ ...value, endTime }))}
      />
    </Space>
  );
}
