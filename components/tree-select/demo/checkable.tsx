import { useState } from "react";
import Checkbox from "../../checkbox";
import Space from "../../space";
import TreeSelect from "../index";
import { data, expandedKeys } from "./data";
export default function Checkable() {
  const [value, setValue] = useState<Array<string | number>>([]),
    [strict, setStrict] = useState(false);
  return (
    <Space vertical>
      <Checkbox checked={strict} onChange={setStrict}>
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
