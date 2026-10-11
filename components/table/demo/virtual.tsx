import { Table, type Column } from "react-kui";

const data = Array.from({ length: 10000 }, (_, index) => ({
  key: index + 1,
  name: `User ${index + 1}`,
  email: `user${index + 1}@example.com`,
  status: index % 3 === 0 ? "Active" : "Pending",
}));

const columns: Column[] = [
  { title: "ID", key: "key", width: 100 },
  { title: "Name", key: "name", width: 200 },
  { title: "Email", key: "email", width: 200 },
  { title: "Email1", key: "email1", width: 100 },
  { title: "Email2", key: "email2", width: 100 },
  { title: "Email3", key: "email3", width: 100 },
  { title: "Email4", key: "email4", width: 100 },
  { title: "Email5", key: "email5", width: 100 },
  { title: "Status", key: "status", width: 140, fixed: "right" },
];

export default function VirtualDemo() {
  return (
    <Table
      virtual
      striped
      data={data}
      columns={columns}
      scroll={{ x: 900, y: 360 }}
      itemHeight={44}
      overscan={6}
    />
  );
}
