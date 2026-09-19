import { Mentions, Space } from "react-kui";

const options = ["产品", "设计", "研发"];

export default function App() {
  return (
    <Space vertical>
      <Mentions size="small" options={options} placeholder="small size" />
      <Mentions options={options} placeholder="default size" />
      <Mentions size="large" shape="circle" options={options} placeholder="large size" />
    </Space>
  );
}
