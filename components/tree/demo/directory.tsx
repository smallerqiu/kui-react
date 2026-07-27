import {
  Folder,
  FolderOpen,
  LogoAndroid,
  LogoApple,
  LogoFeishu,
  LogoQq,
  LogoTwitter,
  LogoWechat,
  Plus,
  SquarePen,
  Trash,
} from "kui-icons";
import { useRef, useState } from "react";
import { Button } from "../../button";
import Checkbox from "../../checkbox";
import Space from "../../space";
import Tree, { type TreeNode } from "../index";
const initial: TreeNode[] = [
  {
    title: "src",
    key: "0-0",
    icon: FolderOpen,
    children: [
      {
        title: "assets",
        key: "1-0",
        icon: FolderOpen,
        children: [
          { title: "main.js", icon: LogoTwitter, disabled: true, key: "1-0-0" },
          { title: "test.py", icon: LogoQq, key: "1-0-1" },
        ],
      },
      {
        title: "pages",
        key: "1-1",
        icon: FolderOpen,
        children: [
          { title: "index.html", icon: LogoFeishu, key: "1-1-1" },
          { title: "index.md", icon: LogoWechat, key: "1-1-2" },
        ],
      },
      {
        title: "app",
        key: "1-2",
        icon: FolderOpen,
        children: [
          { title: "zen.apk", icon: LogoAndroid, key: "1-2-1" },
          { title: "zen.ipa", icon: LogoApple, key: "1-2-2" },
        ],
      },
    ],
  },
  { title: "src11", key: "0-1", icon: FolderOpen },
];
const find = (nodes: TreeNode[], key: string): TreeNode | undefined => {
  for (const node of nodes) {
    if (node.key === key) return node;
    const child = node.children && find(node.children, key);
    if (child) return child;
  }
};
const remove = (nodes: TreeNode[], key: string): boolean => {
  const i = nodes.findIndex((n) => n.key === key);
  if (i >= 0) {
    nodes.splice(i, 1);
    return true;
  }
  return nodes.some((n) => !!n.children && remove(n.children, key));
};
export default function Directory() {
  const [data, setData] = useState(initial),
    [expanded, setExpanded] = useState(["0-0", "1-0", "1-1", "1-2"]),
    [selected, setSelected] = useState(["0-0"]),
    [directory, setDirectory] = useState(true),
    [showLine, setShowLine] = useState(true),
    [draggable, setDraggable] = useState(true),
    [checkable, setCheckable] = useState(true),
    [showIcon, setShowIcon] = useState(true),
    [showExtra, setShowExtra] = useState(true),
    [multiple, setMultiple] = useState(false),
    [strict, setStrict] = useState(false);
  const count = useRef(0);
  const mutate = (fn: (next: TreeNode[]) => void) => {
    const next = structuredClone(data);
    fn(next);
    setData(next);
  };
  const controls = [
    ["Directory", directory, setDirectory],
    ["showLine", showLine, setShowLine],
    ["Draggable", draggable, setDraggable],
    ["Checkable", checkable, setCheckable],
    ["ShowIcon", showIcon, setShowIcon],
    ["ShowExtra", showExtra, setShowExtra],
    ["Multiple", multiple, setMultiple],
    ["checkStrictly", strict, setStrict],
  ] as const;
  const extra = (node: TreeNode) => (
    <Space>
      <Button
        size="small"
        type="text"
        icon={Plus}
        onClick={(e) => {
          e.stopPropagation();
          mutate((next) => {
            const target = find(next, node.key);
            if (target) {
              target.icon = FolderOpen;
              (target.children ??= []).push({
                title: "Append Node",
                key: `${node.key}-append-${++count.current}`,
              });
            }
          });
          setExpanded((keys) => (keys.includes(node.key) ? keys : [...keys, node.key]));
        }}
      />
      {node.key !== "0-0" && (
        <Button
          size="small"
          type="text"
          icon={Trash}
          onClick={(e) => {
            e.stopPropagation();
            mutate((next) => {
              remove(next, node.key);
            });
          }}
        />
      )}
      <Button
        size="small"
        type="text"
        icon={SquarePen}
        onClick={(e) => {
          e.stopPropagation();
          const title = prompt("修改节点名称", String(node.title));
          if (title?.trim())
            mutate((next) => {
              const target = find(next, node.key);
              if (target) target.title = title;
            });
        }}
      />
    </Space>
  );
  return (
    <div>
      <Space wrap>
        {controls.map(([label, value, set]) => (
          <Checkbox key={label} checked={value} onChange={set} label={label} />
        ))}
      </Space>
      <br />
      <br />
      <Tree
        data={data}
        directory={directory}
        draggable={draggable}
        checkable={checkable}
        multiple={multiple}
        showLine={showLine}
        showIcon={showIcon}
        showExtra={showExtra}
        selectedKeys={selected}
        onSelectedKeysChange={setSelected}
        expandedKeys={expanded}
        onExpandedKeysChange={setExpanded}
        checkStrictly={strict}
        renderExtra={extra}
        onExpand={({ expanded, node }) => {
          node.icon = expanded ? FolderOpen : Folder;
          console.log(node);
        }}
        onCheck={(node, checked) => console.log(node, checked)}
      />
    </div>
  );
}
