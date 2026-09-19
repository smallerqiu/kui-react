import { useState } from "react";
import { Input, QRCode, Space } from "react-kui";
export default function App() {
  const [value, setValue] = useState("https://react.k-ui.cn");
  return (
    <Space vertical>
      <Input value={value} onChange={setValue} />
      <QRCode value={value} size={100} />
      <QRCode value={value} size={100} logo="/favicon.svg" />
    </Space>
  );
}
