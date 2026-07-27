import { useState } from "react";
import { Space, RadioGroup } from "react-kui";
const directions = [
    { label: "Vertical", value: "vertical" },
    { label: "Horizontal", value: "horizontal" },
  ],
  options = ["Beijing", "Shanghai", "Guangzhou", "Wuhan", "Other"].map((label) => ({
    label,
    value: label.toLowerCase(),
  }));
export default function Vertical() {
  const [direction, setDirection] = useState<"vertical" | "horizontal">("horizontal"),
    [city, setCity] = useState("wuhan");
  return (
    <Space vertical>
      <RadioGroup
        options={directions}
        value={direction}
        type="button"
        onChange={(v) => setDirection(v)}
      />
      <code>direction: {direction}</code>
      <code>value: {city}</code>
      <RadioGroup
        options={options}
        value={city}
        onChange={setCity}
        direction={direction}
        theme="card"
      />
    </Space>
  );
}
