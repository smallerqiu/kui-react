import { useState } from "react";
import { Space, Checkbox, CheckboxGroup } from "react-kui";
const options = ["Beijing", "Shenzhen", "Shanghai", "Guangzhou", "Wuhan"].map((label) => ({
  label,
  value: label.toLowerCase(),
}));
export default function CheckAll() {
  const [cities, setCities] = useState<string[]>([]);
  const checked = cities.length === options.length,
    indeterminate = cities.length > 0 && !checked;
  return (
    <Space vertical>
      <code>value: {cities.join(", ")}</code>
      <Checkbox
        checked={checked}
        indeterminate={indeterminate}
        onChange={({ checked }) => setCities(checked ? options.map(({ value }) => value) : [])}
      >
        Check all
      </Checkbox>
      <CheckboxGroup options={options} value={cities} onChange={setCities} />
    </Space>
  );
}
