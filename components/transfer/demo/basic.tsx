import { useState } from "react";
import { Transfer } from "react-kui";
const items = Array.from({ length: 8 }, (_, index) => ({
  key: index + 1,
  title: `Item ${index + 1}`,
  disabled: index === 4,
}));
export default function App() {
  const [selected, setSelected] = useState<(string | number)[]>([2]);
  return (
    <Transfer
      dataSource={items}
      targetKeys={selected}
      onChange={(event) => setSelected(event.targetKeys)}
      titles={["Available", "Selected"]}
    />
  );
}
