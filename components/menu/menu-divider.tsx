import React, { useContext } from "react";
import { MenuContext } from "./menu-context";

const MenuDivider: React.FC = () => {
  const menuContext = useContext(MenuContext);
  const preCls = menuContext?.dropdown ? "dropdown-menu" : "menu";
  return <li className={`k-${preCls}-item-divider`} />;
};

export default MenuDivider;
