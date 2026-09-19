import { Space, TextArea } from "react-kui";
export default function App() {
  return (
    <Space vertical block>
      <TextArea rows={4} placeholder="Please input" />
      <TextArea rows={2} placeholder="Please input" />
      <TextArea rows={2} placeholder="Disabled" disabled />
      <TextArea rows={2} placeholder="Readonly" readOnly />
    </Space>
  );
}
