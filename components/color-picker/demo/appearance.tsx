import { useState } from "react";
import { ColorPicker, Space } from "react-kui";

export default function App() {
  const [color, setColor] = useState("#3a95ff");

  return (
    <Space vertical>
      <Space>
        <ColorPicker value={color} onChange={setColor} theme="outline" showText />
        <ColorPicker value={color} onChange={setColor} theme="fill" showText />
        <ColorPicker value={color} onChange={setColor} theme="plain" showText />
      </Space>
      <Space>
        <ColorPicker value={color} onChange={setColor} shape="round" showText />
        <ColorPicker value={color} onChange={setColor} shape="circle" showText />
        <ColorPicker value={color} onChange={setColor} shape="square" showText />
      </Space>
    </Space>
  );
}
