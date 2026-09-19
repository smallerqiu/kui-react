import { createContext } from "react";
export type AvatarShape = "circle" | "square" | "round";
export type AvatarSize = number | "large" | "small" | "default";

export interface AvatarGroupContextValue {
  shape?: AvatarShape;
  size?: AvatarSize;
}

export const AvatarGroupContext = createContext<AvatarGroupContextValue | null>(null);
