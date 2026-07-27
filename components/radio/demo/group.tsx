import { useEffect, useState } from "react";
import Space from "../../space";
import { Radio, RadioGroup } from "../index";
const initial = ["Apple", "Orange", "Banana", "Pear", "Grape"].map((label) => ({
  label,
  value: label.toLowerCase(),
}));
export default function Group() {
  const [value, setValue] = useState("apple"),
    [options, setOptions] = useState(initial);
  useEffect(() => {
    const timer = setTimeout(
      () => setOptions(initial.map((item) => ({ ...item, label: `${item.label}1` }))),
      1000
    );
    return () => clearTimeout(timer);
  }, []);
  return (
    <Space vertical>
      use options<code>value: {value}</code>
      <RadioGroup options={options} value={value} onChange={setValue} />
      <br />
      use children
      <RadioGroup value={value} onChange={setValue}>
        {options.map((item) => (
          <Radio key={item.value} label={item.label} value={item.value} />
        ))}
      </RadioGroup>
    </Space>
  );
}
