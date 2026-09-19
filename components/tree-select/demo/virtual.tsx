import { TreeSelect } from "react-kui";

const data = Array.from({ length: 5000 }, (_, index) => ({
  key: `node-${index}`,
  title: `Node ${index + 1}`,
}));

export default function Demo() {
  return (
    <TreeSelect
      virtual
      filterable
      block
      treeData={data}
      virtualHeight={260}
      placeholder="Select from 5,000 nodes"
    />
  );
}
