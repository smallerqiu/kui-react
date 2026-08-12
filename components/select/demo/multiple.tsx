import { useState } from "react";
import { Space, Option, Select } from "react-kui";
import { data } from "./data";
export default function App() {
  const [v1, setV1] = useState<(string | number)[]>([0, 2]),
    [v2, setV2] = useState<(string | number)[]>([0, 2]),
    [v3, setV3] = useState<(string | number)[]>([0, 2, 3]);
  return (
    <Space vertical block>
      <code>value: {v1.join(", ")}</code>
      <Select value={v1} onChange={(v) => Array.isArray(v) && setV1(v)} block options={data} multiple />
      <br />
      <code>value: {v2.join(", ")}</code>
      <Select value={v2} onChange={(v) => Array.isArray(v) && setV2(v)} block multiple>
        {data.map((item) => (
          <Option key={item.value} value={item.value} label={item.label} />
        ))}
      </Select>
      <br />
      <code>value: {v3.join(", ")}</code>
      <Select
        value={v3}
        onChange={(v) => Array.isArray(v) && setV3(v)}
        block
        maxTagCount={2}
        options={data}
        multiple
      />
    </Space>
  );
}
