import { Heart } from "kui-icons";
import { Card, Space } from "react-kui";
export default function App() {
  return (
    <Space vertical>
      <Card title="Card" icon={Heart} style={{ width: 256 }}>
        <p>card content</p>
        <p>card content</p>
      </Card>
      <Card title="Card" icon={Heart} style={{ width: 256 }}>
        <p>card content</p>
        <p>card content</p>
      </Card>
    </Space>
  );
}
