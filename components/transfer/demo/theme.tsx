import { useState } from "react";
import { Transfer } from "react-kui";
const items = ["Design", "Development", "Testing", "Deployment"].map((title, key) => ({
  key: key + 1,
  title,
}));
export default function App() {
  const [outline, setOutline] = useState<(string | number)[]>([4]);
  const [fill, setFill] = useState<(string | number)[]>([4]);
  return (
    <div style={{ display: "grid", gap: 24 }}>
      <Transfer
        targetKeys={outline}
        onChange={(event) => setOutline(event.targetKeys)}
        searchable
        theme="outline"
        dataSource={items}
      />
      <Transfer
        targetKeys={fill}
        onChange={(event) => setFill(event.targetKeys)}
        searchable
        theme="fill"
        dataSource={items}
      />
    </div>
  );
}
