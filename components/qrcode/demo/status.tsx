import { useState } from "react";
import Space from "../../space";
import QRCode, { type QRCodeStatus } from "../index";
export default function Status() {
  const [url, setUrl] = useState("https://react.k-ui.cn"),
    [status, setStatus] = useState<QRCodeStatus>("expired");
  const refresh = () => {
    setStatus("loading");
    setTimeout(() => {
      setUrl("https://xxx.com/pay/order_new_1122");
      setStatus("active");
    }, 1000);
  };
  return (
    <Space wrap>
      <QRCode value={url} size={100} />
      <QRCode value={url} status="loading" size={100} />
      <QRCode value={url} status={status} size={100} onRefresh={refresh} />
      <QRCode value={url} status="scanned" size={100} />
    </Space>
  );
}
