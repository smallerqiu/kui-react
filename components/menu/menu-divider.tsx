import React from "react";
import { useDropdownContext } from "../dropdown/dropdown-context.ts";

export const MenuDivider: React.FC = () => {
  const dropdownContext = useDropdownContext();
  const preCls = dropdownContext ? "dropdown-menu" : "menu";

  return <li className={`k-${preCls}-item-divider`} />;
};

export default MenuDivider;
