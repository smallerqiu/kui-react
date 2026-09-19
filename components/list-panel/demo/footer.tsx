import { ListPanel, Page, Table } from "react-kui";
const columns = [
  { title: "Name", key: "name" },
  { title: "Email", key: "email" },
];
const data = [{ key: 1, name: "Alex", email: "alex@example.com" }];
export default function App() {
  return (
    <ListPanel
      summary="Total 128 users"
      size="small"
      shape="square"
      footer={<Page total={128} pageSize={10} showTotal />}
    >
      <Table data={data} columns={columns} size="small" />
    </ListPanel>
  );
}
