import { useState } from "react";
import { GradientPicker, Space, type GradientValue } from "react-kui";

const create = (): GradientValue => [
  { color: "#ffd166", offset: 0 },
  { color: "#ef476f", offset: 55 },
  { color: "#118ab2", offset: 100 },
];

const createCorner = (): GradientValue => ["#ffd166", "#ef476f", "#118ab2", "#06d6a0"];

export default function App() {
  const [small, setSmall] = useState<GradientValue>(create);
  const [medium, setMedium] = useState<GradientValue>(create);
  const [large, setLarge] = useState<GradientValue>(create);
  const [cornerSmall, setCornerSmall] = useState<GradientValue>(createCorner);
  const [cornerMedium, setCornerMedium] = useState<GradientValue>(createCorner);
  const [cornerLarge, setCornerLarge] = useState<GradientValue>(createCorner);
  return (
    <Space vertical>
      <div style={{ width: 360 }}>
        <GradientPicker value={small} size="small" onChange={(next) => setSmall(next)} />
      </div>
      <div style={{ width: 360 }}>
        <GradientPicker value={medium} size="medium" onChange={(next) => setMedium(next)} />
      </div>
      <div style={{ width: 360 }}>
        <GradientPicker value={large} size="large" onChange={(next) => setLarge(next)} />
      </div>
      <div style={{ width: 360 }}>
        <GradientPicker
          value={cornerSmall}
          type="corner"
          size="small"
          onChange={(next) => setCornerSmall(next)}
        />
      </div>
      <div style={{ width: 360 }}>
        <GradientPicker
          value={cornerMedium}
          type="corner"
          size="medium"
          onChange={(next) => setCornerMedium(next)}
        />
      </div>
      <div style={{ width: 360 }}>
        <GradientPicker
          value={cornerLarge}
          type="corner"
          size="large"
          onChange={(next) => setCornerLarge(next)}
        />
      </div>
    </Space>
  );
}
