import { Button, Menu, MenuItem, Dropdown } from "react-kui";
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
export default function App() {
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
