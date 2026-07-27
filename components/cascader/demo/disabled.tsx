import { useState } from "react";
import { Cascader, Space, type CascaderOption, type CascaderValue } from "react-kui";

const orgOptions: CascaderOption[] = [
  {
    value: "headquarters",
    label: "集团总部",
    children: [
      { value: "hr", label: "人力资源部" },
      { value: "tech", label: "研发中心" },
      { value: "finance", label: "财务风控部" },
    ],
  },
  {
    value: "east_branch",
    label: "华东分公司",
    disabled: true,
    children: [
      { value: "sh_sales", label: "上海销售部" },
      { value: "hz_sales", label: "杭州运营中心" },
    ],
  },
  {
    value: "south_branch",
    label: "华南分公司",
    children: [
      { value: "gz_sales", label: "广州市场部" },
      { value: "sz_sales", label: "深圳前海分部", disabled: true },
    ],
  },
];

export default function Demo() {
  const [departmentPath, setDepartmentPath] = useState<CascaderValue>([]);
  return (
    <Space vertical>
      <code>Disabled item:</code>
      <Cascader
        value={departmentPath}
        onChange={setDepartmentPath}
        options={orgOptions}
        placeholder="请指派归属部门"
        style={{ width: 280 }}
      />
      <code>Disabled:</code>
      <Cascader
        disabled
        value={departmentPath}
        options={orgOptions}
        placeholder="请指派归属部门"
        style={{ width: 280 }}
      />
    </Space>
  );
}
