import { Heart, Mail, Settings } from "kui-icons";
import { useState } from "react";
import { Menu, MenuDivider, MenuGroup, MenuItem, SubMenu } from "react-kui";

export default function App() {
  const [current, setCurrent] = useState(["1-1"]),
    [openKeys, setOpenKeys] = useState(["sub1"]);
  return (
    <div style={{ width: 256 }}>
      <Menu
        mode="inline"
        value={current}
        onChange={setCurrent}
        openKeys={openKeys}
        onOpenChange={setOpenKeys}
      >
        <MenuGroup title="Application">
          <MenuItem itemKey="1-1" icon={Mail}>
            Navigation One
          </MenuItem>
          <MenuItem itemKey="1-2" icon={Heart}>
            Navigation Two
          </MenuItem>
          <MenuItem itemKey="1-3" icon={Settings} disabled>
            Navigation Three
          </MenuItem>
        </MenuGroup>
        <MenuDivider />
        <SubMenu itemKey="sub1" title="Navigation Four" icon={Mail}>
          <MenuGroup title="Options">
            <MenuItem itemKey="4-1">Option 1</MenuItem>
            <MenuItem itemKey="4-2">Option 2</MenuItem>
          </MenuGroup>
          <MenuDivider />
          <MenuItem itemKey="4-3">Option 3</MenuItem>
        </SubMenu>
      </Menu>
    </div>
  );
}
