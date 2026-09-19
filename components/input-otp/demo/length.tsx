import { useState } from "react";
import { InputOTP, Space } from "react-kui";

export default function App() {
  const [four, setFour] = useState("");
  const [six, setSix] = useState("");
  return (
    <Space vertical>
      <code>Value: {four || "-"}</code>
      <InputOTP value={four} onChange={setFour} length={4} />
      <InputOTP value={six} onChange={setSix} />
    </Space>
  );
}
