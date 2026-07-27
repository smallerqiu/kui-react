import React from "react";
import type { SubMenuProps } from "./menu";
import { SubMenu as SubMenuComponent } from "./menu";

// Re-export SubMenu separately for backwards-compat named imports
const SubMenu: React.FC<SubMenuProps> = (props) => {
  return <SubMenuComponent {...props} />;
};

export default SubMenu;
