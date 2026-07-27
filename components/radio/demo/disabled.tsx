import { useState } from "react";
import { Button, Space, Radio, RadioGroup } from "react-kui";
const options = ["Apple", "Orange", "Banana", "Pear", "Grape"].map((label) => ({
  label,
  value: label.toLowerCase(),
}));
export default function Disabled() {
  const [disabled, setDisabled] = useState(false),
    [checked, setChecked] = useState(false);
  return (
    <Space vertical>
      <Radio disabled>disabled</Radio>
      <Radio disabled checked>
        disabled
      </Radio>
      <br />
      <RadioGroup disabled options={options} />
      <RadioGroup>
        <Radio value="Apple" label="apple" />
        <Radio value="Orange" label="orange" disabled />
        <Radio value="Banana" label="banana" />
        <Radio value="Pear" label="pear" disabled />
        <Radio value="Grape" label="grape" />
      </RadioGroup>
      <br />
      <Radio disabled={disabled} checked={checked} onChange={({ checked }) => setChecked(checked)}>
        Radio
      </Radio>
      <Button onClick={() => setChecked((v) => !v)} size="small">
        {checked ? "Checked" : "Uncheck"}
      </Button>
      <Button onClick={() => setDisabled((v) => !v)} size="small">
        {disabled ? "Enable" : "Disabled"}
      </Button>
    </Space>
  );
}
