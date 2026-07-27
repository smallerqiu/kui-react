import { ArrowDown } from "kui-icons";
import Space from "../../space";
import DatePicker from "../index";
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
