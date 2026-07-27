import { Search } from "kui-icons";
import { Button } from "../../button";
import Space from "../index";
export default function Basic() {
  return (
    <Space>
      <Button>Button</Button>
      <Button icon={Search}>Button</Button>
      <Button title="I am space">Space</Button>
    </Space>
  );
}
