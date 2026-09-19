import { useState } from "react";
import { Form, FormItem, Input, Space, Switch } from "react-kui";

export default function FormDemo() {
  const [model, setModel] = useState<Record<string, unknown>>({ name: "KUI" });
  const [disabled, setDisabled] = useState(false);
  return (
    <Space vertical>
      <Space>
        <span>Disable form</span>
        <Switch
          checked={disabled}
          onChange={(value) => setDisabled(Boolean(value))}
          aria-label="Disable form"
        />
      </Space>
      <Form model={model} onChange={setModel} disabled={disabled} layout="vertical">
        <FormItem label="Name" prop="name">
          <Input />
        </FormItem>
      </Form>
      <output>{JSON.stringify(model)}</output>
    </Space>
  );
}
