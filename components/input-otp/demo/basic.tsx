import { useState } from "react";
import { InputOTP, message, Space } from "react-kui";

export default function App() {
  const [value, setValue] = useState("");
  const [text, setText] = useState("");
  return (
    <Space vertical size="large">
      <div>Value: {value || "-"}</div>
      <InputOTP value={value} onChange={setValue} onComplete={(code) => message.success(`complete: ${code}`)} />
      <InputOTP value={text} onChange={setText} type="text" length={4} mask />
      <InputOTP defaultValue="123456" size="small" disabled />
    </Space>
  );
}
