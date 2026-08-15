import { useRef, useState } from "react";
import { Button, Input, Poptip, Space, QRCode, type QRCodeRef } from "react-kui";
export default function App() {
  const [url, setUrl] = useState("https://react.k-ui.cn"),
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
      <Poptip content={<QRCode value={url} size={128} theme="plain" logo="/favicon.png" />}>
        <Button type="primary">Hover me</Button>
      </Poptip>
    </Space>
  );
}
