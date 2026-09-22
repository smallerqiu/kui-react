import { useState } from "react";
import { Button, Space, StatNumber } from "react-kui";

export default function App() {
  const [value, setValue] = useState(12345);
  return (
    <Space vertical>
      <Button onClick={() => setValue((current) => (current === 12345 ? 54321 : 12345))}>
        12,345 ↔ 54,321
      </Button>
      {[0, 0.6, 1.2, 2].map((duration) => (
        <Space key={duration}>
          <code>{duration}s</code>
          <StatNumber value={value} type="rollup" duration={duration} autoAnimate={false} />
        </Space>
      ))}
    </Space>
  );
}
