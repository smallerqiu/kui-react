import { useRef, useState } from "react";
import { Button } from "../../button";
import Input from "../../input";
import Poptip from "../../poptip";
import Space from "../../space";
import QRCode, { type QRCodeRef } from "../index";
export default function Download() {
  const [url, setUrl] = useState("https://k-ui.cn"),
    ref = useRef<QRCodeRef>(null);
  return (
    <Space vertical>
      <Space compact>
        <Input value={url} onChange={setUrl} />
        <Button type="primary" onClick={() => ref.current?.download()}>
          Download
        </Button>
      </Space>
      <QRCode value={url} size={128} logo="/favicon.png" ref={ref} />
      <Poptip content={<QRCode value={url} size={128} bordered={false} logo="/favicon.png" />}>
        <Button type="primary">Hover me</Button>
      </Poptip>
    </Space>
  );
}
