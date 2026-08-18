import { Space, Steps } from "react-kui";
const items = [{ title: "提交" }, { title: "审核" }, { title: "完成" }];
export default function App() {
  return (
    <Space vertical block>
      <Steps current={1} status="error" items={items} />
      <Steps current={2} items={[...items.slice(0, 2), { title: "完成", status: "error" }]} />
    </Space>
  );
}
