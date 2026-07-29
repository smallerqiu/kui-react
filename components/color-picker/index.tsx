import clsx from "clsx";
import Color, { type ColorInstance, type ColorObject } from "color";
import {
  cloneElement,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import PopupTransition from "../base/popup-transition";
import type { DropPlacementsType, SizeType } from "../const/types";
import { setPlacement } from "../utils/placement";
import Alpha from "./alpha";
import Hue from "./hue";
import Mode, { type ColorMode } from "./mode";
import Paint from "./paint";
import Presets from "./presets";

export interface ColorPickerProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: string;
  defaultValue?: string;
  modelValue?: string;
  disabled?: boolean;
  disabledAlpha?: boolean;
  showText?: boolean;
  placement?: DropPlacementsType;
  trigger?: "hover" | "click";
  size?: SizeType;
  mode?: ColorMode;
  presets?: string[];
  onChange?: (color: string) => void;
  onUpdateMode?: (mode: ColorMode) => void;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}

export default function ColorPicker({
  value,
  defaultValue,
  modelValue,
  disabled = false,
  disabledAlpha = false,
  showText = false,
  placement = "bottom-left",
  trigger = "click",
  size,
  mode: modeProp = "hex",
  presets,
  onChange,
  onUpdateMode,
  onOpenChange,
  className,
  children,
  ...rest
}: ColorPickerProps) {
  const controlled = value ?? modelValue;
  const [innerColor, setInnerColor] = useState(defaultValue ?? controlled ?? "#000000ff");
  const [mode, setMode] = useState<ColorMode>(modeProp);
  const initialColor = useMemo(() => Color(defaultValue ?? controlled ?? "#000000ff"), []);
  const [currentHue, setCurrentHue] = useState(initialColor.hue());
  const [currentAlpha, setCurrentAlpha] = useState(initialColor.alpha());
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ left: 0, top: 0, origin: "bottom" });
  const [currentPlacement, setCurrentPlacement] = useState(placement);
  const triggerRef = useRef<HTMLElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentValue = controlled ?? innerColor;
  const color = Color(currentValue);
  const format = (next: ColorInstance, targetMode = mode) =>
    targetMode === "hex"
      ? next.alpha() < 1
        ? next.hexa()
        : next.hex()
      : targetMode === "rgb"
        ? next.rgb().string(0)
        : next.hsl().string(0);
  const update = (next: ColorInstance, targetMode = mode) => {
    const formatted = format(next, targetMode);
    if (controlled === undefined) setInnerColor(formatted);
    onChange?.(formatted);
  };
  const updatePosition = () => {
    if (!triggerRef.current || !popoverRef.current) return;
    const placementValue = { value: currentPlacement };
    const originValue = { value: position.origin };
    const topValue = { value: position.top };
    const leftValue = { value: position.left };
    setPlacement({
      refSelection: triggerRef.current,
      refPopper: popoverRef.current,
      currentPlacement: placementValue,
      transOrigin: originValue,
      top: topValue,
      left: leftValue,
    });
    setCurrentPlacement(placementValue.value as DropPlacementsType);
    setPosition({ left: leftValue.value, top: topValue.value, origin: originValue.value });
  };
  const setVisible = (next: boolean) => {
    if (disabled) return;
    setOpen(next);
    onOpenChange?.(next);
    if (next) requestAnimationFrame(updatePosition);
  };
  useEffect(() => setMode(modeProp), [modeProp]);
  // 清理未完成的隐藏定时器，防止在组件卸载后调用 setState
  useEffect(
    () => () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    },
    []
  );
  useEffect(() => {
    const next = Color(currentValue);
    setCurrentAlpha(next.alpha());
    if (next.saturationv() > 0) setCurrentHue(next.hue());
  }, [currentValue]);
  useEffect(() => setCurrentPlacement(placement), [placement]);
  const updatePositionRef = useRef(updatePosition);
  useEffect(() => {
    updatePositionRef.current = updatePosition;
  });
  useEffect(() => {
    if (!open) return;
    const outside = (event: MouseEvent) => {
      if (
        !popoverRef.current?.contains(event.target as Node) &&
        !triggerRef.current?.contains(event.target as Node)
      )
        setVisible(false);
    };
    const handleResize = () => updatePositionRef.current();
    const handleScroll = () => updatePositionRef.current();
    document.addEventListener("mousedown", outside);
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", outside);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [open, disabled]);
  const mouseEnter = () => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    setVisible(true);
  };
  const mouseLeave = () => {
    hideTimerRef.current = setTimeout(() => setVisible(false), 300);
  };
  const hoverProps =
    trigger === "hover"
      ? { onMouseEnter: mouseEnter, onMouseLeave: mouseLeave }
      : { onClick: () => setVisible(!open) };
  const customTrigger =
    children && isValidElement(children)
      ? (children as ReactElement<{
          onClick?: (event: React.MouseEvent) => void;
          onMouseEnter?: (event: React.MouseEvent) => void;
          onMouseLeave?: (event: React.MouseEvent) => void;
          ref?: React.Ref<HTMLElement>;
        }>)
      : null;
  const triggerNode = customTrigger ? (
    cloneElement(customTrigger, {
      ref: (node: HTMLElement | null) => {
        triggerRef.current = node;
        const childRef = customTrigger.props.ref;
        if (typeof childRef === "function") childRef(node);
        else if (childRef) (childRef as React.RefObject<HTMLElement | null>).current = node;
      },
      onClick: (event: React.MouseEvent) => {
        customTrigger.props.onClick?.(event);
        if (trigger === "click" && !event.defaultPrevented) setVisible(!open);
      },
      onMouseEnter: (event: React.MouseEvent) => {
        customTrigger.props.onMouseEnter?.(event);
        if (trigger === "hover") mouseEnter();
      },
      onMouseLeave: (event: React.MouseEvent) => {
        customTrigger.props.onMouseLeave?.(event);
        if (trigger === "hover") mouseLeave();
      },
    })
  ) : (
    <div
      {...rest}
      ref={triggerRef as React.RefObject<HTMLDivElement>}
      className={clsx(
        "k-color-picker",
        {
          "k-color-picker-opened": open,
          "k-color-picker-disabled": disabled,
          "k-color-picker-sm": size === "small",
          "k-color-picker-lg": size === "large",
        },
        className
      )}
      {...hoverProps}
    >
      <div className="k-color-picker-selection">
        <div className="k-color-picker-color">
          <div className="k-color-picker-color-inner" style={{ backgroundColor: color.string() }} />
        </div>
        {showText && <div className="k-color-picker-trigger-text">{format(color)}</div>}
      </div>
    </div>
  );
  const dropdown =
    typeof document !== "undefined"
      ? createPortal(
          <PopupTransition visible={open} name="k-color-picker" nodeRef={popoverRef} timeout={200}>
            <div
              ref={popoverRef}
              {...({ "k-placement": currentPlacement } as HTMLAttributes<HTMLDivElement>)}
              className={clsx("k-color-picker-dropdown", {
                "k-color-picker-disabled-alpha": disabledAlpha,
              })}
              style={{
                left: position.left,
                top: position.top,
                transformOrigin: position.origin,
              }}
              onMouseEnter={() => hideTimerRef.current && clearTimeout(hideTimerRef.current)}
              onMouseLeave={
                trigger === "hover"
                  ? () => {
                      hideTimerRef.current = setTimeout(() => setVisible(false), 300);
                    }
                  : undefined
              }
            >
              <div className="k-color-picker-body">
                <Paint
                  hue={currentHue}
                  value={color}
                  onUpdateRGB={(rgb: ColorObject) =>
                    update(Color({ ...rgb, alpha: currentAlpha }).rgb())
                  }
                />
                <div className="k-color-picker-bar">
                  <div className="k-color-picker-avatar">
                    <div
                      className="k-color-picker-avatar-inner"
                      style={{ backgroundColor: color.string() }}
                    />
                  </div>
                  <div className="k-color-picker-bar-box">
                    <Hue
                      hue={currentHue}
                      onUpdateHue={(hue) => {
                        setCurrentHue(hue);
                        update(color.hue(hue).rgb());
                      }}
                    />
                    {!disabledAlpha && (
                      <Alpha
                        value={color}
                        onUpdateAlpha={(alpha) => {
                          setCurrentAlpha(alpha);
                          update(color.alpha(alpha).rgb());
                        }}
                      />
                    )}
                  </div>
                </div>
                <Mode
                  mode={mode}
                  value={color}
                  disabledAlpha={disabledAlpha}
                  onUpdateMode={(next) => {
                    setMode(next);
                    onUpdateMode?.(next);
                    update(color, next);
                  }}
                  onUpdateColorValue={(next) => {
                    setCurrentAlpha(next.alpha());
                    if (next.saturationv() > 0) setCurrentHue(next.hue());
                    update(next);
                  }}
                />
                <Presets
                  presets={presets}
                  color={color}
                  onUpdateColor={(next) => {
                    setCurrentAlpha(next.alpha());
                    setCurrentHue(next.hue());
                    update(next.rgb());
                  }}
                />
              </div>
              <div className="k-color-picker-arrow">
                <svg style={{ fill: "currentcolor" }} viewBox="0 0 24 8">
                  <path
                    id="ot"
                    d="m24,0.97087l0,1c-4,0 -5.5,1 -7.5,3c-2,2 -2.5,3 -4.5,3c-2,0 -2.5,-1 -4.5,-3c-2,-2 -3.5,-3 -7.5,-3l0,-1l24,0z"
                  />
                  <path
                    id="in"
                    stroke="currentcolor"
                    d="m24,0l0,1c-4,0 -5.5,1 -7.5,3c-2,2 -2.5,3 -4.5,3c-2,0 -2.5,-1 -4.5,-3c-2,-2 -3.5,-3 -7.5,-3l0,-1l24,0z"
                  />
                </svg>
              </div>
            </div>
          </PopupTransition>,
          document.body
        )
      : null;
  return (
    <>
      {triggerNode}
      {dropdown}
    </>
  );
}
