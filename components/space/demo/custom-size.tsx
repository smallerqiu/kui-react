import { useState } from "react";
import { Button, Space } from "react-kui";
export default function CustomSize() {
  const [size, setSize] = useState(12);
  return (
    <div>
      <input
        type="range"
        value={size}
        max={50}
        onChange={(event) => setSize(Number(event.target.value))}
      />
      <Space size={size}>
        <Button type="primary">Primary</Button>
        <Button type="danger">Danger</Button>
        <Button>Default</Button>
        <Button type="text">Text</Button>
        <Button type="link">Link</Button>
      </Space>
    </div>
  );
}
