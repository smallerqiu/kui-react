import { useState } from "react";
import { Button, Space, Checkbox, CheckboxGroup } from "react-kui";
const options = ["Apple", "Orange", "Banana", "Pear", "Grape"].map((label) => ({
  label,
  value: label.toLowerCase(),
}));
export default function Disabled() {
  const [disabled, setDisabled] = useState(false),
    [checked, setChecked] = useState(false);
  return (
    <Space vertical>
      <Checkbox disabled>disabled</Checkbox>
      <Checkbox disabled checked>
        disabled
      </Checkbox>
      <Checkbox indeterminate disabled>
        indeterminate
      </Checkbox>
      <br />
      <CheckboxGroup disabled options={options} />
      <CheckboxGroup>
        <Checkbox value="Apple" label="apple" />
        <Checkbox value="Orange" label="orange" disabled />
        <Checkbox value="Banana" label="banana" />
        <Checkbox value="Pear" label="pear" disabled />
        <Checkbox value="Grape" label="grape" />
      </CheckboxGroup>
      <br />
      <Checkbox
        disabled={disabled}
        checked={checked}
        onChange={({ checked }) => setChecked(checked)}
      >
        Checkbox
      </Checkbox>
      <Button onClick={() => setChecked((value) => !value)} size="small">
        {checked ? "Checked" : "Uncheck"}
      </Button>
      <Button onClick={() => setDisabled((value) => !value)} size="small">
        {disabled ? "Enable" : "Disabled"}
      </Button>
    </Space>
  );
}
