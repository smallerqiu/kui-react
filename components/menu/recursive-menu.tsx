import React from "react";
import type { MenuOptionsProps } from "./menu";
import MenuItem from "./menu-item";
import SubMenu from "./sub-menu";

export interface RecursiveMenuProps {
  item: MenuOptionsProps;
}

export const RecursiveMenu: React.FC<RecursiveMenuProps> = ({ item }) => {
  if (item.children && item.children.length > 0) {
    return (
      <SubMenu
        key={item.key}
        itemKey={item.key}
        title={item.title}
        icon={item.icon}
        disabled={item.disabled}
      >
        {item.children.map((child) => (
          <RecursiveMenu item={child} key={child.key} />
        ))}
      </SubMenu>
    );
  }

  return (
    <MenuItem key={item.key} itemKey={item.key} icon={item.icon} disabled={item.disabled}>
      {item.title}
    </MenuItem>
  );
};

export default RecursiveMenu;
