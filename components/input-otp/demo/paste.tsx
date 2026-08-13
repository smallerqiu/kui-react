import { useState } from "react";
import { InputOTP, Space } from "react-kui";

export default function App() {
  const [value, setValue] = useState("");
  return <Space vertical><div>Copy and paste: 123456</div><InputOTP value={value} onChange={setValue} /><div>Value: {value || "-"}</div></Space>;
}
