import Color, { type ColorInstance, type ColorObject } from "color";
import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import { clamp } from "../utils/share";
export interface PaintProps {
  hue?: number;
  value: string | ColorInstance;
  onUpdateRGB?: (color: ColorObject) => void;
}
export default function Paint({ hue = 0, value, onUpdateRGB }: PaintProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragCleanupRef = useRef<() => void>(() => undefined);
  const draggingRef = useRef(false);
  const hsv = Color(value).hsv().object();
  const [dotPosition, setDotPosition] = useState(() => ({
    x: (hsv.s / 100) * 234 - 7,
    y: (1 - hsv.v / 100) * 136 - 7,
  }));
  useEffect(() => {
    const canvas = canvasRef.current,
      context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    context.fillStyle = `hsl(${hue},100%,50%)`;
    context.fillRect(0, 0, canvas.width, canvas.height);
    const white = context.createLinearGradient(0, 0, canvas.width, 0);
    white.addColorStop(0, "#fff");
    white.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = white;
    context.fillRect(0, 0, canvas.width, canvas.height);
    const black = context.createLinearGradient(0, 0, 0, canvas.height);
    black.addColorStop(0, "rgba(0,0,0,0)");
    black.addColorStop(1, "#000");
    context.fillStyle = black;
    context.fillRect(0, 0, canvas.width, canvas.height);
  }, [hue]);
  useEffect(() => {
    if (draggingRef.current) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    setDotPosition({
      x: (hsv.s / 100) * rect.width - 7,
      y: (1 - hsv.v / 100) * rect.height - 7,
    });
  }, [value]);
  useEffect(() => () => dragCleanupRef.current(), []);
  const start = (event: ReactMouseEvent) => {
    draggingRef.current = true;
    const move = (x: number, y: number) => {
      const rect = canvasRef.current!.getBoundingClientRect();
      const localX = clamp(x - rect.left, 0, rect.width);
      const localY = clamp(y - rect.top, 0, rect.height);
      const saturation = (localX / rect.width) * 100;
      const brightness = (1 - localY / rect.height) * 100;
      setDotPosition({ x: localX - 7, y: localY - 7 });
      onUpdateRGB?.(Color().hsv(hue, saturation, brightness).rgb().object());
    };
    move(event.clientX, event.clientY);
    const mousemove = (item: MouseEvent) => move(item.clientX, item.clientY);
    dragCleanupRef.current();
    const up = () => {
      draggingRef.current = false;
      document.removeEventListener("mousemove", mousemove);
      document.removeEventListener("mouseup", up);
    };
    dragCleanupRef.current = up;
    document.addEventListener("mousemove", mousemove);
    document.addEventListener("mouseup", up);
  };
  return (
    <div className="k-color-picker-paint-container">
      <canvas
        className="k-color-picker-paint"
        width={234}
        height={136}
        ref={canvasRef}
        onMouseDown={start}
      />
      <span
        className="k-color-picker-paint-dot"
        style={{ left: dotPosition.x, top: dotPosition.y }}
      />
    </div>
  );
}
