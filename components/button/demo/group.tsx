import { User } from "kui-icons";
import Space from "../../space";
import { Button, ButtonGroup } from "../index";
export default function Group() {
  return (
    <Space>
      <ButtonGroup>
        <Button>Address</Button>
        <Button icon={User} />
      </ButtonGroup>
      <ButtonGroup>
        <Button>Left</Button>
        <Button>Center</Button>
        <Button>Right</Button>
      </ButtonGroup>
    </Space>
  );
}
