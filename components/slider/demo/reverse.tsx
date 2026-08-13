import { useState } from "react";
import { Space, Switch, Slider } from "react-kui";
export default function App() {
  const [v1, setV1] = useState(30),
    [v2, setV2] = useState<number[]>([35, 60]),
    [reverse, setReverse] = useState(true);
  return (
    <Space style={{ maxWidth: 520 }} vertical block>
      <code>
        Reversed:{" "}
        <Switch checked={reverse} onChange={(value) => setReverse(Boolean(value))} size="small" />
      </code>
      <Slider value={v1} onChange={(v) => setV1(v as number)} reverse={reverse} />
      <Slider
        value={v2}
        onChange={(v) => setV2(v as number[])}
        range
        reverse={reverse}
        marks={{ 40: "40°C", 50: "50°C" }}
      />
    </Space>
  );
}
