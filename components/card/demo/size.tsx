import { Card, Space } from "react-kui";
import type { SizeType } from "react-kui";

const sizes: SizeType[] = ["small", "medium", "large"];

export default function Demo() {
  return (
    <Space vertical block>
      {sizes.map((size) => (
        <Card key={size} size={size} title={`${size} card`} bordered>
          Card content
        </Card>
      ))}
    </Space>
  );
}
