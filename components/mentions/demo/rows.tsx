import { Mentions, Space } from "react-kui";
const options = ["小北", "设计团队", "开发团队"];
export default function App() {
  return (
    <Space vertical>
      <Mentions rows={1} options={options} placeholder="单行外观，输入 @" />
      <Mentions rows={4} options={options} placeholder="四行文本域，输入 @" />
    </Space>
  );
}
