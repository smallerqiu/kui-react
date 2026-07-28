import { Space, Badge } from "react-kui";
export default function App() {
  return (
    <Space size="large">
      <Badge count={3}>
        <div className="badge-box" />
      </Badge>
      <Badge count={15} color="orange">
        <div className="badge-box" />
      </Badge>
    </Space>
  );
}
