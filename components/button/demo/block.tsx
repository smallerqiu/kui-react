import { Space, Button } from "react-kui";
export default function App() {
  return (
    <Space vertical style={{ width: "100%" }}>
      <Button type="primary" block>
        Primary
      </Button>
      <Button type="danger" block>
        Danger
      </Button>
      <Button block>Default</Button>
      <Button type="text" block>
        Text
      </Button>
      <Button type="link" block>
        Link
      </Button>
    </Space>
  );
}
