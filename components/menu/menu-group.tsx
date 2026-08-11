import React, { type ReactNode } from "react";

export interface MenuGroupProps {
  title?: ReactNode;
  children?: ReactNode;
}

export const MenuGroup: React.FC<MenuGroupProps> = ({ title, children }) => {
  return (
    <li className="k-menu-item-group">
      <div className="k-menu-item-group-title">{title}</div>
      <ul className="k-menu-item-group-list">{children}</ul>
    </li>
  );
};

export default MenuGroup;
