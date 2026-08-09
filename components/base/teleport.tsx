import type React from "react";
import { createPortal } from "react-dom";

export interface TeleportProps {
  to: string | Element;
  disabled?: boolean;
  children?: React.ReactNode;
}

const Teleport: React.FC<TeleportProps> = ({ to, disabled = false, children }) => {
  if (disabled || typeof document === "undefined") return children;
  const target = typeof to === "string" ? document.querySelector(to) : to;
  return target ? createPortal(children, target) : null;
};

export default Teleport;
