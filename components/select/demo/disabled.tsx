import { useState } from "react";
import { Space, Select } from "react-kui";
import { data as source } from "./data";
const data = source.map((item) => (item.value === 1 ? { ...item, disabled: true } : item));
export default function App() {
  const [v1, setV1] = useState<string | number>(2),
    [v2, setV2] = useState<Array<string | number>>([0, 3]),
    [v3] = useState<Array<string | number>>([0, 2, 3]);
  return (
    <Space vertical block>
      Disabled
      <Select value={v1} block disabled options={data} />
      <Select value={v2} block disabled options={data} multiple />
      <Select value={v3} disabled maxTagCount={2} options={data} multiple block />
      <br />
      Disabled item
      <Select
        value={v1}
        onChange={(value) => !Array.isArray(value) && setV1(value)}
        block
        options={data}
      />
      <br />
      Clearable = false
      <Select
        value={v1}
        onChange={(value) => !Array.isArray(value) && setV1(value)}
        block
        clearable={false}
        options={data}
      />
      <Select
        value={v2}
        onChange={(value) => setV2(value as Array<string | number>)}
        block
        clearable={false}
        options={data}
        multiple
      />
    </Space>
  );
}
