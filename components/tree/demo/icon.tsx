import {
  Folder,
  FolderOpen,
  LogoAndroid,
  LogoApple,
  LogoFeishu,
  LogoQq,
  LogoTwitter,
  LogoWechat,
} from "kui-icons";
import { useState } from "react";
import { Tree, type TreeNode } from "react-kui";
const data: TreeNode[] = [
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
          { title: "index.html", icon: LogoFeishu, key: "1-1-0" },
          { title: "index.md", icon: LogoWechat, key: "1-1-1" },
        ],
      },
      {
        title: "app",
        key: "1-2",
        icon: FolderOpen,
        children: [
          { title: "zen.apk", icon: LogoAndroid, key: "1-2-0" },
          { title: "zen.ipa", icon: LogoApple, key: "1-2-1" },
        ],
      },
    ],
  },
];
export default function App() {
  const [expanded, setExpanded] = useState(["0-0", "1-0", "1-1", "1-2"]);
  return (
    <Tree
      data={data}
      expandedKeys={expanded}
      onExpandedKeysChange={setExpanded}
      onExpand={({ expanded, node }) => {
        node.icon = expanded ? FolderOpen : Folder;
      }}
    />
  );
}
