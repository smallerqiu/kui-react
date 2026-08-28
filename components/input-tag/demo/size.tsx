import { useState } from "react";
import { InputTag, RadioButton, RadioGroup, Space } from "react-kui";

export default function App() {
  const [size, setSize] = useState<"small" | "medium" | "large">("medium");
  return (
    <Space vertical block>
      <RadioGroup type="button" value={size} onChange={(value) => setSize(value as typeof size)}>
        <RadioButton value="large" label="large" />
        <RadioButton value="medium" label="Medium" />
        <RadioButton value="small" label="small" />
      </RadioGroup>
      <InputTag size={size} block defaultValue={["React"]} />
      <InputTag size={size} block defaultValue={["React", "Vue"]} />
      <InputTag size={size} block defaultValue={["React", "Vue", "Solid"]} />
    </Space>
  );
}
