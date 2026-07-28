import { Apple, Heart, House, Loading, LogoApple, LogoKui } from "kui-icons";
import { Space, Icon } from "react-kui";
export default function App() {
  return (
    <Space vertical>
      <code>Logo and Spin</code>
      <Space size={15}>
        <Icon strokeWidth={1} size={25} type={LogoApple} />
        <Icon strokeWidth={1} size={25} type={LogoKui} />
        <Icon strokeWidth={1} size={25} type={LogoKui} color="#00be83" />
        <Icon strokeWidth={1} size={25} type={Loading} spin />
      </Space>
      <code>Stroke Width</code>
      <Space size={15}>
        {[House, Heart, Apple].flatMap((type, i) => [
          <Icon key={`${i}-1`} strokeWidth={1} size={25} type={type} />,
          <Icon key={`${i}-2`} strokeWidth={2} size={25} type={type} />,
        ])}
      </Space>
      <code>Fill and Color</code>
      <Space size={15}>
        <Icon size={25} type={House} reverseFill />
        <Icon size={25} type={Heart} reverseFill color="red" />
        <Icon size={25} type={Apple} reverseFill color="orange" />
      </Space>
    </Space>
  );
}
