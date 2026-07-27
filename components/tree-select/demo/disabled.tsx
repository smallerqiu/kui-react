import { useState } from "react";
import { Space, TreeSelect } from "react-kui";
import { expandedKeys, data as source } from "./data";
const data = structuredClone(source);
data[0].children![0].disabled = true;
data[0].children![0].children![1].children![1].disabled = true;
export default function Disabled() {
  const [value1, setValue1] = useState<Array<string | number>>(["0-1", "1-1"]),
    [value2, setValue2] = useState<Array<string | number>>(["0-1", "1-1-2", "1-1-2-1", "1-2-1"]);
  return (
    <Space vertical>
      <TreeSelect
        value={value1}
        onChange={(v) => setValue1(v as Array<string | number>)}
        treeData={data}
        treeExpandedKeys={expandedKeys}
        filterable
        disabled
        block
      />
      <TreeSelect
        value={value1}
        onChange={(v) => setValue1(v as Array<string | number>)}
        treeData={data}
        treeExpandedKeys={expandedKeys}
        multiple
        filterable
        disabled
        block
      />
      disabled items
      <TreeSelect
        value={value2}
        onChange={(v) => setValue2(v as Array<string | number>)}
        treeData={data}
        treeExpandedKeys={expandedKeys}
        multiple
        treeCheckable
        maxTagCount={2}
        filterable
      />
      clearable=false
      <TreeSelect
        value={value2}
        onChange={(v) => setValue2(v as Array<string | number>)}
        treeData={data}
        treeExpandedKeys={expandedKeys}
        multiple
        treeCheckable
        maxTagCount={2}
        filterable
        clearable={false}
      />
    </Space>
  );
}
