import { useState } from "react";
import Space from "../../space";
import { Select } from "../index";
import { data as source } from "./data";
const data = source.map((item) => (item.value === 1 ? { ...item, disabled: true } : item));
export default function Disabled() {
  const [v1, setV1] = useState<any>(2),
    [v2, setV2] = useState<any[]>([0, 3]),
    [v3, setV3] = useState<any[]>([0, 2, 3]);
  return (
    <Space vertical block>
      Disabled
      <Select value={v1} block disabled options={data} />
      <Select value={v2} block disabled options={data} multiple />
      <Select value={v3} disabled maxTagCount={2} options={data} multiple block />
      <br />
      Disabled item
      <Select value={v1} onChange={setV1} block options={data} />
      <br />
      Clearable = false
      <Select value={v1} onChange={setV1} block clearable={false} options={data} />
      <Select
        value={v2}
        onChange={(v) => setV2(v as any[])}
        block
        clearable={false}
        options={data}
        multiple
      />
    </Space>
  );
}
