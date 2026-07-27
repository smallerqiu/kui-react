import { ChevronDown } from "kui-icons";
import { Button } from "../../button";
import Icon from "../../icon";
import { Menu, MenuDivider, MenuItem } from "../../menu";
import { Dropdown } from "../index";
const overlay = (
  <Menu>
    <MenuItem>
      <a target="_blank" rel="noreferrer" href="https://www.chuchur.com/">
        1st menu item
      </a>
    </MenuItem>
    <MenuItem>
      <a target="_blank" rel="noreferrer" href="https://react.k-ui.cn/">
        2nd menu item
      </a>
    </MenuItem>
    <MenuDivider />
    <MenuItem disabled>3rd menu item (disabled)</MenuItem>
  </Menu>
);
export default function Divider() {
  return (
    <Dropdown overlay={overlay}>
      <Button>
        Divider <Icon type={ChevronDown} />
      </Button>
    </Dropdown>
  );
}
