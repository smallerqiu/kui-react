import { useState } from "react";
import { GradientPicker, Space, type CornerGradientValue, type GradientValue } from "react-kui";

const initial: GradientValue = ["#ffffff", "#a9f0d1", "#5fe08a", "#3cbf6b"];

export default function App() {
  const [value, setValue] = useState<GradientValue>(initial);
  return (
    <Space vertical>
      <div style={{ width: 360 }}>
        <GradientPicker type="corner" value={value} onChange={(next) => setValue(next)} />
      </div>
      <code>colors: {(value as CornerGradientValue).join(", ")}</code>
      <div style={{ width: 360 }}>
        <GradientPicker type="corner" value={value} disabled onChange={() => undefined} />
      </div>
    </Space>
  );
}
