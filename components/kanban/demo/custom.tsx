import { Badge, Button, Card, Empty, Kanban, Space } from "react-kui";
const columns = [
  { key: "todo", title: "待处理", color: "#87909c" },
  { key: "doing", title: "进行中", color: "#3a95ff" },
  { key: "done", title: "已完成", color: "#22a06b" },
];
const tasks = [
  { id: 1, status: "todo", title: "整理需求", owner: "Mia" },
  { id: 2, status: "doing", title: "开发看板", owner: "Alex" },
];
export default function App() {
  return (
    <Kanban
      columns={columns}
      data={tasks}
      draggable={false}
      columnTitle={(column, items) => (
        <Space>
          <Badge color={column.color} />
          {column.title} ({items.length})
        </Space>
      )}
      item={(item) => (
        <Card size="small">
          <strong>{String(item.title)}</strong>
          <p>{String(item.owner)}</p>
        </Card>
      )}
      empty={() => <Empty description="当前没有任务" />}
      footer={(column) => <Button block>添加到 {column.title}</Button>}
    />
  );
}
