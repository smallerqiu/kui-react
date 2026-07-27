import { useState } from "react";
import { Button, InputGroup, Space, InputNumber } from "react-kui";
export default function Basic() {
  const [value, setValue] = useState(1),
    change = (v: number | undefined) => setValue(v ?? 0);
  return (
    <Space style={{ fontSize: 12, maxWidth: 200 }} block vertical>
      <code>value: {value}</code>
      <InputNumber value={value} onChange={change} />
      <code>readonly</code>
      <InputNumber value={value} readOnly />
      <code>disabled</code>
      <InputNumber value={value} disabled />
      <code>group</code>
      <InputGroup>
        <Button onClick={() => setValue((v) => v - 1)}>-</Button>
        <InputNumber value={value} controls={false} onChange={change} />
        <Button onClick={() => setValue((v) => v + 1)}>+</Button>
      </InputGroup>
    </Space>
  );
}
