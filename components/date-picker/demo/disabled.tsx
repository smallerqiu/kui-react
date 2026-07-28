import { Space, DatePicker } from "react-kui";
export default function App() {
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
