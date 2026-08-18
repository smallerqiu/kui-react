import { Mentions, Space } from "react-kui";
const options = ["小北", "开发团队"];
export default function App() {
  return (
    <Space vertical>
      <Mentions placement="bottom-left" options={options} />
      <Mentions placement="top-right" options={options} />
    </Space>
  );
}
