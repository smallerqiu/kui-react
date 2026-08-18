import { Button, Space, Steps } from "react-kui";
import { useState } from "react";
const items = [{ title: "填写信息" }, { title: "确认内容" }, { title: "完成" }];
export default function App() {
  const [current, setCurrent] = useState(0);
  return (
    <Space vertical block>
      <Steps current={current} items={items} />
      <Space>
        <Button disabled={!current} onClick={() => setCurrent(current - 1)}>
          上一步
        </Button>
        <Button
          type="primary"
          disabled={current === items.length - 1}
          onClick={() => setCurrent(current + 1)}
        >
          下一步
        </Button>
      </Space>
    </Space>
  );
}
