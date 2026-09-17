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
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  type TouchEvent as ReactTouchEvent,
} from "react";
import { Button } from "../button";
import Icon from "../icon";
import Slider from "../slider";
import Transition from "../base/transition";
import { loadImage } from "./utils";

export type ImageType = "img" | "media";

export interface ImagePreviewProps {
  type?: ImageType;
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
    const [panelRight, setPanelRight] = useState(0);
    const dragRef = useRef({ x: 0, y: 0 });
    const imageRef = useRef<HTMLImageElement | HTMLVideoElement>(null);
    const stopDragRef = useRef<() => void>(() => {});
    const visibleRef = useRef(true);
    const optionsRef = useRef(options);
    const panelRef = useRef<HTMLDivElement>(null);
    const data = options.data ?? [];
    const src = options.src ?? "";
    const index = data.indexOf(src);
    const setImageRef = useCallback((node: HTMLImageElement | HTMLVideoElement | null) => {
      imageRef.current = node;
    }, []);

    optionsRef.current = options;
    visibleRef.current = visible;
    const resetTransform = useCallback(() => {
      setScale(1);
      setRotate(0);
      setPosition({ left: 0, top: 0 });
      setDragging(false);
    }, []);
    const constrainPosition = useCallback(
      (current: { left: number; top: number }, nextScale = scale, nextRotate = rotate) => {
        const image = imageRef.current;
        if (!image || typeof window === "undefined") return current;

        const vertical = Math.abs(nextRotate / 90) % 2 === 0;
        const width = vertical ? image.offsetWidth : image.offsetHeight;
        const height = vertical ? image.offsetHeight : image.offsetWidth;
        const availableWidth = window.innerWidth - panelRight;
        const maxLeft = Math.max(0, (width * nextScale - availableWidth) / 2);
        const maxTop = Math.max(0, (height * nextScale - window.innerHeight) / 2);

        return {
          left: Math.max(-maxLeft, Math.min(maxLeft, current.left)),
          top: Math.max(-maxTop, Math.min(maxTop, current.top)),
        };
      },
      [panelRight, rotate, scale],
    );
    const changeScale = useCallback(
      (nextScale: number) => {
        const value = Math.max(1, Math.min(10, nextScale));
        setScale(value);
        setPosition((current) => constrainPosition(current, value, rotate));
      },
      [constrainPosition, rotate],
    );
    const changeRotate = useCallback(
      (offset: number) => {
        const value = rotate + offset;
        setRotate(value);
        setPosition((current) => constrainPosition(current, scale, value));
      },
      [constrainPosition, rotate, scale],
    );
    const close = useCallback(() => {
      if (!visibleRef.current) return;
      visibleRef.current = false;
      setVisible(false);
      optionsRef.current.onClose?.();
    }, []);
    const togglePanel = () => setPanelVisible((value) => !value);
    useImperativeHandle(
      ref,
      () => ({
        show(props) {
          resetTransform();
          setOptions((current) => ({ ...current, ...props }));
          setPanelVisible(!!props.showPanel);
          visibleRef.current = true;
          setVisible(true);
        },
        close,
        togglePanel,
      }),
      [close, resetTransform],
    );
    useEffect(() => {
      setError(false);
      if (!src || options.type === "media") {
        setLoading(false);
        return;
      }
      setLoading(true);
      return loadImage(
        src,
        () => {
          setLoading(false);
          setError(false);
        },
        () => {
          setLoading(false);
          setError(true);
        },
      );
    }, [options.type, src]);
    useEffect(() => {
      const keydown = (event: KeyboardEvent) => {
        if (event.key === "Escape" && visibleRef.current) close();
      };
      const wheel = (event: WheelEvent) => {
        if (!visibleRef.current) return;
        event.preventDefault();
        changeScale(scale + (event.deltaY < 0 ? 1 : -1));
      };
      document.addEventListener("keydown", keydown);
      document.addEventListener("wheel", wheel, { passive: false });
      return () => {
        document.removeEventListener("keydown", keydown);
        document.removeEventListener("wheel", wheel);
      };
    }, [changeScale, close, scale]);
    useLayoutEffect(() => {
      if (!panelVisible || !options.panel || !panelRef.current) {
        setPanelRight(0);
        return;
      }
      const panel = panelRef.current;
      const update = () => setPanelRight(panel.offsetWidth);
      update();
      const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
      observer?.observe(panel);
      return () => observer?.disconnect();
    }, [options.panel, panelVisible]);
    useEffect(() => () => stopDragRef.current(), []);
    const switchImage = (offset: number) => {
      const next = Math.max(0, Math.min(data.length - 1, index + offset));
      if (next === index || next < 0) return;
      setOptions((current) => ({ ...current, src: data[next] }));
      resetTransform();
      options.onSwitch?.(next);
    };
    const startDrag = (
      event:
        | ReactMouseEvent<HTMLImageElement | HTMLVideoElement>
        | ReactTouchEvent<HTMLImageElement | HTMLVideoElement>,
    ) => {
      if ("button" in event && event.button !== 0) return;
      event.preventDefault();
      stopDragRef.current();
      setDragging(true);
      const touch = "touches" in event;
      const point = touch ? event.touches[0] : event;
      dragRef.current = { x: point.clientX, y: point.clientY };
      const move = (moveEvent: MouseEvent | TouchEvent) => {
        moveEvent.preventDefault();
        const nextPoint = "touches" in moveEvent ? moveEvent.touches[0] : moveEvent;
        if (!nextPoint) return;
        // Capture the delta before updating the ref: React may defer or replay the updater.
        const deltaX = nextPoint.clientX - dragRef.current.x;
        const deltaY = nextPoint.clientY - dragRef.current.y;
        dragRef.current = { x: nextPoint.clientX, y: nextPoint.clientY };
        setPosition((current) => ({
          left: current.left + deltaX,
          top: current.top + deltaY,
        }));
      };
      const up = () => {
        setDragging(false);
        setPosition((current) => constrainPosition(current));
        stopDragRef.current();
      };
      const stop = () => {
        document.removeEventListener("mousemove", move as EventListener);
        document.removeEventListener("mouseup", up);
        document.removeEventListener("touchmove", move as EventListener);
        document.removeEventListener("touchend", up);
        document.removeEventListener("touchcancel", up);
        stopDragRef.current = () => {};
      };
      stopDragRef.current = stop;
      if (touch) {
        document.addEventListener("touchmove", move as EventListener, { passive: false });
        document.addEventListener("touchend", up);
        document.addEventListener("touchcancel", up);
      } else {
        document.addEventListener("mousemove", move as EventListener, { passive: false });
        document.addEventListener("mouseup", up);
      }
    };
    const download = async () => {
      if (!src || error) return;
      try {
        const response = await fetch(src);
        if (!response.ok) return;
        const url = URL.createObjectURL(await response.blob());
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = "";
        anchor.click();
        URL.revokeObjectURL(url);
      } catch {
        // Cross-origin images may reject direct downloads. Keep the preview usable.
      }
    };
    return (
      <div className="k-image-preview-root">
        <Transition show={visible} name="k-image-fade" appear>
          <div className="k-image-preview">
            <div className="k-image-preview-mask" onClick={close} />
            <div className="k-image-preview-wrap" style={{ right: panelRight }}>
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
                  onClick={() => changeRotate(-90)}
                >
                  <Icon type={RotateCcwSquare} />
                </li>
                <li
                  className="k-image-preview-action"
                  onClick={() => changeRotate(90)}
                >
                  <Icon type={RotateCwSquare} />
                </li>
                <li
                  className={clsx("k-image-preview-action", {
                    "k-image-preview-action-disabled": scale <= 1,
                  })}
                  onClick={() => changeScale(scale - 1)}
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
                    onChange={(value) => changeScale(value as number)}
                  />
                </li>
                <li
                  className={clsx("k-image-preview-action", {
                    "k-image-preview-action-disabled": scale >= 10,
                  })}
                  onClick={() => changeScale(scale + 1)}
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
                    ref={setImageRef}
                    draggable={false}
                    controls
                    className="k-image-preview-img"
                    src={src}
                    style={{ transform: `scale3d(${scale},${scale},1) rotate(${rotate}deg)` }}
                    onMouseDown={startDrag}
                    onTouchStart={startDrag}
                  />
                ) : error ? (
                  <div className="k-image-preview-img-error">
                    <Icon type={ImageIcon} />
                  </div>
                ) : (
                  !loading && (
                    <img
                      ref={setImageRef}
                      draggable={false}
                      className="k-image-preview-img"
                      src={src}
                      style={{ transform: `scale3d(${scale},${scale},1) rotate(${rotate}deg)` }}
                      onMouseDown={startDrag}
                      onTouchStart={startDrag}
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
                ref={panelRef}
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
        </Transition>
      </div>
    );
  },
);
export default ImagePreview;
