import { resolvePaintedTheme, useConfigAppearance } from "../config/use-config-appearance";
import clsx from "clsx";
import { Image as ImageIcon, Loading } from "kui-icons";
import {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";
import Icon from "../icon";
import { ImageGroupContext } from "./image-group-context";
import createInstance, { type ImagePreviewInstance } from "./instance";
import type { ImagePreviewProps, ImageType } from "./preview";
import type { ShapeType, SurfaceThemeType } from "../const/types";
import { loadImage } from "./utils";

export interface ImageRef {
  show: (props?: ImagePreviewProps) => void;
  destroy: () => void;
  togglePanel: () => void;
}
export interface ImageProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onSwitch" | "defaultValue" | "defaultChecked"
> {
  alt?: string;
  src?: string;
  type?: ImageType;
  origin?: string;
  height?: string | number;
  width?: string | number;
  placeholder?: string;
  data?: string[];
  imgStyle?: CSSProperties;
  showPanel?: boolean;
  tools?: ReactNode;
  panel?: ReactNode;
  onClose?: () => void;
  onSwitch?: (index: number) => void;
  theme?: SurfaceThemeType;
  shape?: ShapeType;
}

// An image is a framed plate, so it answers the five surface tiers and never `underlined`: keeping only
// the bottom edge of a frame around a picture is not an appearance preset (see `.kui-theme-value` in
// `styles/less-css-var.less`). Its own look is `plain` — no frame, no plate — so a tier it cannot paint
// lands there, on the same DOM as an `Image` with no `theme` written.
const PAINTED_THEMES = ["fill", "outline", "plain", "solid", "dashed"] as const;

const KImage = forwardRef<ImageRef, ImageProps>(function KImage(
  {
    alt,
    src,
    type,
    origin,
    height,
    width,
    placeholder,
    data,
    imgStyle,
    showPanel,
    tools,
    panel,
    onClose,
    onSwitch,
    theme: themeProp,
    shape: shapeProp,
    className,
    style,
    children,
    onClick,
    ...rest
  },
  ref,
) {
  const inheritedAppearance = useConfigAppearance();
  const theme =
    resolvePaintedTheme(themeProp ?? inheritedAppearance.theme, PAINTED_THEMES) ?? "plain";
  const shape = shapeProp ?? inheritedAppearance.shape ?? "round";
  const group = useContext(ImageGroupContext);
  const previewRef = useRef<ImagePreviewInstance | null>(null);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const previewSource = origin || src;

  useEffect(() => {
    let active = true;
    if (!src) {
      setLoading(false);
      setFailed(true);
      setImageUrl(placeholder);
      return;
    }
    setLoading(true);
    const cancelLoad = loadImage(
      src,
      () => {
        if (active) {
          setLoading(false);
          setFailed(false);
          setImageUrl(src);
        }
      },
      () => {
        if (active) {
          setLoading(false);
          setFailed(true);
          setImageUrl(placeholder);
        }
      },
    );
    return () => {
      active = false;
      cancelLoad();
    };
  }, [placeholder, src]);
  useEffect(() => {
    if (!previewSource) return;
    group?.register(previewSource);
    return () => group?.unregister(previewSource);
  }, [group, previewSource]);
  useEffect(() => () => previewRef.current?.destroy(), []);

  const show = (options: ImagePreviewProps = {}) => {
    if (!previewSource || failed || loading) return;
    const previewProps: ImagePreviewProps = {
      src: previewSource,
      type,
      data,
      showPanel,
      tools,
      panel,
      onClose,
      onSwitch,
      ...options,
    };
    if (group) group.show(previewProps);
    else {
      if (!previewRef.current) previewRef.current = createInstance(previewProps);
      previewRef.current.show(previewProps);
    }
  };
  useImperativeHandle(ref, () => ({
    show,
    destroy: () => {
      previewRef.current?.destroy();
      previewRef.current = null;
    },
    togglePanel: () => group?.togglePanel() ?? previewRef.current?.togglePanel(),
  }));
  const dimension = (value?: string | number) => (typeof value === "number" ? `${value}px` : value);
  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    onClick?.(event);
    if (!event.defaultPrevented) show();
  };
  return (
    <div
      {...rest}
      className={clsx("k-image", `k-image-${theme}`, `k-image-${shape}`, className)}
      style={{ ...style, width: dimension(width), height: dimension(height) }}
      onClick={handleClick}
    >
      {loading ? (
        <div className="k-image-loading">
          <Icon type={Loading} spin className="k-image-loading-icon" />
        </div>
      ) : failed && !imageUrl ? (
        <Icon type={ImageIcon} className="k-image-error" />
      ) : (
        <img className="k-image-img" alt={alt} src={imageUrl} style={imgStyle} />
      )}
      {children}
    </div>
  );
});
export default KImage;
