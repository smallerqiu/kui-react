import { useState } from "react";
import { Transfer } from "react-kui";
const items = [
  { key: 1, title: "Ava", description: "Product designer" },
  { key: 2, title: "Leo", description: "Frontend developer" },
  { key: 3, title: "Mia", description: "Project owner", disabled: true },
  { key: 4, title: "Noah", description: "QA engineer" },
];
export default function App() {
  const [selected, setSelected] = useState<(string | number)[]>([2]);
  return (
    <div style={{ display: "grid", gap: 24 }}>
      <Transfer
        targetKeys={selected}
        onChange={(event) => setSelected(event.targetKeys)}
        dataSource={items}
        titles={["成员", "项目成员"]}
      />
      <Transfer
        targetKeys={selected}
        onChange={(event) => setSelected(event.targetKeys)}
        disabled
        dataSource={items}
        titles={["成员", "项目成员"]}
      />
    </div>
  );
}
