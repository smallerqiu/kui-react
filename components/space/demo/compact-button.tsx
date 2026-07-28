import { Download, Gamepad2, Heart, Mail, Shirt } from "kui-icons";
import { Button, Space } from "react-kui";
const iconButtons = [Download, Gamepad2, Heart, Mail, Shirt];
export default function App() {
  return (
    <Space vertical size="medium">
      <Space compact>
        {iconButtons.map((icon, index) => (
          <Button icon={icon} key={index} />
        ))}
      </Space>
      <Space compact>
        {Array.from({ length: 4 }, (_, index) => (
          <Button type="primary" key={index}>
            Button{index + 1}
          </Button>
        ))}
      </Space>
      <Space compact>
        {Array.from({ length: 4 }, (_, index) => (
          <Button key={index}>Button{index + 1}</Button>
        ))}
      </Space>
    </Space>
  );
}
