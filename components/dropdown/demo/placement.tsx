import { Button } from "../../button";
import type { DropPlacementsType } from "../../const/types";
import { Menu, MenuItem } from "../../menu";
import Space from "../../space";
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
    <MenuItem>
      <a target="_blank" rel="noreferrer" href="https://www.chuchur.com/">
        1st menu item
      </a>
    </MenuItem>
    <MenuItem>
      <a target="_blank" rel="noreferrer" href="https://www.k-ui.cn/">
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
export default function Placement() {
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
