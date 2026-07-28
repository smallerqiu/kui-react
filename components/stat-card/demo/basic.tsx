import { useState } from "react";
import { Button, Space, StatNumber } from "react-kui";
export default function App() {
  const [value, setValue] = useState(Math.random() * 100000);
  return (
    <Space vertical>
      <Button onClick={() => setValue(Math.random() * 10000000)} size="small">
        change
      </Button>
      <code>default:</code>
      <StatNumber value={value} />
      <code>type=`rollup`:</code>
      <StatNumber value={value} type="rollup" />
      <code>precision=`3`:</code>
      <StatNumber value={value} precision={3} />
      <StatNumber value={value} type="rollup" precision={3} />
      <code>prefix & suffix:</code>
      <StatNumber value={value} prefix="$" />
      <StatNumber value={value} type="rollup" suffix="元" />
    </Space>
  );
}
