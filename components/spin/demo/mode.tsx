import { useState } from "react";
import { Radio, RadioGroup, Switch, Spin } from "react-kui";
type Mode = "bounce" | "flip" | "rotate" | "zoom";
export default function App() {
  const [spinning, setSpinning] = useState(false),
    [mode, setMode] = useState<Mode>("bounce");
  return (
    <div>
      <Spin spinning={spinning} mode={mode}>
        <div style={{ padding: "100px 50px" }}>
          See the light through the mist.
          <br />
          See the light through the mist.
        </div>
      </Spin>
      <br />
      <br />
      Loading state：
      <Switch checked={spinning} onChange={(value) => setSpinning(Boolean(value))} />
      <br />
      <br />
      <RadioGroup value={mode} onChange={(value) => setMode(value as Mode)}>
        {(["bounce", "flip", "rotate", "zoom"] as Mode[]).map((value) => (
          <Radio key={value} value={value} label={value[0].toUpperCase() + value.slice(1)} />
        ))}
      </RadioGroup>
    </div>
  );
}
