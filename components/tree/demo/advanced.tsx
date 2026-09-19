import { useRef } from "react";
import { Button, Space, Tag, Tree, type TreeExpose, type TreeFieldNames } from "react-kui";

const fieldNames: TreeFieldNames = { key: "id", title: "name", children: "items" };
const data = [
  {
    id: "guide",
    name: "Guide",
    kind: "group",
    items: [
      { id: "start", name: "Quick Start" },
      { id: "theme", name: "Theme" },
    ],
  },
  {
    id: "components",
    name: "Components",
    kind: "group",
    items: [
      { id: "button", name: "Button" },
      { id: "tree", name: "Tree" },
      { id: "api", name: "API" },
    ],
  },
];

export default function App() {
  const treeRef = useRef<TreeExpose>(null);
  return (
    <Space vertical>
      <Space>
        <Button onClick={() => treeRef.current?.expandAll()}>Expand all</Button>
        <Button onClick={() => treeRef.current?.collapseAll()}>Collapse all</Button>
        <Button onClick={() => treeRef.current?.scrollTo("api")}>Scroll to API</Button>
      </Space>
      <Tree
        ref={treeRef}
        data={data}
        fieldNames={fieldNames}
        height={180}
        renderTitle={(node) => (
          <>
            <span>{String(node.name)}</span>
            {node.kind ? <Tag size="small">{String(node.kind)}</Tag> : null}
          </>
        )}
      />
    </Space>
  );
}
