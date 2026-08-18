import { InputTag, Space } from "react-kui";
export default function App() {
  return (
    <Space vertical>
      <InputTag size="small" theme="plain" defaultValue={["React"]} />
      <InputTag shape="square" theme="outline" defaultValue={["React"]} />
      <InputTag size="large" shape="circle" defaultValue={["React"]} />
    </Space>
  );
}
