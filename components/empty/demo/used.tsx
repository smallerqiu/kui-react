import { Select, Space, Table, type Column } from "react-kui";
const columns: Column[] = [
  { title: "Name", key: "name" },
  { title: "Age", key: "age" },
];
export default function App() {
  return (
    <Space vertical block>
      Select:
      <Select width={220} />
      Table:
      <Table data={[]} columns={columns} />
    </Space>
  );
}
