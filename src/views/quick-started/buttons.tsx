import { useState } from "react";
import { Button, Space } from "react-kui";

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <Space>
      <Button type="primary" onClick={() => setCount((value) => value + 1)}>
        Count: {count}
      </Button>
      <Button onClick={() => setCount(0)} disabled={count === 0}>
        Reset
      </Button>
    </Space>
  );
}
