import { useState } from "react";
import { Button, message, Tree, type TreeNode } from "react-kui";
const data: TreeNode[] = [
  {
    title: "tree 1",
    key: "0-0",
    children: [
      {
        title: "tree 1-1",
        key: "0-0-1",
        children: [
          { title: "leaf 1-1-1", key: "0-0-1-1" },
          {
            title: "leaf 1-1-2",
            key: "0-0-1-2",
            children: [
              { title: "leaf 1-1-2-1", key: "1-1-2-1" },
              { title: "leaf 1-1-2-2", key: "1-1-2-2" },
            ],
          },
        ],
      },
    ],
  },
];
export default function CustomRender() {
  const [expanded, setExpanded] = useState(["0-0"]);
  return (
    <Tree
      data={data}
      expandedKeys={expanded}
      onExpandedKeysChange={setExpanded}
      onExpand={console.log}
      showExtra
      renderExtra={(node) => (
        <Button
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            message.info(String(node.title));
          }}
          style={{ marginRight: 5 }}
        >
          test
        </Button>
      )}
    />
  );
}
