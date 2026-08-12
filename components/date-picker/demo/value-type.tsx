import { useState } from "react";
import { Space, DatePicker, type DatePickerInput } from "react-kui";
export default function App() {
  const [v1, s1] = useState<DatePickerInput>("2025-11-30"),
    [v2, s2] = useState<DatePickerInput>("2025/11/30"),
    [v3, s3] = useState<DatePickerInput>(new Date("2025-11-30")),
    [v4, s4] = useState<DatePickerInput>(1764460800000),
    [v5, s5] = useState<DatePickerInput>(1764460800);
  const row = (
    label: string,
    value: DatePickerInput,
    set: (v: DatePickerInput) => void,
    props: Record<string, unknown>
  ) => (
    <>
      <code>
        {label}, value: {String(value)}
      </code>
      <DatePicker {...props} value={value} onChange={(v) => set(v as DatePickerInput)} />
    </>
  );
  return (
    <Space wrap vertical>
      {row("string", v1, s1, { valueType: "string" })}
      {row("format", v2, s2, { format: "YYYY/MM/DD" })}
      {row("date", v3, s3, { valueType: "date" })}
      {row("timestamp", v4, s4, { valueType: "timestamp" })}
      {row("unix", v5, s5, { valueType: "unix" })}
    </Space>
  );
}
