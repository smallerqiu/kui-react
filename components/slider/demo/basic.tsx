import { useState } from "react";
import Space from "../../space";
import Switch from "../../switch";
import Slider from "../index";
export default function Basic() {
  const [v, setV] = useState(10),
    [v1, setV1] = useState(30),
    [v2, setV2] = useState<number[]>([30, 50]),
    [disabled, setDisabled] = useState(false);
  return (
    <Space style={{ maxWidth: 520 }} vertical block>
      <code>
        Disabled: <Switch checked={disabled} onChange={setDisabled} />
      </code>
      <code>value: {v}</code>
      <Slider value={v} onChange={(x) => setV(x as number)} step={1} disabled={disabled} />
      <code>value: {v1}</code>
      <Slider
        value={v1}
        onChange={(x) => setV1(x as number)}
        step={10}
        disabled={disabled}
        min={20}
      />
      <code>value: {v2.join(", ")}</code>
      <Slider
        value={v2}
        onChange={(x) => setV2(x as number[])}
        range
        disabled={disabled}
        min={10}
        max={80}
      />
      <Slider
        marks={{ 0: "0°C", 25: "25°C", 36: "36°C", 100: "100°C" }}
        step={null}
        disabled={disabled}
        value={25}
      />
    </Space>
  );
}
