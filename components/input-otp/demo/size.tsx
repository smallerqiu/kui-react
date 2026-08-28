import { InputOTP, Space } from "react-kui";

export default function App() {
  return (
    <Space vertical size="large">
      <InputOTP defaultValue="123456" size="small" />
      <InputOTP defaultValue="123456" />
      <InputOTP defaultValue="123456" size="large" />
    </Space>
  );
}
