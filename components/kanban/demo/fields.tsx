import { Card, Kanban, message } from "react-kui";
const columns = [
  { key: 0, title: "New" },
  { key: 1, title: "Resolved" },
];
const tickets = [
  { key: "K-101", stage: 0, summary: "Login page feedback" },
  { key: "K-102", stage: 1, summary: "Update dependencies" },
];
export default function App() {
  return (
    <Kanban
      columns={columns}
      data={tickets}
      rowKey="key"
      statusKey="stage"
      minColumnWidth="220px"
      onItemClick={(item) => message.info(String(item.key))}
      item={(item) => <Card size="small">{String(item.summary)}</Card>}
    />
  );
}
