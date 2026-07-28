import { Button, Space, notice } from "react-kui";
const types = ["info", "warning", "success", "error"] as const;
export default function App() {
  return (
    <Space vertical>
      {types.map((type) => (
        <Button
          key={type}
          onClick={() => notice[type]({ title: "Title", content: "Content message.", duration: 5 })}
        >
          {type[0].toUpperCase() + type.slice(1)}
        </Button>
      ))}
    </Space>
  );
}
