import { Button, type DropPlacementsType, Menu, MenuItem, Dropdown } from "react-kui";
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
    <MenuItem>1st menu item</MenuItem>
    <MenuItem>2nd menu item</MenuItem>
    <MenuItem>3rd menu item</MenuItem>
  </Menu>
);
export default function App() {
  return (
    <div id="dropdown-demo-placement">
      {placements.map((placement) => (
        <Dropdown key={placement} placement={placement} arrow overlay={overlay}>
          <Button>{placement}</Button>
        </Dropdown>
      ))}
    </div>
  );
}
