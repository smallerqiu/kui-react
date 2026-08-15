import { ArrowDown } from "kui-icons";
import { Space, DatePicker } from "react-kui";
export default function App() {
  return (
    <Space vertical>
      <DatePicker shape="circle" />
      <DatePicker />
      <DatePicker theme="outline" placeholder="Outline" />
      <DatePicker dateIcon={ArrowDown} placeholder="Custom Icon" />
      <DatePicker theme="plain" placeholder="Plain" />
      <DatePicker mode="dateRange" />
    </Space>
  );
}
