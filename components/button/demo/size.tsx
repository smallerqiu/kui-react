import { Download } from "kui-icons";
import { useState } from "react";
import { Button, RadioButton, RadioGroup, type SizeType, Space } from "react-kui";
export default function App() {
  const [size, setSize] = useState<SizeType>("medium");
  return (
    <Space vertical align="start">
      <RadioGroup value={size} type="button" theme="card" onChange={setSize}>
        <RadioButton value="large" label="Large" />
        <RadioButton value="medium" label="Medium" />
        <RadioButton value="small" label="Small" />
      </RadioGroup>
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
        <Button type="primary" shape="circle" size={size} icon={Download}>
          Download
        </Button>
        <Button type="primary" size={size} icon={Download}>
          Download
        </Button>
      </Space>
    </Space>
  );
}
