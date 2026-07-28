import clsx from "clsx";
import Color, { type ColorInstance, type ColorObject } from "color";
import {
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import type { DropPlacementsType, SizeType } from "../const/types";
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
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const triggerRef = useRef<HTMLElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentValue = controlled ?? innerColor;
  const color = Color(currentValue);
  const format = (next: ColorInstance) =>
    mode === "hex"
      ? next.alpha() < 1
        ? next.hexa()
        : next.hex()
      : mode === "rgb"
        ? next.rgb().string(0)
        : next.hsl().string(0);
  const update = (next: ColorInstance) => {
    const formatted = format(next);
    if (controlled === undefined) setInnerColor(formatted);
    onChange?.(formatted);
  };
  const updatePosition = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const dropdownWidth = popoverRef.current?.offsetWidth ?? 260;
    const dropdownHeight = popoverRef.current?.offsetHeight ?? 330;
    const left = placement.endsWith("right")
      ? rect.right - dropdownWidth
      : placement.endsWith("center")
        ? rect.left + (rect.width - dropdownWidth) / 2
        : rect.left;
    const top = placement.startsWith("top") ? rect.top - dropdownHeight - 8 : rect.bottom + 8;
    setPosition({ left: Math.max(8, left), top: Math.max(8, top) });
  };
  const setVisible = (next: boolean) => {
    if (disabled) return;
    setOpen(next);
    onOpenChange?.(next);
    if (next) requestAnimationFrame(updatePosition);
  };
  useEffect(() => setMode(modeProp), [modeProp]);
  useEffect(() => {
    if (!open) return;
    const outside = (event: MouseEvent) => {
      if (
        !popoverRef.current?.contains(event.target as Node) &&
        !triggerRef.current?.contains(event.target as Node)
      )
        setVisible(false);
    };
    document.addEventListener("mousedown", outside);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      document.removeEventListener("mousedown", outside);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, disabled, placement]);
  const hoverProps =
    trigger === "hover"
      ? {
          onMouseEnter: () => {
            if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
            setVisible(true);
          },
          onMouseLeave: () => {
            hideTimerRef.current = setTimeout(() => setVisible(false), 300);
          },
        }
      : { onClick: () => setVisible(!open) };
  const triggerNode =
    children && isValidElement(children) ? (
      cloneElement(children as ReactElement<any>, { ...hoverProps, ref: triggerRef })
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
            <div
              className="k-color-picker-color-inner"
              style={{ backgroundColor: color.string() }}
            />
          </div>
          {showText && <div className="k-color-picker-trigger-text">{format(color)}</div>}
        </div>
      </div>
    );
  const dropdown =
    open &&
    createPortal(
      <div
        ref={popoverRef}
        data-placement={placement}
        className={clsx("k-color-picker-dropdown", {
          "k-color-picker-disabled-alpha": disabledAlpha,
        })}
        style={{ position: "fixed", left: position.left, top: position.top }}
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
            hue={color.hue()}
            value={color}
            onUpdateRGB={(rgb: ColorObject) =>
              update(Color({ ...rgb, alpha: color.alpha() }).rgb())
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
              <Hue hue={color.hue()} onUpdateHue={(hue) => update(color.hue(hue).rgb())} />
              {!disabledAlpha && (
                <Alpha value={color} onUpdateAlpha={(alpha) => update(color.alpha(alpha).rgb())} />
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
            }}
            onUpdateColorValue={update}
          />
          <Presets presets={presets} color={color} onUpdateColor={update} />
        </div>
        <div className="k-color-picker-arrow">
          <svg style={{ fill: "currentcolor" }} viewBox="0 0 24 8">
            <path d="m24,.97v1c-4,0-5.5,1-7.5,3s-2.5,3-4.5,3-2.5-1-4.5-3S4,1.97,0,1.97v-1z" />
          </svg>
        </div>
      </div>,
      document.body
    );
  return (
    <>
      {triggerNode}
      {dropdown}
    </>
  );
}
