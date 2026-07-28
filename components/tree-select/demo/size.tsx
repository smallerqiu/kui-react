import { useState } from "react";
import { type SizeType, RadioGroup, Space, TreeSelect } from "react-kui";
import { data, expandedKeys } from "./data";
const sizes = [
  { value: "large", label: "Large" },
  { value: "medium", label: "Default" },
  { value: "small", label: "Small" },
];
export default function App() {
  const [size, setSize] = useState<SizeType>("medium"),
    [value, setValue] = useState<string | number | null>("0-1"),
    [multiple, setMultiple] = useState<Array<string | number>>(["0-1"]);
  return (
    <Space vertical block style={{ width: 300, maxWidth: "100%" }}>
      <RadioGroup value={size} onChange={setSize} options={sizes} type="button" />
      <TreeSelect
        size={size}
        value={value}
        onChange={(v) => setValue(v as string | number | null)}
        treeData={data}
        treeShowLine
        treeExpandedKeys={expandedKeys}
        block
      />
      <TreeSelect
        size={size}
        value={multiple}
        onChange={(v) => setMultiple(v as Array<string | number>)}
        treeData={data}
        treeShowLine
        treeExpandedKeys={expandedKeys}
        block
        multiple
      />
      <TreeSelect
        size={size}
        value={multiple}
        onChange={(v) => setMultiple(v as Array<string | number>)}
        treeData={data}
        treeShowLine
        treeExpandedKeys={expandedKeys}
        block
        multiple
        maxTagCount={2}
      />
    </Space>
  );
}
