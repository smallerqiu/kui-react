import { createContext } from "react";

export const SiderHookContext = createContext<((mounted: boolean) => void) | null>(null);
