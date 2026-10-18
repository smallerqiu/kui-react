import { useState } from "react";
import {
  Cascader,
  Space,
  type CascaderOption,
  type CascaderValue,
  type ThemeType,
} from "react-kui";

const areaOptions: CascaderOption[] = [
  {
    value: "hubei",
    label: "湖北省",
    children: [
      { value: "wuhan", label: "武汉市", children: [{ value: "hongshan", label: "洪山区" }] },
      { value: "huanggang", label: "黄冈市" },
    ],
  },
  {
    value: "guangdong",
    label: "广东省",
    children: [
      { value: "shenzhen", label: "深圳市", children: [{ value: "nanshan", label: "南山区" }] },
      { value: "guangzhou", label: "广州市" },
    ],
  },
];

// A cascader is a text control with a tree behind it, so it paints the same six tiers an input does: `fill`
// — its own look — plates the box, `outline` and `dashed` edge it, `plain` leaves it bare, `solid` plates it
// on the primary and inverts the chosen path and the arrow, `underlined` keeps only the bottom rule. Only the
// trigger box takes a tier; the popup it opens keeps the library's popup surface in every one of them.
const tiers: ThemeType[] = ["fill", "outline", "plain", "solid", "dashed", "underlined"];

export default function App() {
  const [selected, setSelected] = useState<CascaderValue>(["guangdong", "shenzhen", "nanshan"]);
  return (
    <Space vertical block style={{ width: 260, maxWidth: "100%" }}>
      {tiers.map((tier) => (
        <div key={tier} style={{ display: "grid", gap: 4, justifyItems: "start" }}>
          <code>theme: {tier}</code>
          <Cascader
            value={selected}
            onChange={setSelected}
            options={areaOptions}
            theme={tier}
            placeholder="请选择省市区"
            style={{ width: "100%" }}
          />
        </div>
      ))}
    </Space>
  );
}
