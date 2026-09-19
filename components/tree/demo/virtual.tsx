import { Tree } from "react-kui";

const data = Array.from({ length: 5000 }, (_, index) => ({
  key: `node-${index}`,
  title: `Node ${index + 1}`,
}));

export default function VirtualDemo() {
  return <Tree virtual data={data} height={320} itemHeight={28} />;
}
