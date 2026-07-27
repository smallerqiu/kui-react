import { useState } from "react";
import { Space, TreeSelect } from "react-kui";
import { data, expandedKeys } from "./data";
export default function Basic() {
  const [value, setValue] = useState<string | number | null>("0-1");
  return (
    <Space vertical>
      <code>value: {String(value)}</code>
      <TreeSelect
        value={value}
        onChange={(v) => setValue(v as string | number | null)}
        treeData={data}
        treeShowLine
        treeExpandedKeys={expandedKeys}
        block
      />
    </Space>
  );
}
