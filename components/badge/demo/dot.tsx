import { Bell } from "kui-icons";
import { Icon, Space, Badge } from "react-kui";
export default function Dot() {
  return (
    <Space vertical>
      <Badge dot>
        <div className="badge-box" />
      </Badge>
      <Badge dot>
        <Icon type={Bell} />
      </Badge>
      <Badge dot>
        <a href="#">Link</a>
      </Badge>
    </Space>
  );
}
