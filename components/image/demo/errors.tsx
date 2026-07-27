import { useState } from "react";
import { Button, Space, KImage } from "react-kui";
export default function Errors() {
  const [src, setSrc] = useState("https://cdn.chuchur.com/upload/demo/test_300.jpg");
  return (
    <Space vertical>
      <KImage
        width={120}
        src="https://react.k-ui.cn/error.jpg"
        placeholder="https://cdn.chuchur.com/img/thumb.png"
      />
      <KImage width={120} height={120} src="https://react.k-ui.cn/error.jpg" />
      <KImage width={120} height={120} src={src} />
      <Button onClick={() => setSrc("https://react.k-ui.cn/error.jpg")}>Load origin</Button>
    </Space>
  );
}
