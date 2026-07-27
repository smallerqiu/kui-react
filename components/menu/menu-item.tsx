import React from "react";
import type { MenuItemProps } from "./menu";
import { MenuItem as MenuItemComponent } from "./menu";

const MenuItem: React.FC<MenuItemProps> = (props) => {
  return <MenuItemComponent {...props} />;
};

export default MenuItem;
