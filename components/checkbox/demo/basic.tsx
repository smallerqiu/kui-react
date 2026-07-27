import { useState } from "react";
import Button from "../../button/button";
import Space from "../../space";
import { Checkbox } from "../index";
export default function Basic() {
  const [checked, setChecked] = useState(true),
    [value1, setValue1] = useState(true),
    [value2, setValue2] = useState(true),
    [value3, setValue3] = useState(true);
  return (
    <Space vertical>
      <code>value(boolean): {String(value1)}</code>
      <Checkbox checked={value1} onChange={({ checked }) => setValue1(checked)}>
        Checkbox
      </Checkbox>
      <code>value(string): {String(value2 ? "1" : "0")}</code>
      <Checkbox checked={value2} valueType="string" onChange={({ checked }) => setValue2(checked)}>
        Checkbox
      </Checkbox>
      <code>value(number): {value3 ? 1 : 0}</code>
      <Checkbox checked={value3} valueType="number" onChange={({ checked }) => setValue3(checked)}>
        Checkbox
      </Checkbox>
      <Button onClick={() => setChecked((value) => !value)} size="small">
        {checked ? "Checked" : "Unchecked"}
      </Button>
      <Checkbox
        label="Checkbox"
        checked={checked}
        onChange={({ checked }) => setChecked(checked)}
      />
    </Space>
  );
}
