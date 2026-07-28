import { useState } from "react";
import { Checkbox, Space, TreeSelect } from "react-kui";
import { data, expandedKeys } from "./data";
export default function App() {
  const [value, setValue] = useState<Array<string | number>>([]),
    [strict, setStrict] = useState(false);
  return (
    <Space vertical>
      <Checkbox checked={strict} onChange={(event) => setStrict(event.checked)}>
        TreeCheckStrictly
      </Checkbox>
      <TreeSelect
        value={value}
        onChange={(v) => setValue(v as Array<string | number>)}
        treeData={data}
        treeExpandedKeys={expandedKeys}
        multiple
        block
        treeCheckable
        treeCheckStrictly={strict}
      />
    </Space>
  );
}
