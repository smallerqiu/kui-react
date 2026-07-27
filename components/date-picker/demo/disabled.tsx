import Space from "../../space";
import DatePicker from "../index";
export default function Disabled() {
  return (
    <Space wrap vertical>
      <code>disabled = true</code>
      <DatePicker disabled />
      <br />
      <code>editable = false</code>
      <DatePicker editable={false} />
      <br />
      <code>clearable = false</code>
      <DatePicker clearable={false} />
    </Space>
  );
}
