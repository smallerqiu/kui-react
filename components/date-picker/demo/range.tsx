import { useState } from "react";
import Space from "../../space";
import DatePicker, { type DatePickerInput } from "../index";
export default function Range() {
  const [value1, setValue1] = useState<DatePickerInput[]>(["2025-10-01", "2025-11-25"]),
    [value2, setValue2] = useState<DatePickerInput[]>([
      "2025-09-01 10:10:10",
      "2025-10-01 21:28:28",
    ]);
  return (
    <Space wrap vertical>
      <code>start date: {String(value1[0])}</code>
      <code>end date: {String(value1[1])}</code>
      <DatePicker
        mode="dateRange"
        value={value1}
        onChange={(v) => setValue1(v as DatePickerInput[])}
      />
      <br />
      <code>start date: {String(value2[0])}</code>
      <code>end date: {String(value2[1])}</code>
      <DatePicker
        mode="dateTimeRange"
        value={value2}
        onChange={(v) => setValue2(v as DatePickerInput[])}
      />
    </Space>
  );
}
