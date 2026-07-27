import { ArrowDown, Search } from "kui-icons";
import { useState } from "react";
import { Space, Select } from "react-kui";
const options = ["Apple", "Orange", "Banana", "Pear"].map((label, index) => ({
  label,
  value: String(index + 1),
}));
export default function Theme() {
  const [value, setValue] = useState<any[]>(["1", "3"]);
  return (
    <Space vertical align="start" block style={{ width: 300, maxWidth: "100%" }}>
      <Select shape="circle" options={options} placeholder="A circle Input" />
      <Select
        shape="circle"
        icon={Search}
        options={options}
        placeholder="A circle Input with icon"
      />
      <Select options={options} placeholder="No Arrow" showArrow={false} />
      <Select options={options} placeholder="Custom Arrow" arrowIcon={ArrowDown} />
      <Select
        multiple
        value={value}
        onChange={(v) => setValue(v as any[])}
        filterable
        options={options}
      />
      <Select filterable theme="outline" options={options} placeholder="Outline theme" />
      <Select bordered={false} theme="solid" options={options} placeholder="No Border" />
    </Space>
  );
}
