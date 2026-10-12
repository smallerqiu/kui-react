import { createContext, useContext, type KeyboardEvent } from "react";
export interface DropdownContextProps {
  /** target 模式下的触发按钮（DropdownButton 右块）需要自己反映展开状态 */
  expanded?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
  onContextMenu?: () => void;
  onTriggerKeydown?: (event: KeyboardEvent<HTMLElement>) => void;
  clearPopTimer?: () => void;
  menuSelected?: (data: { key: string; keyPath: string[] }) => void;
}
export const DropdownContext = createContext<DropdownContextProps | null>(null);
export const useDropdownContext = () => useContext(DropdownContext);
