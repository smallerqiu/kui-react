import { useState } from "react";
import { Input, Space, Switch } from "react-kui";

export default function ValueDemo() {
  const [name, setName] = useState("");
  const [enabled, setEnabled] = useState(true);
  return (
    <Space vertical>
      <Switch
        checked={enabled}
        onChange={(value) => setEnabled(Boolean(value))}
        aria-label="Enable input"
      />
      <Input
        value={name}
        onChange={setName}
        disabled={!enabled}
        placeholder="Your name"
        aria-label="Your name"
      />
      <output>Name: {name || "—"}</output>
    </Space>
  );
}
