import { useState } from "react";
import { Rate, Slider, Space } from "react-kui";
const descriptions = ["terrible", "bad", "normal", "good", "wonderful"];
export default function App() {
  const [value, setValue] = useState(3);
  return (
    <Space vertical>
      <Slider
        min={0}
        max={5}
        value={value}
        onChange={(v) => setValue(Number(v))}
        style={{ width: "300px" }}
      />
      <Space>
        <Rate tooltips={descriptions} value={value} onChange={setValue} />
        {descriptions[value - 1]}
      </Space>
      <br />
      <code>allowClear = true</code>
      <Rate allowClear defaultValue={3} />
      <code>allowClear = false</code>
      <Rate allowClear={false} defaultValue={3} />
    </Space>
  );
}
