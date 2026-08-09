import { createContext } from "react";
import type { DirectionType } from "../const/types";

export interface MenuContextValue {
  selectedKeys: string[];
  openKeys: string[];
  mode: DirectionType;
  inlineCollapsed: boolean;
  popupInlineCollapsed: boolean;
  dropdown: boolean;
  keyPath: string[];
  openKeysChange: (key: string, opened: boolean, keyPath: string[]) => void;
  selectedKeysChange: (key: string, selected: boolean, keyPath: string[]) => void;
  registerSelectedPath: (key: string, keyPath: string[]) => void;
  clearPopTimer?: () => void;
  hidePopTimer?: () => void;
}

export const MenuContext = createContext<MenuContextValue>({
  selectedKeys: [],
  openKeys: [],
  mode: "vertical",
  inlineCollapsed: false,
  popupInlineCollapsed: false,
  dropdown: false,
  keyPath: [],
  openKeysChange: () => {},
  selectedKeysChange: () => {},
  registerSelectedPath: () => {},
});
