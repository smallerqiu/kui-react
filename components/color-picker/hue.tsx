import { useEffect, useRef, type MouseEvent as ReactMouseEvent } from "react";
import { clamp } from "../utils/share";
export interface HueProps { hue?: number; onUpdateHue?: (hue: number) => void }
export default function Hue({ hue = 0, onUpdateHue }: HueProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current, context = canvas?.getContext("2d"); if (!canvas || !context) return;
    const gradient = context.createLinearGradient(0, 0, canvas.width, 0);
    for (let value = 0; value <= 360; value += 10) gradient.addColorStop(value / 360, `hsl(${value},100%,50%)`);
    context.fillStyle = gradient; context.fillRect(0, 0, canvas.width, canvas.height);
  }, []);
  const start = (event: ReactMouseEvent) => {
    const move = (clientX: number) => { const rect = canvasRef.current!.getBoundingClientRect(); onUpdateHue?.(Math.round(clamp(clientX - rect.left, 0, rect.width) / rect.width * 360)); };
    move(event.clientX);
    const mousemove = (item: MouseEvent) => move(item.clientX);
    const up = () => { document.removeEventListener("mousemove", mousemove); document.removeEventListener("mouseup", up); };
    document.addEventListener("mousemove", mousemove); document.addEventListener("mouseup", up);
  };
  return <div className="k-color-picker-slider-hue"><canvas className="k-color-picker-hue" width={190} height={8} ref={canvasRef} onMouseDown={start} /><span className="k-color-picker-hue-dot" style={{ left: hue / 360 * 190 - 7 }} /></div>;
}
