import { useState } from "react";
import { Button, Slider, Space } from "react-kui";

export default function App() {
  const [size, setSize] = useState(12);
  return (
    <div>
      <Slider value={size} max={50} onChange={(value) => setSize(value as number)} />
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
