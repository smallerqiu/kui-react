import { Transfer } from "react-kui";
const items = [
  { key: 1, title: "Ava", description: "Product designer" },
  { key: 2, title: "Leo", description: "Frontend developer" },
  { key: 3, title: "Mia", description: "Project owner", disabled: true },
  { key: 4, title: "Noah", description: "QA engineer" },
];
export default function App() {
  return (
    <div style={{ display: "grid", gap: 24 }}>
      <Transfer
        defaultTargetKeys={[2]}
        dataSource={items}
        titles={["Members", "Project members"]}
      />
      <Transfer
        defaultTargetKeys={[2]}
        disabled
        dataSource={items}
        titles={["Members", "Project members"]}
      />
    </div>
  );
}
