import React, { useContext } from "react";
import { MenuContext } from "./context";

const MenuDivider: React.FC = () => {
  const { dropdown } = useContext(MenuContext);
  const preCls = dropdown ? "dropdown-menu" : "menu";
  return <li className={`k-${preCls}-item-divider`} />;
};

export default MenuDivider;
