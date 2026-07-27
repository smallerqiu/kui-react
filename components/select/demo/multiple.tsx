import { useState } from "react";
import Space from "../../space";
import { Option, Select } from "../index";
import { data } from "./data";
export default function Multiple() {
  const [v1, setV1] = useState<any[]>([0, 2]),
    [v2, setV2] = useState<any[]>([0, 2]),
    [v3, setV3] = useState<any[]>([0, 2, 3]);
  return (
    <Space vertical block>
      <code>value: {v1.join(", ")}</code>
      <Select value={v1} onChange={(v) => setV1(v as any[])} block options={data} multiple />
      <br />
      <code>value: {v2.join(", ")}</code>
      <Select value={v2} onChange={(v) => setV2(v as any[])} block multiple>
        {data.map((item) => (
          <Option key={item.value} value={item.value} label={item.label} />
        ))}
      </Select>
      <br />
      <code>value: {v3.join(", ")}</code>
      <Select
        value={v3}
        onChange={(v) => setV3(v as any[])}
        block
        maxTagCount={2}
        options={data}
        multiple
      />
    </Space>
  );
}
