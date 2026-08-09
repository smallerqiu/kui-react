import React from "react";
import type { MenuOptionsProps } from "./menu";
import MenuItem from "./menu-item";
import SubMenu from "./sub-menu";

interface RecursiveMenuProps {
  item: MenuOptionsProps;
}

const RecursiveMenu: React.FC<RecursiveMenuProps> = ({ item }) =>
  item.children?.length ? (
    <SubMenu menuKey={item.key} title={item.title} icon={item.icon} disabled={item.disabled}>
      {item.children.map((child) => (
        <RecursiveMenu item={child} key={child.key} />
      ))}
    </SubMenu>
  ) : (
    <MenuItem menuKey={item.key} icon={item.icon} disabled={item.disabled}>
      {item.title}
    </MenuItem>
  );

export default RecursiveMenu;
