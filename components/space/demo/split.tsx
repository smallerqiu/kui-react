import { Divider, Space } from "react-kui";
export default function Split() {
  return (
    <Space split={<Divider type="vertical" />}>
      <a href="#">Edit</a>
      <a href="#">Save</a>
      <a href="#">Delete</a>
    </Space>
  );
}
