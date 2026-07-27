import Color, { type ColorInstance } from "color";
import { useEffect, useRef, type MouseEvent as ReactMouseEvent } from "react";
import { clamp } from "../utils/share";
export interface AlphaProps { value: string | ColorInstance; onUpdateAlpha?: (alpha: number) => void }
export default function Alpha({ value, onUpdateAlpha }: AlphaProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null); const color = Color(value);
  useEffect(() => { const canvas = canvasRef.current, context = canvas?.getContext("2d"); if (!canvas || !context) return; const rgb = color.rgb().object(); const gradient = context.createLinearGradient(0, 0, canvas.width, 0); gradient.addColorStop(0, `rgba(${rgb.r},${rgb.g},${rgb.b},0)`); gradient.addColorStop(1, `rgba(${rgb.r},${rgb.g},${rgb.b},1)`); context.clearRect(0,0,canvas.width,canvas.height); context.fillStyle = gradient; context.fillRect(0,0,canvas.width,canvas.height); }, [color.hex()]);
  const start = (event: ReactMouseEvent) => { const move = (x: number) => { const rect = canvasRef.current!.getBoundingClientRect(); onUpdateAlpha?.(Number((clamp(x - rect.left, 0, rect.width) / rect.width).toFixed(2))); }; move(event.clientX); const mousemove = (item: MouseEvent) => move(item.clientX); const up = () => { document.removeEventListener("mousemove", mousemove); document.removeEventListener("mouseup", up); }; document.addEventListener("mousemove", mousemove); document.addEventListener("mouseup", up); };
  return <div className="k-color-picker-alpha-box"><canvas className="k-color-picker-alpha" width={190} height={8} ref={canvasRef} onMouseDown={start} /><span className="k-color-picker-alpha-dot" style={{ left: color.alpha() * 190 - 7, backgroundColor: color.string() }} /></div>;
}
