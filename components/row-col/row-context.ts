import { createContext } from "react";

export const RowContext = createContext<number | [number, number] | undefined>(undefined);
