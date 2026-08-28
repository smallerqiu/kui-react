import { useState } from "react";
import { Transfer } from "react-kui";
const items = ["Design", "Development", "Testing", "Deployment"].map((title, key) => ({
  key,
  title,
}));
export default function App() {
  const [selected, setSelected] = useState<(string | number)[]>([]);
  return (
    <Transfer
      targetKeys={selected}
      onChange={(event) => setSelected(event.targetKeys)}
      searchable
      dataSource={items}
      operations={["Add", "Remove"]}
    />
  );
}
