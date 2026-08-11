import { createContext } from "react";
import type { ShapeType } from "../const/types";

export interface AvatarGroupContextValue {
  shape?: ShapeType;
  size?: number | "large" | "small" | "default";
}

export const AvatarGroupContext = createContext<AvatarGroupContextValue | null>(null);
