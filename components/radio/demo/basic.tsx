import { useState } from "react";
import { Button, Space, Radio } from "react-kui";
export default function App() {
  const [checked, setChecked] = useState(true);
  return (
    <Space vertical>
      <code>value: {String(checked)}</code>
      <Radio checked={checked} onChange={({ checked }) => setChecked(checked)}>
        Radio
      </Radio>
      <Button onClick={() => setChecked((v) => !v)} size="small">
        {checked ? "Checked" : "Unchecked"}
      </Button>
      <Radio label="Radio" />
    </Space>
  );
}
