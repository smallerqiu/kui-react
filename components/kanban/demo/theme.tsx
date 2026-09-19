import { useState } from "react";
import { Card, Kanban, RadioGroup, Space } from "react-kui";
const columns = [
  { key: "todo", title: "Todo", color: "#87909c" },
  { key: "doing", title: "Doing", color: "#3a95ff" },
  { key: "done", title: "Done", color: "#22a06b" },
];
const tasks = [
  { id: 1, status: "todo", title: "Define requirements" },
  { id: 2, status: "doing", title: "Build component" },
];
export default function App() {
  const [theme, setTheme] = useState<"fill" | "outline">("fill");
  return (
    <Space vertical block>
      <RadioGroup
        type="button"
        options={[
          { label: "Fill", value: "fill" },
          { label: "Outline", value: "outline" },
        ]}
        value={theme}
        onChange={(value) => setTheme(value as typeof theme)}
      />
      <Kanban
        columns={columns}
        data={tasks}
        theme={theme}
        item={(item) => (
          <Card size="small" theme={theme}>
            {String(item.title)}
          </Card>
        )}
      />
    </Space>
  );
}
