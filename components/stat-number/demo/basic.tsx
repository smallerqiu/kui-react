import { useState } from "react";
import { Button, Space, StatNumber } from "react-kui";
const initValue = 12345;
export default function App() {
  const [value, setValue] = useState(initValue);
  return (
    <Space vertical>
      <Space wrap>
        <Button onClick={() => setValue(12345)} size="small">
          12,345
        </Button>
        <Button onClick={() => setValue(54321)} size="small">
          54,321
        </Button>
        <Button onClick={() => setValue((current) => current - 100)} size="small">
          -100
        </Button>
        <Button onClick={() => setValue((current) => current + 100)} size="small">
          +100
        </Button>
        <Button onClick={() => setValue(Math.random() * 10000000)} size="small">
          change
        </Button>
      </Space>
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
