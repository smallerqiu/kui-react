import { createContext } from "react";
import type { DirectionType } from "../const/types";

export interface MenuContext {
  openKeys: string[];
  selectedKeys: string[];
  mode: DirectionType;
  inlineCollapsed: boolean;
  popupInlineCollapsed: boolean;
  dropdown: boolean;
  openKeysChange: (key: string, opened: boolean, keyPath: string[]) => void;
  selectedKeysChange: (key: string, selected: boolean, keyPath: string[]) => void;
}

export interface SubMenuContext {
  keyPath: string[];
  clearPopTimer?: () => void;
  hidePopTimer?: () => void;
}

export const MenuContext = createContext<MenuContext | null>(null);
export const SubMenuContext = createContext<SubMenuContext | null>(null);
