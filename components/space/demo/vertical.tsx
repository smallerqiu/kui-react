import { Heart } from "kui-icons";
import Card from "../../card";
import Space from "../index";
export default function Vertical() {
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
