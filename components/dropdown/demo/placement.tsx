import { Button, type DropPlacementsType, Menu, MenuItem, Space, Dropdown } from "react-kui";
const placements: DropPlacementsType[] = [
  "bottom-left",
  "bottom",
  "bottom-right",
  "top-left",
  "top",
  "top-right",
];
const overlay = (
  <Menu>
    <MenuItem>
      <a target="_blank" rel="noreferrer" href="https://react.chuchur.com/">
        1st menu item
      </a>
    </MenuItem>
    <MenuItem>
      <a target="_blank" rel="noreferrer" href="https://react.k-ui.cn/">
        2nd menu item
      </a>
    </MenuItem>
    <MenuItem>
      <a target="_blank" rel="noreferrer" href="https://react.k-ui.cn/">
        3rd menu item
      </a>
    </MenuItem>
  </Menu>
);
export default function App() {
  return (
    <Space wrap>
      {placements.map((placement) => (
        <Dropdown key={placement} placement={placement} overlay={overlay}>
          <Button>{placement}</Button>
        </Dropdown>
      ))}
    </Space>
  );
}
