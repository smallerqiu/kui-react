import { ArrowDown } from "kui-icons";
import { Space, DatePicker } from "react-kui";
export default function Theme() {
  return (
    <Space vertical>
      <DatePicker shape="circle" />
      <DatePicker />
      <DatePicker theme="outline" placeholder="Outline" />
      <DatePicker dateIcon={ArrowDown} placeholder="Custom Icon" />
      <DatePicker bordered={false} placeholder="No Border" />
      <DatePicker mode="dateRange" />
    </Space>
  );
}
