import clsx from "clsx";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Loading,
  Minus,
  Plus,
  RotateCcwSquare,
  RotateCwSquare,
  X,
} from "kui-icons";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import { Button } from "../button";
import Icon from "../icon";
import Slider from "../slider";
import { loadImage } from "./utils";

export interface ImagePreviewProps {
  type?: string;
  src?: string;
  showPanel?: boolean;
  onClose?: () => void;
  onSwitch?: (index: number) => void;
  data?: string[];
  panel?: ReactNode;
  tools?: ReactNode;
}
export interface ImagePreviewApi {
  show: (props: ImagePreviewProps) => void;
  close: () => void;
  togglePanel: () => void;
}

const ImagePreview = forwardRef<ImagePreviewApi, ImagePreviewProps>(
  function ImagePreview(initial, ref) {
    const [options, setOptions] = useState(initial);
    const [visible, setVisible] = useState(true);
    const [scale, setScale] = useState(1);
    const [rotate, setRotate] = useState(0);
    const [position, setPosition] = useState({ left: 0, top: 0 });
    const [dragging, setDragging] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [panelVisible, setPanelVisible] = useState(!!initial.showPanel);
    const dragRef = useRef({ x: 0, y: 0 });
    const data = options.data ?? [];
    const src = options.src ?? "";
    const index = data.indexOf(src);

    const close = () => {
      setVisible(false);
      options.onClose?.();
    };
    const togglePanel = () => setPanelVisible((value) => !value);
    useImperativeHandle(ref, () => ({
      show(props) {
        setOptions((current) => ({ ...current, ...props }));
        setPanelVisible(!!props.showPanel);
        setVisible(true);
      },
      close,
      togglePanel,
    }));
    useEffect(() => {
      if (!src || options.type === "media") return;
      setLoading(true);
      setError(false);
      loadImage(
        src,
        () => {
          setLoading(false);
          setError(false);
        },
        () => {
          setLoading(false);
          setError(true);
        }
      );
    }, [options.type, src]);
    useEffect(() => {
      const keydown = (event: KeyboardEvent) => {
        if (event.key === "Escape") close();
      };
      const wheel = (event: WheelEvent) => {
        if (!visible) return;
        event.preventDefault();
        setScale((value) => Math.max(1, Math.min(10, value + (event.deltaY < 0 ? 1 : -1))));
      };
      document.addEventListener("keydown", keydown);
      document.addEventListener("wheel", wheel, { passive: false });
      return () => {
        document.removeEventListener("keydown", keydown);
        document.removeEventListener("wheel", wheel);
      };
    }, [visible, options.onClose]);
    const switchImage = (offset: number) => {
      const next = Math.max(0, Math.min(data.length - 1, index + offset));
      if (next === index || next < 0) return;
      setOptions((current) => ({ ...current, src: data[next] }));
      setScale(1);
      setRotate(0);
      setPosition({ left: 0, top: 0 });
      options.onSwitch?.(next);
    };
    const startDrag = (event: ReactMouseEvent) => {
      if (event.button !== 0) return;
      event.preventDefault();
      setDragging(true);
      dragRef.current = { x: event.clientX, y: event.clientY };
      const move = (moveEvent: MouseEvent) => {
        setPosition((current) => ({
          left: current.left + moveEvent.clientX - dragRef.current.x,
          top: current.top + moveEvent.clientY - dragRef.current.y,
        }));
        dragRef.current = { x: moveEvent.clientX, y: moveEvent.clientY };
      };
      const up = () => {
        setDragging(false);
        document.removeEventListener("mousemove", move);
        document.removeEventListener("mouseup", up);
      };
      document.addEventListener("mousemove", move);
      document.addEventListener("mouseup", up);
    };
    const download = async () => {
      if (!src || error) return;
      const response = await fetch(src);
      const url = URL.createObjectURL(await response.blob());
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "";
      anchor.click();
      URL.revokeObjectURL(url);
    };
    if (!visible) return null;
    return (
      <div className="k-image-preview-root">
        <div className="k-image-preview">
          <div className="k-image-preview-mask" onClick={close} />
          <div
            className="k-image-preview-wrap"
            style={{ right: panelVisible && options.panel ? 320 : 0 }}
          >
            <ul className="k-image-preview-control">
              <li className="k-image-preview-action-nav">
                <Button
                  icon={ChevronLeft}
                  type="text"
                  disabled={index <= 0}
                  onClick={() => switchImage(-1)}
                />
                <span>
                  {index + 1 || 1}/{data.length || 1}
                </span>
                <Button
                  icon={ChevronRight}
                  type="text"
                  disabled={index < 0 || index >= data.length - 1}
                  onClick={() => switchImage(1)}
                />
              </li>
              <li
                className="k-image-preview-action"
                onClick={() => setRotate((value) => value - 90)}
              >
                <Icon type={RotateCcwSquare} />
              </li>
              <li
                className="k-image-preview-action"
                onClick={() => setRotate((value) => value + 90)}
              >
                <Icon type={RotateCwSquare} />
              </li>
              <li
                className={clsx("k-image-preview-action", {
                  "k-image-preview-action-disabled": scale <= 1,
                })}
                onClick={() => setScale((value) => Math.max(1, value - 1))}
              >
                <Icon type={Minus} />
              </li>
              <li className="k-image-preview-action k-image-preview-action-scale">
                <Slider
                  value={scale}
                  min={1}
                  max={10}
                  size="small"
                  tooltipVisible={false}
                  onChange={(value) => setScale(value as number)}
                />
              </li>
              <li
                className={clsx("k-image-preview-action", {
                  "k-image-preview-action-disabled": scale >= 10,
                })}
                onClick={() => setScale((value) => Math.min(10, value + 1))}
              >
                <Icon type={Plus} />
              </li>
              <li className="k-image-preview-action" onClick={download}>
                <Icon type={ArrowDown} />
              </li>
              {options.tools && <li className="k-image-preview-action">{options.tools}</li>}
              <li className="k-image-preview-action-divider" />
              <li className="k-image-preview-action" onClick={close}>
                <Icon type={X} />
              </li>
            </ul>
            <div
              className="k-image-preview-img-wrap"
              style={{
                transform: `translate3d(${position.left}px, ${position.top}px, 0)`,
                transition: dragging ? "none" : undefined,
              }}
            >
              {options.type === "media" ? (
                <video
                  controls
                  className="k-image-preview-img"
                  src={src}
                  style={{ transform: `scale3d(${scale},${scale},1) rotate(${rotate}deg)` }}
                  onMouseDown={startDrag}
                />
              ) : error ? (
                <div className="k-image-preview-img-error">
                  <Icon type={ImageIcon} />
                </div>
              ) : (
                !loading && (
                  <img
                    className="k-image-preview-img"
                    src={src}
                    style={{ transform: `scale3d(${scale},${scale},1) rotate(${rotate}deg)` }}
                    onMouseDown={startDrag}
                  />
                )
              )}
            </div>
            {data.length > 1 && (
              <>
                <div
                  className={clsx("k-image-preview-switch-left", {
                    "k-image-preview-switch-disabled": index <= 0,
                  })}
                  onClick={() => switchImage(-1)}
                >
                  <Icon type={ArrowLeft} />
                </div>
                <div
                  className={clsx("k-image-preview-switch-right", {
                    "k-image-preview-switch-disabled": index >= data.length - 1,
                  })}
                  onClick={() => switchImage(1)}
                >
                  <Icon type={ArrowRight} />
                </div>
              </>
            )}
            {loading && (
              <div className="k-image-preview-loading">
                <Icon type={Loading} spin />
              </div>
            )}
          </div>
          {options.panel && (
            <div
              className={clsx("k-image-preview-panel", {
                "k-image-preview-panel-hidden": !panelVisible,
              })}
            >
              <span className="k-image-preview-panel-action" onClick={togglePanel}>
                <Icon type={ChevronRight} />
              </span>
              {options.panel}
            </div>
          )}
        </div>
      </div>
    );
  }
);
export default ImagePreview;
