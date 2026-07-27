import { File, LogOut, Save, Scissors, SquarePen } from "kui-icons";
import { Menu, MenuDivider, MenuItem, type MenuSelectEvent, message, Dropdown } from "react-kui";
const overlay = (
  <Menu onSelect={({ key }: MenuSelectEvent) => message.info("Click on item " + key)}>
    <MenuItem key="news" icon={File}>
      New file
    </MenuItem>
    <MenuItem key="edit" icon={SquarePen}>
      Edit
    </MenuItem>
    <MenuItem key="save" icon={Save}>
      Save
    </MenuItem>
    <MenuItem key="cut" icon={Scissors}>
      Cut
    </MenuItem>
    <MenuDivider />
    <MenuItem key="exit" icon={LogOut}>
      Exit
    </MenuItem>
  </Menu>
);
export default function RightMenu() {
  return (
    <Dropdown trigger="contextmenu" overlay={overlay}>
      <div
        style={{ textAlign: "center", height: 200, lineHeight: "200px", color: "#999" }}
        className="demo-view-fill"
      >
        Right Click on here
      </div>
    </Dropdown>
  );
}
