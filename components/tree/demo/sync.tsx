import { useRef, useState } from "react";
import { Tree, type TreeNode } from "react-kui";
const insert = (nodes: TreeNode[], key: string, children: TreeNode[]): boolean => {
  for (const node of nodes) {
    if (node.key === key) {
      node.children = children;
      return true;
    }
    if (node.children && insert(node.children, key, children)) return true;
  }
  return false;
};
export default function App() {
  const [data, setData] = useState<TreeNode[]>([
      { title: "Expand to load", key: "0-0" },
      { title: "Expand to load", key: "0-1" },
      { title: "Tree Node", isLeaf: true, key: "0-2" },
    ]),
    count = useRef(0);
  const loadData = (node: TreeNode) =>
    new Promise<void>((resolve) => {
      count.current += 1;
      setTimeout(() => {
        setData((current) => {
          const next = structuredClone(current);
          insert(next, node.key, [
            { title: "Child Node", isLeaf: count.current >= 2, key: `${node.key}-0` },
            { title: "Child Node", isLeaf: count.current >= 3, key: `${node.key}-1` },
          ]);
          return next;
        });
        resolve();
      }, 1000);
    });
  return <Tree data={data} loadData={loadData} onExpand={console.log} />;
}
