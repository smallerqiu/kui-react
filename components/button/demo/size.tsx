import { Download } from "kui-icons";
import { useState } from "react";
import type { SizeType } from "../../const/types";
import Space from "../../space";
import { Button } from "../index";
export default function SizeDemo() {
  const [size, setSize] = useState<SizeType>("medium");
  return (
    <Space vertical align="start">
      <Space>
        {(["large", "medium", "small"] as SizeType[]).map((item) => (
          <Button
            key={item}
            type={size === item ? "primary" : "default"}
            onClick={() => setSize(item)}
          >
            {item}
          </Button>
        ))}
      </Space>
      <Space wrap>
        <Button type="primary" size={size}>
          Primary
        </Button>
        <Button size={size}>Default</Button>
        <Button type="text" size={size}>
          Text
        </Button>
        <Button type="link" size={size}>
          Link
        </Button>
        <Button type="primary" size={size} icon={Download} />
        <Button type="primary" shape="circle" size={size} icon={Download} />
        <Button type="primary" size={size} icon={Download}>
          Download
        </Button>
      </Space>
    </Space>
  );
}
