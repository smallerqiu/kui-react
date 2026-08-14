import { Badge, Space } from "react-kui";
export default function App() {
  return (
    <Space size="large" vertical>
      <Badge count={3}>
        <div className="badge-box" />
      </Badge>
      <Badge count={15} color="orange">
        <div className="badge-box" />
      </Badge>
      <Badge status="success" text="Success" />
      <Badge status="success" text="Success active" active />
      <Badge pill status="success" text="success" />
      <Badge pill status="success" text="success active" active />
    </Space>
  );
}
