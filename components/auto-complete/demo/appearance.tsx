import { AutoComplete, Space } from "react-kui";
const options = ["Vue", "Vite", "Vitest"];
export default function App() {
  return (
    <Space vertical>
      <AutoComplete size="small" theme="plain" options={options} placeholder="small / plain" />
      <AutoComplete
        shape="square"
        theme="outline"
        options={options}
        placeholder="square / outline"
      />
      <AutoComplete size="large" shape="circle" options={options} placeholder="large / circle" />
    </Space>
  );
}
