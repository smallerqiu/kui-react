import { useState } from "react";
import { Space, ColorPicker } from "react-kui";
export default function Basic() {
  const [color, setColor] = useState("#3a95ff"),
    [hex, setHex] = useState("#3a95ff"),
    [rgb, setRgb] = useState("rgba(0, 188, 212, 0.72)"),
    [hsl, setHsl] = useState("hsl(207, 90%, 54%)");
  return (
    <Space vertical>
      <code>value: {color}</code>
      <ColorPicker value={color} onChange={setColor} />
      <code>mode = hex, value: {hex}</code>
      <ColorPicker value={hex} onChange={setHex} />
      <code>mode = rgb, value: {rgb}</code>
      <ColorPicker mode="rgb" value={rgb} onChange={setRgb} />
      <code>mode = hsl, value: {hsl}</code>
      <ColorPicker mode="hsl" value={hsl} onChange={setHsl} />
      <code>showText = true</code>
      <ColorPicker showText value={color} onChange={setColor} />
    </Space>
  );
}
