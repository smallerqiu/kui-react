import { Search } from "kui-icons";
import { Button, Space } from "react-kui";
export default function Basic() {
  return (
    <Space>
      <Button>Button</Button>
      <Button icon={Search}>Button</Button>
      <Button title="I am space">Space</Button>
    </Space>
  );
}
