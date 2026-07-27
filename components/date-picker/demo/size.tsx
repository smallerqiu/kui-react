import { useState } from "react";
import type { SizeType } from "../../const/types";
import { RadioGroup } from "../../radio";
import Space from "../../space";
import DatePicker from "../index";
const options = [
  { value: "large", label: "Large" },
  { value: "medium", label: "Medium" },
  { value: "small", label: "Small" },
];
export default function Size() {
  const [size, setSize] = useState<SizeType>("medium");
  return (
    <Space vertical>
      <RadioGroup value={size} type="button" theme="card" options={options} onChange={setSize} />
      <Space vertical>
        <DatePicker size={size} />
        <DatePicker mode="month" size={size} />
        <DatePicker size={size} mode="dateRange" />
      </Space>
    </Space>
  );
}
