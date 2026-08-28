import { InputOTP, Space } from "react-kui";

export default function App() {
  return (
    <Space vertical size="large">
      <InputOTP defaultValue="123456" theme="fill" />
      <InputOTP defaultValue="123456" theme="outline" />
      <InputOTP defaultValue="123456" theme="underlined" />
      <InputOTP defaultValue="123456" shape="square" />
      <InputOTP defaultValue="123456" shape="circle" />
    </Space>
  );
}
