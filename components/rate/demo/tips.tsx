import { useState } from "react";
import { Space, Rate } from "react-kui";
const descriptions = ["terrible", "bad", "normal", "good", "wonderful"];
export default function Tips() {
  const [value, setValue] = useState(3);
  return (
    <Space vertical>
      <Space>
        <Rate tooltips={descriptions} value={value} onChange={setValue} />
        {descriptions[value - 1]}
      </Space>
      <br />
      <code>allowClear = true</code>
      <Rate allowClear value={3} />
      <code>allowClear = false</code>
      <Rate allowClear={false} value={3} />
    </Space>
  );
}
