import React from "react";
import type { MenuOptionsProps } from "./menu";
import MenuItem from "./menu-item";
import SubMenu from "./sub-menu";

interface RecursiveMenuProps {
  item: MenuOptionsProps;
  isPopup?: boolean;
  keyPath?: string[];
}

const RecursiveMenu: React.FC<RecursiveMenuProps> = ({ item, isPopup = false, keyPath = [] }) => {
  if (item.children && item.children.length > 0) {
    return (
      <SubMenu
        menuKey={item.key}
        isPopup={isPopup}
        title={item.title}
        icon={item.icon}
        disabled={item.disabled}
        keyPath={keyPath}
      >
        {item.children.map((child) => (
          <RecursiveMenu item={child} key={child.key} keyPath={[...keyPath, item.key]} />
        ))}
      </SubMenu>
    );
  }

  return (
    <MenuItem
      menuKey={item.key}
      isPopup={isPopup}
      icon={item.icon}
      disabled={item.disabled}
      keyPath={keyPath}
    >
      {item.title}
    </MenuItem>
  );
};

export default RecursiveMenu;
