/**
 * Adapted from Canvas UI by David Haz (DavidHDev).
 * Source: https://github.com/DavidHDev/canvas-ui
 * License: MIT + Commons Clause.
 */

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  createFlameWrap,
  supportsHtmlInCanvas,
  type FlameWrapInstance,
  type FlameWrapProps,
} from "./types";

const emptySubscribe = () => () => {};

export function FlameWrap({ children, className, style, ...options }: FlameWrapProps) {
  const sourceRef = useRef<HTMLCanvasElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const outputRef = useRef<HTMLCanvasElement>(null);
  const instanceRef = useRef<FlameWrapInstance | null>(null);
  const [initialOptions] = useState(options);
  const [failed, setFailed] = useState(false);
  const [nativeReady, setNativeReady] = useState(false);
  const [contentHeight, setContentHeight] = useState<number>();

  const supported = useSyncExternalStore(emptySubscribe, supportsHtmlInCanvas, () => false);
  const native = supported && !failed && nativeReady;

  const reach = Math.round(Math.max(options.height ?? 170, 24) * 1.5) + 40;
  const glow = Math.round(Math.max(options.spread ?? 8, 8) * 3) + 16;

  useLayoutEffect(() => {
    if (!supported || failed) return;
    const content = contentRef.current;
    if (!content) return;
    const measure = () => {
      const height = Math.ceil(Math.max(content.scrollHeight, content.getBoundingClientRect().height));
      if (height <= 0) return;
      setContentHeight((current) => (current === height ? current : height));
      setNativeReady(true);
    };
    const frame = requestAnimationFrame(measure);
    const observer = new ResizeObserver(measure);
    observer.observe(content);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [failed, native, supported]);

  useEffect(() => {
    if (supported && !nativeReady && !failed) return;
    const source = sourceRef.current;
    const content = contentRef.current;
    const output = outputRef.current;
    if (!source || !content || !output) return;
    instanceRef.current = createFlameWrap({ source, content, output }, initialOptions);
    if (native && !instanceRef.current) setFailed(true);
    return () => {
      instanceRef.current?.destroy();
      instanceRef.current = null;
    };
  }, [failed, initialOptions, native, nativeReady, supported]);

  useEffect(() => {
    instanceRef.current?.setOptions(options);
  });

  return (
    <div
      className={className}
      style={{ position: "relative", ...(native ? { height: contentHeight } : null), ...style }}
    >
      <canvas
        ref={sourceRef}
        // @ts-expect-error experimental html-in-canvas attribute
        layoutsubtree="true"
        suppressHydrationWarning
        style={
          native
            ? { position: "absolute", inset: 0, width: "100%", height: "100%" }
            : { display: "none" }
        }
      >
        {native ? (
          <div
            ref={contentRef}
            style={{
              position: "relative",
              width: "100%",
              overflow: "visible",
            }}
          >
            {children}
          </div>
        ) : null}
      </canvas>
      {!native ? (
        <div
          ref={contentRef}
          style={{
            position: "relative",
            width: "100%",
            overflow: "visible",
          }}
        >
          {children}
        </div>
      ) : null}
      <canvas
        ref={outputRef}
        aria-hidden
        style={{
          position: "absolute",
          top: -reach,
          right: -glow,
          bottom: -glow,
          left: -glow,
          width: `calc(100% + ${glow * 2}px)`,
          height: `calc(100% + ${reach + glow}px)`,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

export default FlameWrap;
