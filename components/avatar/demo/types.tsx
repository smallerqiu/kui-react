import { Heart } from "kui-icons";
import { Icon, Space, Avatar } from "react-kui";

export default function App() {
  return (
    <Space wrap>
      <Avatar icon={Heart} />
      <Avatar>
        <Icon type={Heart} />
      </Avatar>
      <Avatar>U</Avatar>
      <Avatar>USER</Avatar>
      <Avatar src="https://cdn.chuchur.com/img/icons/apple-icon-57x57.png" />
      <Avatar style={{ color: "#f51212", backgroundColor: "#ffc57d" }}>U</Avatar>
      <Avatar style={{ backgroundColor: "#d06868" }} icon={Heart} />
      <br />
      <br />
      <Avatar src="https://cdn.chuchur.com/img/chick.jpeg" size={50} />
      <Avatar src="https://cdn.chuchur.com/img/monkey.jpeg" shape="square" />
    </Space>
  );
}
