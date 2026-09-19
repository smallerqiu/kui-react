import { useState } from "react";
import { RadioGroup, Select, Space } from "react-kui";
import type { SizeType } from "react-kui";
import { data } from "./data";
const sizes = ["large", "medium", "small"].map((value) => ({ label: value, value }));
export default function App() {
  const [size, setSize] = useState<SizeType>("medium"),
    [v1, setV1] = useState<number>(0),
    [v2, setV2] = useState<number[]>([0, 1]),
    [v3, setV3] = useState<number[]>([0, 1, 2]);
  return (
    <Space vertical block>
      <RadioGroup value={size} onChange={setSize} type="button" options={sizes} />
      <br />
      <Select
        value={v1}
        onChange={(v) => typeof v === "number" && setV1(v)}
        size={size}
        filterable
        block
        options={data}
      />
      <Select
        value={v2}
        onChange={(v) => Array.isArray(v) && setV2(v.map(Number))}
        size={size}
        block
        options={data}
        multiple
      />
      <Select
        value={v3}
        onChange={(v) => Array.isArray(v) && setV3(v.map(Number))}
        size={size}
        maxTagCount={2}
        options={data}
        multiple
        block
      />
    </Space>
  );
}
