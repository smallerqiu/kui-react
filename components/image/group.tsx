import { createContext, useEffect, useMemo, useRef, type HTMLAttributes } from "react";
import createInstance, { type ImagePreviewInstance } from "./instance";
import type { ImagePreviewProps } from "./preview";

export interface ImageGroupContextValue {
  show: (props: ImagePreviewProps) => void;
  register: (src: string) => void;
  unregister: (src: string) => void;
  togglePanel: () => void;
}
export const ImageGroupContext = createContext<ImageGroupContextValue | null>(null);
export interface ImageGroupProps extends HTMLAttributes<HTMLDivElement> {
  data?: string[];
}

export default function ImageGroup({ data = [], className, children, ...rest }: ImageGroupProps) {
  const sourcesRef = useRef([...data]);
  const previewRef = useRef<ImagePreviewInstance | null>(null);
  useEffect(() => () => previewRef.current?.destroy(), []);
  const context = useMemo<ImageGroupContextValue>(
    () => ({
      show(options) {
        if (!previewRef.current)
          previewRef.current = createInstance({ ...options, data: sourcesRef.current });
        previewRef.current.show({ ...options, data: sourcesRef.current });
      },
      register(src) {
        if (src && !sourcesRef.current.includes(src)) sourcesRef.current.push(src);
      },
      unregister(src) {
        sourcesRef.current = sourcesRef.current.filter((item) => item !== src);
      },
      togglePanel() {
        previewRef.current?.togglePanel();
      },
    }),
    []
  );
  return (
    <ImageGroupContext.Provider value={context}>
      <div {...rest} className={["k-image-group", className].filter(Boolean).join(" ")}>
        {children}
      </div>
    </ImageGroupContext.Provider>
  );
}
