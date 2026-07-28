import dayjs from "dayjs";
import { useState } from "react";
import { Button, Space, DatePicker, type DatePickerInput } from "react-kui";
const p1 = [
  { label: "Yesterday", value: () => dayjs().add(-1, "d") },
  { label: "7 days ago", value: () => dayjs().add(-7, "d") },
  { label: "Last month", value: () => dayjs().add(-1, "month") },
];
const p2 = [7, 14, 30, 90].map((days) => ({
  label: `Last ${days} days`,
  value: () => [dayjs().add(-days, "d"), dayjs()],
}));
export default function App() {
  const [value1, setValue1] = useState<DatePickerInput>(),
    [value2, setValue2] = useState<DatePickerInput[]>([]);
  return (
    <Space wrap vertical>
      <DatePicker presets={p1} />
      <DatePicker presets={p2} mode="dateRange" />
      <DatePicker mode="dateTimeRange" presets={p2} />
      <br />
      <code>custom header and footer</code>
      <DatePicker
        value={value1}
        onChange={(v) => setValue1(v as DatePickerInput)}
        header={({ emit }) => <Button onClick={() => emit(dayjs().add(-1, "d"))}>Yesterday</Button>}
      />
      <DatePicker
        value={value2}
        onChange={(v) => setValue2(v as DatePickerInput[])}
        mode="dateRange"
        footer={({ emit }) => (
          <Button onClick={() => emit([dayjs().add(-7, "d"), dayjs()])}>7 days ago</Button>
        )}
      />
    </Space>
  );
}
