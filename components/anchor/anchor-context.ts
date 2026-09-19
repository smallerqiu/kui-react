import { createContext } from "react";

export interface AnchorContextValue {
  activeLink: string;
  registerLink: (link: string) => void;
  unregisterLink: (link: string) => void;
  scrollTo: (link: string) => void;
}

export const AnchorContext = createContext<AnchorContextValue | null>(null);
