import { ArrowDown, Search } from "kui-icons";
import { useState } from "react";
import { Cascader, Space, type CascaderOption, type CascaderValue } from "../..";

const simpleOptions: CascaderOption[] = [
  {
    value: "1",
    label: "选项一",
    children: [
      { value: "1-1", label: "子选项 A" },
      { value: "1-2", label: "子选项 B" },
    ],
  },
  { value: "2", label: "选项二", children: [{ value: "2-1", label: "子选项 C" }] },
];

export default function Demo() {
  const [value, setValue] = useState<CascaderValue>([]);
  const common = { value, onChange: setValue, options: simpleOptions, style: { width: 240 } };
  return (
    <Space vertical size={12}>
      <Cascader {...common} shape="circle" placeholder="Circle" />
      <Cascader {...common} showArrow={false} placeholder="No Arrow" />
      <Cascader {...common} arrowIcon={ArrowDown} placeholder="Custom Arrow" />
      <Cascader {...common} icon={Search} placeholder="With Icon" />
      <Cascader {...common} theme="solid" placeholder="Solid" />
      <Cascader {...common} theme="solid" bordered={false} placeholder="No Border" />
      <Cascader {...common} size="large" placeholder="Large Size (38px)" />
      <Cascader {...common} placeholder="Default Size (32px)" />
      <Cascader {...common} size="small" placeholder="Small Size (24px)" />
    </Space>
  );
}
