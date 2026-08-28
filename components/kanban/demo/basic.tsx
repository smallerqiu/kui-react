import { useState } from "react";
import { Card, Kanban, type KanbanItemData, type KanbanMoveEvent } from "react-kui";
const columns = [
  { key: "todo", title: "Todo", color: "#87909c" },
  { key: "doing", title: "Doing", color: "#3a95ff" },
  { key: "done", title: "Done", color: "#22a06b" },
];
export default function App() {
  const [tasks, setTasks] = useState<KanbanItemData[]>([
    { id: 1, status: "todo", title: "Define requirements" },
    { id: 2, status: "doing", title: "Build component" },
  ]);
  const move = ({ item, to }: KanbanMoveEvent) =>
    setTasks((items) => items.map((entry) => (entry === item ? { ...entry, status: to } : entry)));
  return (
    <Kanban
      columns={columns}
      data={tasks}
      onMove={move}
      item={(item) => (
        <Card size="small" bordered>
          {String(item.title)}
        </Card>
      )}
    />
  );
}
