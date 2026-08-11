import type { RefObject } from "react";
import { createContext, useContext } from "react";
import type { DirectionType } from "../const/types";

export interface MenuContextProps {
  openKeys: string[];
  selectedKeys: string[];
  mode: DirectionType;
  inlineCollapsed: RefObject<boolean>;
  popupInlineCollapsed: RefObject<boolean>;
  dropdown: boolean;
  openKeysChange?: (key: string, opened: boolean, keyPath: string[]) => void;
  selectedKeysChange?: (key: string, selected: boolean, keyPath: string[]) => void;
}

export interface SubMenuContextProps {
  keyPath: string[];
  clearPopTimer?: () => void;
  hidePopTimer?: () => void;
}

export const MenuContext = createContext<MenuContextProps | null>(null);
export const SubMenuContext = createContext<SubMenuContextProps | null>(null);

export const useMenuContext = () => useContext(MenuContext);
export const useSubMenuContext = () => useContext(SubMenuContext);
