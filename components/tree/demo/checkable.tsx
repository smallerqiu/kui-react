import { useState } from "react";
import Checkbox from "../../checkbox";
import Tree, { type TreeNode } from "../index";
const data: TreeNode[] = [
  {
    title: "tree 1",
    key: "0-1",
    children: [
      {
        title: "tree 1-1",
        key: "1-1",
        disabled: true,
        children: [
          { title: "leaf 1-1-1", key: "1-1-1" },
          { title: "leaf 1-1-2", key: "1-1-2" },
        ],
      },
      {
        title: "tree 1-2",
        key: "1-2",
        children: [
          { title: "leaf 1-2-1", key: "aa" },
          { title: "leaf 1-2-2", key: "bb" },
        ],
      },
    ],
  },
];
export default function Checkable() {
  const [strict, setStrict] = useState(false),
    [checked, setChecked] = useState(["1-1", "aa"]),
    [expanded, setExpanded] = useState(["1-1", "1-1-2", "1-2", "0-1"]);
  return (
    <>
      <Checkbox checked={strict} onChange={setStrict}>
        父子节点不关联
      </Checkbox>
      <br />
      <br />
      <Tree
        data={data}
        checkable
        checkedKeys={checked}
        onCheckedKeysChange={setChecked}
        expandedKeys={expanded}
        onExpandedKeysChange={setExpanded}
        onCheck={(node) => console.log(node)}
        checkStrictly={strict}
      />
    </>
  );
}
