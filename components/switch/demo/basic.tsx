import { useState } from "react";
import { Button, Space, Switch } from "react-kui";
export default function App() {
  const [v1, setV1] = useState(true),
    [v2, setV2] = useState(true),
    [v3, setV3] = useState(true),
    [checked, setChecked] = useState(true);
  return (
    <Space vertical>
      <code>value(boolean): {String(v1)}</code>
      <Switch checked={v1} onChange={(v) => setV1(Boolean(v))} />
      <code>value(string): {v2 ? "1" : "0"}</code>
      <Switch checked={v2} valueType="string" onChange={(v) => setV2(Boolean(Number(v)))} />
      <code>value(number): {v3 ? 1 : 0}</code>
      <Switch checked={v3} valueType="number" onChange={(v) => setV3(Boolean(v))} />
      <Button onClick={() => setChecked((v) => !v)} size="small">
        {checked ? "Checked" : "Unchecked"}
      </Button>
      <Switch checked={checked} onChange={(v) => setChecked(Boolean(v))} />
    </Space>
  );
}
