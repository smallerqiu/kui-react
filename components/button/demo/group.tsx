import { User } from "kui-icons";
import { Space, Button, ButtonGroup } from "react-kui";
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
