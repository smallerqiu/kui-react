import { User, UserPlus } from "kui-icons";
import {
  Button,
  ButtonGroup,
  DropdownButton,
  Icon,
  Menu,
  MenuItem,
  Space,
  type MenuSelectEvent,
} from "react-kui";
export default function App() {
  const handleMenuClick = (e: MenuSelectEvent) => {
    console.log("click", e);
  };
  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log("click left button", e);
  };
  const overlay = (
    <Menu onSelect={handleMenuClick}>
      <MenuItem key="1">
        <Icon type={UserPlus} />
        1st menu item
      </MenuItem>
      <MenuItem key="2">
        <Icon type={UserPlus} />
        2nd menu item
      </MenuItem>
      <MenuItem key="3">
        <Icon type={UserPlus} />
        3rd item
      </MenuItem>
    </Menu>
  );
  return (
    <Space vertical>
      <ButtonGroup>
        <Button>Address</Button>
        <Button icon={User} />
      </ButtonGroup>
      <DropdownButton onClick={handleButtonClick} overlay={overlay} icon={UserPlus}>
        Dropdown
      </DropdownButton>
      <ButtonGroup>
        <Button>Left</Button>
        <Button>Center</Button>
        <Button>Right</Button>
      </ButtonGroup>
    </Space>
  );
}
