import { useState } from "react";
import { Button, Space, Switch } from "react-kui";
export default function App() {
  const [checked, setChecked] = useState(false),
    [disabled, setDisabled] = useState(false);
  return (
    <Space vertical align="start">
      <Switch disabled />
      <Space>
        <Switch disabled={disabled} checked={checked} onChange={(v) => setChecked(Boolean(v))} />
        <Button size="small" onClick={() => setChecked((v) => !v)}>
          {checked ? "Uncheck" : "Check"}
        </Button>
        <Button size="small" onClick={() => setDisabled((v) => !v)}>
          {disabled ? "Enable" : "Disabled"}
        </Button>
      </Space>
      <Switch disabled trueText="Yes" falseText="No" />
      <Switch disabled trueText="Yes" falseText="No" checked />
      <Switch disabled trueText="Yes" falseText="No" checked size="small" />
    </Space>
  );
}
