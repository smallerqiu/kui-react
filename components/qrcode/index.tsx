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
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { Button } from "../button";
import { ConfigContext } from "../config/config-context";
import type { QRCodeErrorLevel, QRCodeStatus, ShapeType, ThemeType } from "../const/types";
import zhCN from "../locale/zh-CN";
import Spin from "../spin";

export interface QRCodeRef {
  download: (fileName?: string) => Promise<void>;
}

export interface QRCodeProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  value: string;
  size?: number;
  colorDark?: string;
  colorLight?: string;
  bordered?: boolean;
  shape?: ShapeType;
  theme?: ThemeType;
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

const positive = (value: number, fallback: number) =>
  Number.isFinite(value) && value > 0 ? value : fallback;

const resolveColor = (input: string, parent: HTMLElement | null): string => {
  if (!input.trim().startsWith("var(")) return input;
  const element = document.createElement("span");
  element.style.color = input;
  (parent ?? document.body).appendChild(element);
  const computed = getComputedStyle(element).color;
  element.remove();
  try {
    return Color(computed).hex();
  } catch {
    return "#000000";
  }
};

const loadImage = (src: string): Promise<HTMLImageElement | null> =>
  new Promise((resolve) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = src;
  });

const QRCode = forwardRef<QRCodeRef, QRCodeProps>(function QRCode(
  {
    value,
    size = 160,
    colorDark = "var(--kui-color-reverse)",
    colorLight = "var(--kui-color-bg)",
    bordered = true,
    shape = "round",
    theme = "outline",
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
  ref,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawIdRef = useRef(0);
  const mountedRef = useRef(false);
  const drawPromiseRef = useRef<Promise<void>>(Promise.resolve());
  const safeSize = positive(size, 160);
  const safeMargin = Number.isFinite(margin) ? Math.max(0, Math.floor(margin)) : 0;
  const { locale } = useContext(ConfigContext);
  const messages = (locale ?? zhCN)?.k?.qrcode;

  const draw = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const drawId = ++drawIdRef.current;
    const ratio = positive(window.devicePixelRatio, 1);
    const pixelSize = Math.max(1, Math.round(safeSize * ratio));
    const dark = resolveColor(colorDark, canvas.parentElement);
    const light = resolveColor(colorLight, canvas.parentElement);
    const memory = document.createElement("canvas");
    const options: QRCodeRenderersOptions = {
      width: pixelSize,
      margin: safeMargin,
      color: { dark, light },
      errorCorrectionLevel: errorLevel,
    };

    try {
      await toCanvas(memory, value || " ", options);
      if (logo) {
        const image = await loadImage(logo);
        if (drawId !== drawIdRef.current) return;
        const context = memory.getContext("2d");
        if (image && context) {
          const requestedLogoSize = positive(logoSize ?? safeSize * 0.22, safeSize * 0.22);
          const finalSize = Math.min(safeSize, requestedLogoSize) * ratio;
          const radius = Math.min(Math.max(0, logoRadius), requestedLogoSize / 2) * ratio;
          const x = (pixelSize - finalSize) / 2;
          const y = (pixelSize - finalSize) / 2;
          context.save();
          if (logoBorder) {
            const borderSize = Math.min(pixelSize, finalSize + 6 * ratio);
            context.fillStyle = light;
            context.beginPath();
            context.roundRect(
              (pixelSize - borderSize) / 2,
              (pixelSize - borderSize) / 2,
              borderSize,
              borderSize,
              Math.min(borderSize / 2, radius + 2 * ratio),
            );
            context.fill();
          }
          context.beginPath();
          context.roundRect(x, y, finalSize, finalSize, radius);
          context.clip();
          context.drawImage(image, x, y, finalSize, finalSize);
          context.restore();
        }
      }
      if (drawId !== drawIdRef.current) return;
      canvas.width = pixelSize;
      canvas.height = pixelSize;
      canvas.getContext("2d")?.drawImage(memory, 0, 0, pixelSize, pixelSize);
    } catch (error) {
      if (drawId === drawIdRef.current) console.error("Failed to render QR code", error);
    }
  }, [
    colorDark,
    colorLight,
    errorLevel,
    logo,
    logoBorder,
    logoRadius,
    logoSize,
    safeMargin,
    safeSize,
    value,
  ]);

  const scheduleDraw = useCallback(() => {
    const promise = draw();
    drawPromiseRef.current = promise;
    void promise;
  }, [draw]);

  useEffect(() => {
    if (!mountedRef.current || status === "active") scheduleDraw();
    mountedRef.current = true;
  }, [scheduleDraw, status]);

  useEffect(() => {
    const observer = new MutationObserver((records) => {
      if (status === "active" && records.some((record) => record.attributeName === "theme-mode")) {
        scheduleDraw();
      }
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["theme-mode"],
    });
    return () => observer.disconnect();
  }, [scheduleDraw, status]);

  useEffect(
    () => () => {
      drawIdRef.current += 1;
    },
    [],
  );

  useImperativeHandle(ref, () => ({
    async download(fileName = "qrcode.png") {
      await drawPromiseRef.current;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const anchor = document.createElement("a");
      anchor.download = fileName;
      anchor.href = canvas.toDataURL("image/png");
      anchor.click();
    },
  }));

  const handleExpiredKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || (event.key !== "Enter" && event.key !== " "))
      return;
    event.preventDefault();
    onRefresh?.();
  };

  return (
    <div
      {...rest}
      className={clsx(
        "k-qrcode",
        `k-qrcode-${shape}`,
        `k-qrcode-${theme}`,
        { "k-qrcode-plain": !bordered },
        className,
      )}
      style={{ ...style, width: safeSize, height: safeSize }}
    >
      <canvas ref={canvasRef} style={{ width: safeSize, height: safeSize, display: "block" }} />
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
            <div
              className="k-qrcode-expired-wrapper"
              role="button"
              tabIndex={0}
              onClick={onRefresh}
              onKeyDown={handleExpiredKeyDown}
            >
              {expiredContent ?? (
                <>
                  <div className="k-qrcode-expired">{messages?.expired}</div>
                  <Button size="small" type="text" tabIndex={-1}>
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

export type { QRCodeErrorLevel, QRCodeStatus } from "../const/types";
export default QRCode;
