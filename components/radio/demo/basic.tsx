import { useState } from "react";
import { Button } from "../../button";
import Space from "../../space";
import { Radio, RadioGroup } from "../index";
const items = [
  { label: "Apple", value: "apple" },
  { label: "Orange", value: "orange" },
  { label: "Banana", value: "banana" },
];
export default function Basic() {
  const [checked, setChecked] = useState(true),
    [value, setValue] = useState("apple");
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
      <RadioGroup value={value} theme="card" options={items} type="button" onChange={setValue} />
    </Space>
  );
}
