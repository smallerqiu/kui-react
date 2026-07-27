import { useState } from "react";
import Input from "../../input";
import Space from "../../space";
import QRCode from "../index";
export default function Basic() {
  const [value, setValue] = useState("https://react.k-ui.cn");
  return (
    <Space vertical>
      <Input value={value} onChange={setValue} />
      <QRCode value={value} size={100} />
      <QRCode value={value} size={100} logo="/favicon.png" />
    </Space>
  );
}
