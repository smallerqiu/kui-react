import { useState } from "react";
import Space from "../../space";
import TreeSelect from "../index";
import { data, expandedKeys } from "./data";
export default function Multiple() {
  const [value1, setValue1] = useState<Array<string | number>>(["0-1", "1-1"]),
    [value2, setValue2] = useState<Array<string | number>>(["0-1", "1-1-2", "1-1-2-1", "1-2-1"]);
  return (
    <Space vertical>
      <TreeSelect
        value={value1}
        onChange={(v) => setValue1(v as Array<string | number>)}
        treeData={data}
        treeExpandedKeys={expandedKeys}
        multiple
        filterable
        clearable
        block
      />
      <br />
      maxTagCount
      <TreeSelect
        value={value2}
        onChange={(v) => setValue2(v as Array<string | number>)}
        treeData={data}
        treeExpandedKeys={expandedKeys}
        multiple
        maxTagCount={2}
        style={{ width: "100%" }}
        filterable
        clearable
      />
    </Space>
  );
}
