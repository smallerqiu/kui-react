import React from "react";
import { MenuItem as MenuItemComponent } from "./menu";
import type { MenuItemProps } from "./menu";

const MenuItem: React.FC<MenuItemProps> = (props) => {
  return <MenuItemComponent {...props} />;
};

export default MenuItem;
