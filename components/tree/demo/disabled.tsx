import { useState } from "react";
import { Tree, type TreeNode } from "react-kui";
const data: TreeNode[] = [
  {
    title: "tree 1",
    key: "0-0",
    children: [
      {
        title: "tree 1-1",
        key: "1-0",
        disabled: true,
        children: [
          { title: "leaf 1-1-1", key: "1-0-0", disabled: true },
          { title: "leaf 1-1-2", key: "1-0-1" },
        ],
      },
      {
        title: "tree 1-2",
        key: "1-1",
        children: [
          { title: "leaf 1-2-1", key: "1-2-1" },
          { title: "leaf 1-2-2", key: "1-2-2" },
        ],
      },
    ],
  },
];
export default function Disabled() {
  const [expanded, setExpanded] = useState(["0-0", "1-0", "1-1"]),
    [checked, setChecked] = useState(["1-0-0"]);
  return (
    <Tree
      data={data}
      checkable
      checkedKeys={checked}
      onCheckedKeysChange={setChecked}
      expandedKeys={expanded}
      onExpandedKeysChange={setExpanded}
      onCheck={(node) => console.log(node)}
    />
  );
}
