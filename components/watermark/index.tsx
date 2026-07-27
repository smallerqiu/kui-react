import { useEffect, useRef, type HTMLAttributes } from "react";

export interface Font {
  color?: string;
  fontSize?: number;
  fontWeight?: string | number;
  fontFamily?: string;
  fontStyle?: "normal" | "italic" | "oblique";
}
export interface WatermarkTextItem extends Font { text: string }
export type WatermarkLayoutType = "stagger" | "grid";
export interface WatermarkProps extends Omit<HTMLAttributes<HTMLDivElement>, "content"> {
  content?: string | string[] | WatermarkTextItem[];
  image?: string;
  width?: number;
  height?: number;
  rotate?: number;
  zIndex?: number;
  fullscreen?: boolean;
  antiTamper?: boolean;
  font?: Font;
  gap?: [number, number];
  offset?: [number, number];
  layout?: WatermarkLayoutType;
}

export default function Watermark({
  content = "",
  image = "",
  width = 240,
  height = 189,
  rotate = -22,
  zIndex = 999,
  fullscreen = false,
  antiTamper = true,
  font,
  gap = [40, 40],
  offset = [20, 20],
  layout = "stagger",
  className,
  style,
  children,
  ...rest
}: WatermarkProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLDivElement | null>(null);
  const restoringRef = useRef(false);

  useEffect(() => {
    if (typeof document === "undefined") return;
    let disposed = false;
    let parentObserver: MutationObserver | null = null;
    let selfObserver: MutationObserver | null = null;
    const target = fullscreen ? document.body : containerRef.current;
    if (!target) return;

    const drawText = (context: CanvasRenderingContext2D) => {
      const globalFont: Required<Font> = {
        color: "rgba(128, 128, 128, 0.15)", fontSize: 15, fontWeight: "normal",
        fontFamily: "sans-serif", fontStyle: "normal", ...font,
      };
      const raw = Array.isArray(content) ? content : [content];
      const lines: WatermarkTextItem[] = raw.map((item) => typeof item === "string" ? { text: item } : item);
      const heights = lines.map((item) => (item.fontSize ?? globalFont.fontSize) + 8);
      let y = -heights.reduce((sum, item) => sum + item, 0) / 2;
      context.textAlign = "center"; context.textBaseline = "middle";
      lines.forEach((item, index) => {
        const size = item.fontSize ?? globalFont.fontSize;
        context.font = `${item.fontStyle ?? globalFont.fontStyle} ${item.fontWeight ?? globalFont.fontWeight} ${size}px ${item.fontFamily ?? globalFont.fontFamily}`;
        context.fillStyle = item.color ?? globalFont.color;
        context.fillText(item.text, 0, y + heights[index] / 2);
        y += heights[index];
      });
    };

    const createPattern = () => new Promise<string>((resolve) => {
      const ratio = window.devicePixelRatio || 1;
      const cellWidth = width + gap[0];
      const cellHeight = height + gap[1];
      const staggered = layout === "stagger";
      const canvas = document.createElement("canvas");
      canvas.width = cellWidth * (staggered ? 2 : 1) * ratio;
      canvas.height = cellHeight * (staggered ? 2 : 1) * ratio;
      const context = canvas.getContext("2d");
      if (!context) return resolve("");
      context.scale(ratio, ratio);
      const drawCell = (x: number, y: number, source?: HTMLImageElement) => {
        context.save(); context.translate(x, y); context.rotate(rotate * Math.PI / 180);
        if (source) context.drawImage(source, -width / 2, -height / 2, width, height);
        else drawText(context);
        context.restore();
      };
      const render = (source?: HTMLImageElement) => {
        const x = offset[0], y = offset[1];
        drawCell(cellWidth / 2 + x, cellHeight / 2 + y, source);
        if (staggered) {
          drawCell(cellWidth * 1.5 + x, cellHeight / 2 + y, source);
          drawCell(x, cellHeight * 1.5 + y, source);
          drawCell(cellWidth + x, cellHeight * 1.5 + y, source);
          drawCell(cellWidth * 2 + x, cellHeight * 1.5 + y, source);
        }
        resolve(canvas.toDataURL());
      };
      if (!image) return render();
      const source = new Image(); source.crossOrigin = "anonymous";
      source.onload = () => render(source); source.onerror = () => render(); source.src = image;
    });

    const install = async () => {
      const pattern = await createPattern();
      if (disposed) return;
      parentObserver?.disconnect(); selfObserver?.disconnect();
      watermarkRef.current?.remove();
      const root = document.createElement("div");
      root.dataset.wmRoot = "true";
      Object.assign(root.style, {
        position: fullscreen ? "fixed" : "absolute", inset: "0", width: "100%", height: "100%",
        pointerEvents: "none", zIndex: String(zIndex), margin: "0", padding: "0",
      });
      const inner = document.createElement("div");
      const cellWidth = width + gap[0], cellHeight = height + gap[1], staggered = layout === "stagger";
      Object.assign(inner.style, {
        width: "100%", height: "100%", backgroundImage: `url(${pattern})`, backgroundRepeat: "repeat",
        backgroundSize: `${cellWidth * (staggered ? 2 : 1)}px ${cellHeight * (staggered ? 2 : 1)}px`, pointerEvents: "none",
      });
      root.attachShadow({ mode: "closed" }).appendChild(inner);
      target.appendChild(root); watermarkRef.current = root; restoringRef.current = false;
      if (!antiTamper) return;
      const restore = () => { if (!disposed && !restoringRef.current) { restoringRef.current = true; void install(); } };
      parentObserver = new MutationObserver((records) => {
        if (records.some((record) => [...record.removedNodes].includes(root))) restore();
      });
      parentObserver.observe(target, { childList: true });
      selfObserver = new MutationObserver(restore);
      selfObserver.observe(root, { attributes: true, attributeFilter: ["style", "class", "id", "hidden"] });
    };
    void install();
    return () => {
      disposed = true; parentObserver?.disconnect(); selfObserver?.disconnect(); watermarkRef.current?.remove(); watermarkRef.current = null;
    };
  }, [content, image, width, height, rotate, zIndex, fullscreen, antiTamper, font, gap, offset, layout]);

  if (fullscreen) return <>{children}</>;
  return <div {...rest} ref={containerRef} className={["k-watermark-container", className].filter(Boolean).join(" ")} style={{ position: "relative", width: "100%", height: "100%", ...style }}>{children}</div>;
}
