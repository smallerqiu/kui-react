import { useEffect, useState } from "react";
import { Space, Checkbox, CheckboxGroup, type CheckboxOption } from "react-kui";
const initial: CheckboxOption[] = ["Apple", "Orange", "Banana", "Pear", "Grape"].map((label) => ({
  label,
  value: label.toLowerCase(),
}));
export default function Group() {
  const [value, setValue] = useState(["apple", "grape"]),
    [options, setOptions] = useState(initial);
  useEffect(() => {
    const timer = window.setTimeout(
      () => setOptions(initial.map((item) => ({ ...item, label: `${item.label}1` }))),
      1000
    );
    return () => clearTimeout(timer);
  }, []);
  return (
    <Space vertical>
      use options<code>value: {value.join(", ")}</code>
      <CheckboxGroup options={options} value={value} onChange={setValue} />
      <br />
      use children
      <CheckboxGroup value={value} onChange={setValue}>
        {options.map((item) => (
          <Checkbox key={item.value} label={item.label} value={item.value} />
        ))}
      </CheckboxGroup>
    </Space>
  );
}
