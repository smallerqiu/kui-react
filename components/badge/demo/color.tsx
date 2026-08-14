import { useState } from "react";
import { Badge, Space, Switch } from "react-kui";
const custom = ["#c20", "#39f", "#e3f", "#6c0"];
const colors = [
  "pink",
  "red",
  "yellow",
  "orange",
  "cyan",
  "green",
  "blue",
  "purple",
  "magenta",
  "volcano",
  "gold",
  "lime",
];
export default function App() {
  const [active, setActive] = useState(false);
  return (
    <Space vertical block>
      <Space>
        Active : <Switch checked={active} onChange={(value) => setActive(Boolean(value))} />
      </Space>
      <code>Presets</code>
      <Space wrap>
        {colors.map((color) => (
          <Badge key={color} color={color} text={color} active={active} />
        ))}
      </Space>
      <br />
      <code>Custom</code>
      {custom.map((color) => (
        <div key={color}>
          <Badge color={color} text={color} active={active} />
        </div>
      ))}
    </Space>
  );
}
