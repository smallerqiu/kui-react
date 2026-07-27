import { Button } from "../../button";
import { Menu, MenuItem } from "../../menu";
import { Dropdown } from "../index";
const overlay = (
  <Menu>
    <MenuItem>
      <a href="#">1st menu item</a>
    </MenuItem>
    <MenuItem>
      <a href="#">2nd menu item</a>
    </MenuItem>
    <MenuItem>
      <a href="#">3rd menu item</a>
    </MenuItem>
  </Menu>
);
export default function Basic() {
  return (
    <>
      <Dropdown arrow placement="bottom" overlay={overlay}>
        <Button type="text">Hover me</Button>
      </Dropdown>
      <Dropdown trigger="click" overlay={overlay}>
        <Button type="text">Click me</Button>
      </Dropdown>
    </>
  );
}
