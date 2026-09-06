import { InputTag, Space } from "react-kui";
export default function App() {
  return (
    <Space vertical>
      <InputTag size="small" theme="plain" defaultValue={["Plain"]} />
      <InputTag shape="square" theme="outline" defaultValue={["Outline"]} />
      <InputTag size="large" shape="circle" defaultValue={["Circle"]} />
      <InputTag disabled defaultValue={["Disabled"]} />
    </Space>
  );
}
