import React from "react";
import type { MenuOptionsProps } from "./menu";
import { MenuItem, RecursiveMenu, SubMenu } from "./menu";

interface RecursiveMenuProps {
  item: MenuOptionsProps;
  isPopup?: boolean;
  keyPath?: string[];
}

const RecursiveMenuItem: React.FC<RecursiveMenuProps> = ({
  item,
  isPopup = false,
  keyPath = [],
}) => {
  return <RecursiveMenu item={item} isPopup={isPopup} keyPath={keyPath} />;
};

export default RecursiveMenuItem;
