import { useState } from "react";
import { Space, InputNumber } from "react-kui";
export default function App() {
  const [n, setN] = useState(0.1),
    [n1, setN1] = useState(0.1),
    [n3, setN3] = useState(3.14159),
    [n4, setN4] = useState(1000),
    [n5, setN5] = useState(98),
    [n7, setN7] = useState(111111);
  const bind = (set: (v: number) => void) => (v: number | undefined) => set(v ?? 0);
  return (
    <Space vertical block>
      <code>0.1+0.2 = 0.3 (yes), output：{n}</code>
      <InputNumber step={0.2} value={n} onChange={bind(setN)} />
      <code>step is 0.00000000000001, output：{n1}</code>
      <InputNumber value={n1} min={0} max={10} step={0.00000000000001} onChange={bind(setN1)} />
      <code>Keep 2 decimal places, output：{n3}</code>
      <InputNumber precision={2} value={n3} onChange={bind(setN3)} />
      <code>Currency, thousandths, output：{n4}</code>
      <InputNumber
        value={n4}
        min={0}
        formatter={(v) => `￥ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        parser={(v) => v.replace(/￥\s?|(,*)/g, "")}
        onChange={bind(setN4)}
      />
      <code>percent %, output：{n5}</code>
      <InputNumber
        value={n5}
        min={0}
        max={100}
        formatter={(v) => `${v}%`}
        parser={(v) => v.replace("%", "")}
        onChange={bind(setN5)}
      />
      <code>custom, output：{n7}</code>
      <InputNumber
        value={n7}
        formatter={(v) => String(v).split("").join("-")}
        parser={(v) => v.replace(/-/g, "")}
        onChange={bind(setN7)}
      />
    </Space>
  );
}
