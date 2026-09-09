import { useState } from "react";
import { Segmented, Space, CheckboxGroup } from "react-kui";
const types = [
  { label: "Vertical", value: "vertical" },
  { label: "Horizontal", value: "horizontal" },
];
const options = ["Beijing", "Shanghai", "Guangzhou", "Wuhan", "Other"].map((label) => ({
  label,
  value: label.toLowerCase(),
}));
export default function App() {
  const [direction, setDirection] = useState<"horizontal" | "vertical">("horizontal"),
    [cities, setCities] = useState(["wuhan"]);
  return (
    <Space vertical>
      <Segmented
        options={types}
        value={direction}
        onChange={(value) => setDirection(value as typeof direction)}
      />
      <code>direction: {direction}</code>
      <code>value: {cities.join(", ")}</code>
      <CheckboxGroup options={options} value={cities} onChange={setCities} direction={direction} />
    </Space>
  );
}
