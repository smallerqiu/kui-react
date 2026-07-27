import { Button } from "../../button";
import type { DropPlacementsType } from "../../const/types";
import { Menu, MenuItem } from "../../menu";
import { Dropdown } from "../index";
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
export default function Arrow() {
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
