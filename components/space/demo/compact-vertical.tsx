import { Download, Gamepad2, Heart, Mail, Shirt } from "kui-icons";
import { Button } from "../../button";
import Space from "../index";
export default function CompactVertical() {
  const icons = [Download, Gamepad2, Heart, Mail, Shirt];
  return (
    <Space size="medium">
      <Space compact vertical>
        {icons.map((icon, index) => (
          <Button icon={icon} key={index} />
        ))}
      </Space>
      <Space compact vertical>
        {Array.from({ length: 4 }, (_, index) => (
          <Button theme="dashed" key={index}>
            Button{index + 1}
          </Button>
        ))}
      </Space>
      <Space compact vertical>
        {Array.from({ length: 4 }, (_, index) => (
          <Button key={index}>Button{index + 1}</Button>
        ))}
      </Space>
    </Space>
  );
}
