import { useState } from "react";
import { Space, KSwitch as Switch, Slider } from "react-kui";
export default function Size() {
  const [disabled, setDisabled] = useState(false),
    [v1, setV1] = useState(80),
    [v2, setV2] = useState<number[]>([30, 50]);
  return (
    <Space style={{ maxWidth: 520 }} vertical block>
      <style>{`.slider-demo-custom .k-slider-track{background:linear-gradient(270deg,green 5.56%,orange)}`}</style>
      <code>
        Disabled: <Switch checked={disabled} onChange={(value) => setDisabled(Boolean(value))} />
      </code>
      <Slider
        value={v1}
        onChange={(v) => setV1(v as number)}
        step={10}
        disabled={disabled}
        min={20}
        size="small"
      />
      <Slider
        value={v2}
        onChange={(v) => setV2(v as number[])}
        range
        disabled={disabled}
        min={10}
        max={80}
        size="small"
      />
      <Slider
        value={v1}
        onChange={(v) => setV1(v as number)}
        step={10}
        disabled={disabled}
        min={20}
        size="small"
        className="slider-demo-custom"
      />
      <Slider
        value={v2}
        onChange={(v) => setV2(v as number[])}
        range
        disabled={disabled}
        min={10}
        max={80}
        size="small"
        className="slider-demo-custom"
      />
      <Slider
        marks={{ 0: "0°C", 25: "25°C", 36: "36°C", 100: "100°C" }}
        step={null}
        disabled={disabled}
        size="small"
        value={25}
      />
    </Space>
  );
}
