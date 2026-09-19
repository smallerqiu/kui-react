import { createContext } from "react";
import type { ImagePreviewProps } from "./preview";

export interface ImageGroupContextValue {
  show: (props: ImagePreviewProps) => void;
  register: (src: string) => void;
  unregister: (src: string) => void;
  togglePanel: () => void;
}

export const ImageGroupContext = createContext<ImageGroupContextValue | null>(null);
