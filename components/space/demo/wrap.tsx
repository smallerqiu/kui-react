import { Button, Space } from "react-kui";
export default function App() {
  return (
    <Space size={[8, 20]} wrap>
      {Array.from({ length: 25 }, (_, index) => (
        <Button size="small" key={index}>
          Wrap
        </Button>
      ))}
    </Space>
  );
}
