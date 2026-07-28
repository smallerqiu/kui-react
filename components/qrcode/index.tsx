import clsx from "clsx";
import Color from "color";
import { toCanvas, type QRCodeRenderersOptions } from "qrcode";
import {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { Button } from "../button";
import { ConfigContext } from "../config";
import zhCN from "../locale/zh-CN";
import Spin from "../spin";

export type QRCodeStatus = "active" | "loading" | "expired" | "scanned";
export type QRCodeErrorLevel = "L" | "M" | "Q" | "H";
export interface QRCodeRef {
  download: (fileName?: string) => void;
}
export interface QRCodeProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  value: string;
  size?: number;
  colorDark?: string;
  colorLight?: string;
  bordered?: boolean;
  status?: QRCodeStatus;
  logo?: string;
  logoSize?: number;
  margin?: number;
  logoRadius?: number;
  logoBorder?: boolean;
  errorLevel?: QRCodeErrorLevel;
  loadingContent?: ReactNode;
  expiredContent?: ReactNode;
  scannedContent?: ReactNode;
  onRefresh?: () => void;
}

const QRCode = forwardRef<QRCodeRef, QRCodeProps>(function QRCode(
  {
    value,
    size = 160,
    colorDark = "var(--kui-color-reverse)",
    colorLight = "var(--kui-color-bg)",
    bordered = true,
    status = "active",
    logo = "",
    logoSize,
    margin = 0,
    logoRadius = 4,
    logoBorder = true,
    errorLevel = "M",
    loadingContent,
    expiredContent,
    scannedContent,
    onRefresh,
    className,
    style,
    ...rest
  },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawIdRef = useRef(0);
  const { locale } = useContext(ConfigContext);
  const messages = (locale ?? zhCN)?.k?.qrcode;

  const resolveColor = (input: string) => {
    if (!input.trim().startsWith("var(")) return input;
    const element = document.createElement("span");
    element.style.color = input;
    document.body.appendChild(element);
    const computed = getComputedStyle(element).color;
    element.remove();
    try {
      return Color(computed).hex();
    } catch {
      return "#000000";
    }
  };

  const draw = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const drawId = ++drawIdRef.current;
    const ratio = window.devicePixelRatio || 1;
    const dark = resolveColor(colorDark);
    const light = resolveColor(colorLight);
    const memory = document.createElement("canvas");
    const options: QRCodeRenderersOptions = {
      width: size * ratio,
      margin,
      color: { dark, light },
      errorCorrectionLevel: errorLevel,
    };
    try {
      await toCanvas(memory, value || " ", options);
      if (drawId !== drawIdRef.current) return;
      canvas.width = size * ratio;
      canvas.height = size * ratio;
      const context = canvas.getContext("2d");
      if (!context) return;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(memory, 0, 0, canvas.width, canvas.height);
      if (!logo) return;
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.onload = () => {
        if (drawId !== drawIdRef.current) return;
        const finalSize = (logoSize ?? size * 0.22) * ratio;
        const x = (canvas.width - finalSize) / 2;
        const y = (canvas.height - finalSize) / 2;
        context.save();
        if (logoBorder) {
          const border = finalSize + 6 * ratio;
          context.fillStyle = light;
          context.beginPath();
          context.roundRect(
            (canvas.width - border) / 2,
            (canvas.height - border) / 2,
            border,
            border,
            (logoRadius + 2) * ratio
          );
          context.fill();
        }
        context.beginPath();
        context.roundRect(x, y, finalSize, finalSize, logoRadius * ratio);
        context.clip();
        context.drawImage(image, x, y, finalSize, finalSize);
        context.restore();
      };
      image.src = logo;
    } catch (error) {
      console.error("Failed to render QR code", error);
    }
  }, [
    colorDark,
    colorLight,
    errorLevel,
    logo,
    logoBorder,
    logoRadius,
    logoSize,
    margin,
    size,
    value,
  ]);

  useEffect(() => {
    void draw();
  }, [draw]);
  useEffect(() => {
    const observer = new MutationObserver((records) => {
      if (records.some((record) => record.attributeName === "theme-mode")) void draw();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["theme-mode"],
    });
    return () => observer.disconnect();
  }, [draw]);
  useImperativeHandle(ref, () => ({
    download(fileName = "qrcode.png") {
      const anchor = document.createElement("a");
      anchor.download = fileName;
      anchor.href = canvasRef.current?.toDataURL("image/png") ?? "";
      anchor.click();
    },
  }));

  return (
    <div
      {...rest}
      className={clsx("k-qrcode", { "k-qrcode-borderless": !bordered }, className)}
      style={{ ...style, width: size, height: size }}
    >
      <canvas ref={canvasRef} style={{ width: size, height: size, display: "block" }} />
      {status !== "active" && (
        <div className="k-qrcode-mask">
          {status === "loading" && (
            <div className="k-qrcode-loading-wrapper">
              {loadingContent ?? (
                <>
                  <Spin size="small" /> <span>{messages?.loading}</span>
                </>
              )}
            </div>
          )}
          {status === "expired" && (
            <div className="k-qrcode-expired-wrapper" onClick={onRefresh}>
              {expiredContent ?? (
                <>
                  <div className="k-qrcode-expired">{messages?.expired}</div>
                  <Button size="small" type="text">
                    {messages?.refresh}
                  </Button>
                </>
              )}
            </div>
          )}
          {status === "scanned" && (
            <div className="k-qrcode-scanned-wrapper">{scannedContent ?? messages?.scanned}</div>
          )}
        </div>
      )}
    </div>
  );
});
export default QRCode;
