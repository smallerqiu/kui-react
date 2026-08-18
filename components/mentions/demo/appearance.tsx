import { Mentions, Space } from "react-kui";
const options = ["小北", "设计团队", "开发团队"];
export default function App() {
  return (
    <Space vertical>
      <Mentions size="small" theme="plain" options={options} />
      <Mentions shape="square" theme="outline" options={options} />
      <Mentions size="large" shape="circle" options={options} />
    </Space>
  );
}
