import { Mentions, Space } from "react-kui";
const options = ["产品", "设计", "研发"];
export default function App() {
  return (
    <Space vertical>
      <Mentions size="small" theme="plain" options={options} placeholder="small / plain" />
      <Mentions shape="square" theme="outline" options={options} placeholder="square / outline" />
      <Mentions size="large" shape="circle" options={options} placeholder="large / circle" />
    </Space>
  );
}
