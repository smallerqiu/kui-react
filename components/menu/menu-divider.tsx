import React, { useContext } from "react";
import { MenuContext } from "./menu";

const MenuDivider: React.FC = () => {
  const ctx = useContext(MenuContext);
  const preCls = ctx?.isDropdown ? "dropdown-menu" : "menu";
  return <li className={`k-${preCls}-item-divider`} />;
};

export default MenuDivider;
