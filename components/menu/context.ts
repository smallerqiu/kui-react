import { createContext } from "react";
import type { DirectionType } from "../const/types";

export interface MenuContextValue {
  selectedKeys: string[];
  openKeys: string[];
  mode: DirectionType;
  inlineCollapsed: boolean;
  isDropdown: boolean;
  accordion: boolean;
  keyPath: string[];
  onSelectedChange: (key: string, selected: boolean, keyPath: string[]) => void;
  onOpenChange: (key: string, opened: boolean, keyPath: string[]) => void;
  clearPopupTimer?: () => void;
  schedulePopupClose?: () => void;
}

export const MenuContext = createContext<MenuContextValue>({
  selectedKeys: [],
  openKeys: [],
  mode: "vertical",
  inlineCollapsed: false,
  isDropdown: false,
  accordion: false,
  keyPath: [],
  onSelectedChange: () => {},
  onOpenChange: () => {},
});
