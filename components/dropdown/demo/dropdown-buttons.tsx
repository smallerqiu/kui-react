import { UserPlus } from "kui-icons";
import {
  Button,
  Icon,
  Menu,
  MenuItem,
  type MenuSelectEvent,
  Space,
  Dropdown,
  DropdownButton,
} from "react-kui";
const handleMenuClick = (e: MenuSelectEvent) => console.log("click", e);
const overlay = (
  <Menu onSelect={handleMenuClick}>
    {[1, 2, 3].map((i) => (
      <MenuItem key={i}>
        <Icon type={UserPlus} /> {i === 3 ? "3rd item" : `${i}${i === 1 ? "st" : "nd"} menu item`}
      </MenuItem>
    ))}
  </Menu>
);
export default function DropdownButtons() {
  return (
    <Space vertical>
      <DropdownButton overlay={overlay} onClick={(e) => console.log("click left button", e)}>
        Dropdown
      </DropdownButton>
      <DropdownButton overlay={overlay} icon={UserPlus}>
        Dropdown
      </DropdownButton>
      <DropdownButton overlay={overlay} disabled>
        Dropdown
      </DropdownButton>
      <Dropdown overlay={overlay}>
        <Button>
          Button <Icon type={UserPlus} />
        </Button>
      </Dropdown>
    </Space>
  );
}
