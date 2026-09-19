import { Tag, Table, type Column } from "react-kui";

interface Department {
  key: string;
  name: string;
  owner: string;
  members: number;
  status: "active" | "planning";
  children?: Department[];
}

const data: Department[] = [
  {
    key: "product",
    name: "Product Center",
    owner: "Alice",
    members: 24,
    status: "active",
    children: [
      { key: "design", name: "Design Team", owner: "Mia", members: 8, status: "active" },
      {
        key: "research",
        name: "Research Team",
        owner: "Leo",
        members: 6,
        status: "planning",
        children: [
          { key: "ai-lab", name: "AI Lab", owner: "Noah", members: 3, status: "planning" },
        ],
      },
    ],
  },
  {
    key: "engineering",
    name: "Engineering Center",
    owner: "Jack",
    members: 36,
    status: "active",
    children: [
      { key: "frontend", name: "Frontend Team", owner: "Emma", members: 12, status: "active" },
      { key: "backend", name: "Backend Team", owner: "Ethan", members: 16, status: "active" },
    ],
  },
];

const columns: Column<Department>[] = [
  { key: "name", title: "Department", width: 240 },
  { key: "owner", title: "Owner" },
  { key: "members", title: "Members", sorter: true },
  {
    key: "status",
    title: "Status",
    render: (status) => (
      <Tag color={status === "active" ? "green" : "gold"}>{String(status)}</Tag>
    ),
  },
];

export default function App() {
  return (
    <Table
      bordered
      checkable
      expandRowByClick
      defaultExpandedKeys={["product"]}
      data={data}
      columns={columns}
    />
  );
}
