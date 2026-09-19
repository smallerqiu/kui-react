import { useState } from "react";
import { Space, ColorPicker } from "react-kui";
export default function App() {
  const [color, setColor] = useState("#3a95ff");
  return (
    <Space vertical>
      <Space>
        <Space vertical>
          <ColorPicker value={color} size="small" />
          <ColorPicker value={color} />
          <ColorPicker value={color} size="large" />
        </Space>
        <Space vertical>
          <ColorPicker showText value={color} size="small" />
          <ColorPicker showText value={color} />
          <ColorPicker showText value={color} size="large" />
        </Space>
      </Space>
      <br />
      <Space vertical>
        <code>disabled</code>
        <Space>
          <ColorPicker value={color} disabled />
          <ColorPicker showText value={color} disabled />
        </Space>
        <br />
        <code>disabledAlpha</code>
        <ColorPicker showText disabledAlpha value={color} />
        <code>presets colors</code>
        <ColorPicker value={color} onChange={setColor} presets={["#9c27b0", "red", "blue"]} />
      </Space>
    </Space>
  );
}
