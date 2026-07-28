import dayjs from "dayjs";
import { Space, DatePicker } from "react-kui";
const disabledDate = (current: Date) => current < dayjs().endOf("day").toDate();
const before = (hour: number, minute: number) => (date: Date) => {
  const target = new Date(date);
  target.setHours(hour, minute, 0, 0);
  return date < target;
};
export default function App() {
  return (
    <Space wrap vertical>
      <code>not before than today</code>
      <DatePicker disabledDate={disabledDate} />
      <code>not before 09:30</code>
      <DatePicker disabledTime={before(9, 30)} mode="time" />
      <code>not before 12:30 today</code>
      <DatePicker mode="dateTimeRange" disabledDate={disabledDate} disabledTime={before(12, 30)} />
    </Space>
  );
}
