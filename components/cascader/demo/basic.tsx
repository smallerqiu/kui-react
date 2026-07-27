import { useState } from "react";
import { Cascader, Space, type CascaderOption, type CascaderValue } from "react-kui";

const areaOptions: CascaderOption[] = [
  {
    value: "hubei",
    label: "湖北省",
    children: [
      {
        value: "wuhan",
        label: "武汉市",
        children: [
          { value: "hongshan", label: "洪山区" },
          { value: "wuchang", label: "武昌区" },
        ],
      },
      { value: "huanggang", label: "黄冈市", children: [{ value: "huangzhou", label: "黄州" }] },
    ],
  },
  {
    value: "guangdong",
    label: "广东省",
    children: [
      { value: "shenzhen", label: "深圳市", children: [{ value: "nanshan", label: "南山区" }] },
    ],
  },
];

export default function Demo() {
  const [selectedArea, setSelectedArea] = useState<CascaderValue>(["hubei", "wuhan", "wuchang"]);
  return (
    <Space vertical>
      <code>Value：{JSON.stringify(selectedArea)}</code>
      <Cascader
        value={selectedArea}
        onChange={setSelectedArea}
        options={areaOptions}
        placeholder="请选择省市区"
        style={{ width: 260 }}
      />
    </Space>
  );
}
