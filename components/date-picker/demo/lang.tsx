import dayjs from "dayjs";
import "dayjs/locale/en";
import { useState } from "react";
import { Space, DatePicker } from "react-kui";
dayjs.locale("en");
export default function Lang() {
  const [value, setValue] = useState("2021-01-01 20:20:20");
  return (
    <Space wrap vertical>
      <DatePicker mode="year" />
      <DatePicker mode="month" />
      <DatePicker mode="date" />
      <DatePicker mode="time" />
      <DatePicker mode="dateTime" value={value} onChange={(_, s) => setValue(s as string)} />
    </Space>
  );
}
