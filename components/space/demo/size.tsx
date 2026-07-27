import { Button } from "../../button";
import Space from "../index";
export default function SizeDemo() {
  return (
    <Space vertical>
      {(["small", "medium", "large"] as const).map((size) => (
        <div key={size}>
          <code>{size}</code>
          <Space size={size}>
            {Array.from({ length: 5 }, (_, index) => (
              <Button key={index}>{size}</Button>
            ))}
          </Space>
        </div>
      ))}
      <Space size={[8, 20]} wrap>
        {Array.from({ length: 10 }, (_, index) => (
          <Button size="small" key={index}>
            Wrap
          </Button>
        ))}
      </Space>
    </Space>
  );
}
