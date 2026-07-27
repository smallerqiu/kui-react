import { Bell } from "kui-icons";
import Icon from "../../icon";
import Space from "../../space";
import Badge from "../index";
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
