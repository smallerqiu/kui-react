import { Space, Badge } from "react-kui";
export default function Mark() {
  return (
    <Space>
      <Badge count={3} />
      <Badge count={15} color="orange" />
      <Badge count={25} color="green" />
    </Space>
  );
}
