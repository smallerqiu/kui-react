import { useState } from "react";
import Tree from "../index";
import { expanded, treeData } from "./data";
export default function Basic() {
  const [keys, setKeys] = useState(expanded);
  return <Tree data={treeData} expandedKeys={keys} onExpandedKeysChange={setKeys} />;
}
