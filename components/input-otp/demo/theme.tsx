import { InputOTP, Space } from "react-kui";

export default function App() {
  return (
    <Space vertical size="large">
      <InputOTP value="123456" theme="fill" />
      <InputOTP value="123456" theme="outline" />
      <InputOTP value="123456" theme="underlined" />
      <InputOTP value="123456" shape="square" />
      <InputOTP value="123456" shape="circle" />
    </Space>
  );
}
