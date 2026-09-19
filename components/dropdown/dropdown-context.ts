import { createContext, useContext } from "react";
export interface DropdownContextProps {
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  clearPopTimer?: () => void;
  menuSelected?: (data: { key: string; keyPath: string[] }) => void;
}
export const DropdownContext = createContext<DropdownContextProps | null>(null);
export const useDropdownContext = () => useContext(DropdownContext);
