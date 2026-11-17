import { useState } from "react";
import {
  formatGradient,
  GradientPicker,
  Space,
  type GradientStop,
  type GradientValue,
} from "react-kui";

const initial: GradientValue = [
  { color: "#ffd166", offset: 0 },
  { color: "#ef476f", offset: 55 },
  { color: "#118ab2", offset: 100 },
];

const stopsText = (stops: GradientStop[]) =>
  stops.map((stop) => `${stop.color} ${stop.offset}%`).join(", ");

export default function App() {
  const [value, setValue] = useState<GradientValue>(initial);
  const [linear, setLinear] = useState(() => formatGradient(initial));
  const [radial, setRadial] = useState(
    () => `radial-gradient(circle, ${stopsText(initial as GradientStop[])})`,
  );
  return (
    <Space vertical>
      <div style={{ width: 360 }}>
        <GradientPicker
          value={value}
          alpha
          onChange={(next) => {
            setValue(next);
            setLinear(formatGradient(next));
            setRadial(`radial-gradient(circle, ${stopsText(next as GradientStop[])})`);
          }}
        />
      </div>
      <code>linear: {linear}</code>
      <code>radial: {radial}</code>
      <div style={{ width: 360 }}>
        <GradientPicker value={value} disabled onChange={() => undefined} />
      </div>
    </Space>
  );
}
