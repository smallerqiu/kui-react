import { InputOTP, Space } from "react-kui";

export default function App() {
  return (
    <Space vertical size="large">
      <InputOTP value="123456" size="small" />
      <InputOTP value="123456" />
      <InputOTP value="123456" size="large" />
    </Space>
  );
}
