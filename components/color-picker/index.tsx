import { isEventOutside } from "../utils/popup";
import clsx from "clsx";
import Color, { type ColorInstance, type ColorObject } from "color";
import {
  isValidElement,
  useCallback,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import Teleport from "../base/teleport";
import Transition from "../base/transition";
import { useConfigAppearance } from "../config/use-config-appearance";
import type { DropPlacementsType, ShapeType, SizeType, ThemeType } from "../const/types";
import { createFormFieldComponent } from "../form/field-context";
import { setPlacement } from "../utils/placement";
import { useValue } from "../utils/use-value";
import Alpha from "./alpha";
import Hue from "./hue";
import Mode, { type ColorMode } from "./mode";
import Paint from "./paint";
import Presets from "./presets";

export interface ColorPickerProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange" | "defaultValue"
> {
  value?: string;
  open?: boolean;
  defaultOpen?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  disabledAlpha?: boolean;
  showText?: boolean;
  placement?: DropPlacementsType;
  trigger?: "hover" | "click";
  size?: SizeType;
  theme?: ThemeType;
  shape?: ShapeType;
  mode?: ColorMode;
  presets?: string[];
  onChange?: (color: string) => void;
  onUpdateMode?: (mode: ColorMode) => void;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
  /** Render only the color panel without a trigger or portal. */
  panelOnly?: boolean;
}

function ColorPicker({
  value,
  open: openProp,
  defaultOpen = false,
  disabled = false,
  readOnly = false,
  disabledAlpha = false,
  showText = false,
  placement = "bottom-left",
  trigger = "click",
  size: sizeProp,
  theme: themeProp,
  shape: shapeProp,
  mode: modeProp,
  presets,
  onChange,
  onUpdateMode,
  onOpenChange,
  className,
  children,
  panelOnly = false,
  ...rest
}: ColorPickerProps) {
  const inheritedAppearance = useConfigAppearance();
  const size = sizeProp ?? inheritedAppearance.size;
  const theme = themeProp ?? inheritedAppearance.theme ?? "fill";
  const shape = shapeProp ?? inheritedAppearance.shape;
  const [innerColor, setInnerColor] = useValue(value, (next) => next ?? "#000000ff");
  const [innerMode, setInnerMode] = useState<ColorMode>(modeProp ?? "hex");
  const mode = modeProp ?? innerMode;
  const [initialColor] = useState(() => Color(value ?? "#000000ff"));
  const [currentHue, setCurrentHue] = useState(initialColor.hue());
  const [currentAlpha, setCurrentAlpha] = useState(initialColor.alpha());
  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const currentOpen = panelOnly || (openProp ?? innerOpen);
  const [position, setPosition] = useState({ left: 0, top: 0, origin: "bottom" });
  const [currentPlacement, setCurrentPlacement] = useState(placement);
  const triggerRef = useRef<HTMLElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const placementRef = useRef<string>(placement);
  const transOriginRef = useRef("bottom");
  const topRef = useRef(0);
  const leftRef = useRef(0);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentValue = innerColor;
  const [syncedValue, setSyncedValue] = useState(currentValue);
  if (syncedValue !== currentValue) {
    const next = Color(currentValue);
    setSyncedValue(currentValue);
    setCurrentAlpha(next.alpha());
    if (next.saturationv() > 0) setCurrentHue(next.hue());
  }
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
    if (disabled || readOnly) return;
    const formatted = format(next, targetMode);
    setInnerColor(formatted);
    onChange?.(formatted);
  };
  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !popoverRef.current) return;
    placementRef.current = placement;
    setPlacement({
      refSelection: triggerRef,
      refPopper: popoverRef,
      currentPlacement: placementRef,
      transOrigin: transOriginRef,
      top: topRef,
      left: leftRef,
    });
    setCurrentPlacement(placementRef.current as DropPlacementsType);
    setPosition({ left: leftRef.current, top: topRef.current, origin: transOriginRef.current });
  }, [placement]);
  const setVisible = useCallback(
    (next: boolean) => {
      if (disabled || readOnly || panelOnly) return;
      if (openProp === undefined) setInnerOpen(next);
      onOpenChange?.(next);
      if (next) requestAnimationFrame(updatePosition);
    },
    [disabled, onOpenChange, openProp, panelOnly, readOnly, updatePosition],
  );
  // 清理未完成的隐藏定时器，防止在组件卸载后调用 setState
  useEffect(
    () => () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    },
    [],
  );
  const updatePositionRef = useRef(updatePosition);
  useEffect(() => {
    updatePositionRef.current = updatePosition;
  });
  useEffect(() => {
    if (!currentOpen || panelOnly) return;
    const outside = (event: MouseEvent) => {
      if (isEventOutside(event, [popoverRef.current, triggerRef.current], false)) setVisible(false);
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
  }, [currentOpen, panelOnly, setVisible]);
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
      : { onClick: () => setVisible(!currentOpen) };
  const onTriggerKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    rest.onKeyDown?.(event as React.KeyboardEvent<HTMLDivElement>);
    if (event.defaultPrevented || disabled || readOnly) return;
    if (event.key === "Enter" || event.key === " " || event.key === "ArrowDown") {
      event.preventDefault();
      setVisible(true);
    } else if (event.key === "Escape" && currentOpen) {
      event.preventDefault();
      setVisible(false);
    }
  };
  const customTrigger = children && isValidElement(children) ? children : null;
  const triggerNode = customTrigger ? (
    <span
      ref={triggerRef}
      className="k-color-picker-custom-trigger"
      role="combobox"
      tabIndex={disabled ? undefined : 0}
      aria-haspopup="dialog"
      aria-expanded={currentOpen}
      aria-disabled={disabled || undefined}
      aria-readonly={readOnly || undefined}
      onKeyDown={onTriggerKeyDown}
      onClick={(event: React.MouseEvent) => {
        if (trigger === "click" && !event.defaultPrevented) setVisible(!currentOpen);
      }}
      onMouseEnter={() => {
        if (trigger === "hover") mouseEnter();
      }}
      onMouseLeave={() => {
        if (trigger === "hover") mouseLeave();
      }}
    >
      {customTrigger}
    </span>
  ) : (
    <div
      {...rest}
      ref={triggerRef as React.RefObject<HTMLDivElement>}
      className={clsx(
        "k-color-picker",
        {
          "k-color-picker-opened": currentOpen,
          "k-color-picker-disabled": disabled,
          "k-color-picker-readonly": readOnly,
          "k-color-picker-sm": size === "small",
          "k-color-picker-lg": size === "large",
          [`k-color-picker-${theme}`]: theme !== "outline",
          [`k-color-picker-${shape}`]: shape,
        },
        className,
      )}
      {...hoverProps}
      role="combobox"
      tabIndex={disabled ? undefined : (rest.tabIndex ?? 0)}
      aria-haspopup="dialog"
      aria-expanded={currentOpen}
      aria-disabled={disabled || undefined}
      aria-readonly={readOnly || undefined}
      onKeyDown={onTriggerKeyDown}
    >
      <div className="k-color-picker-selection">
        <div className="k-color-picker-color">
          <div className="k-color-picker-color-inner" style={{ backgroundColor: color.string() }} />
        </div>
        {showText && <div className="k-color-picker-trigger-text">{format(color)}</div>}
      </div>
    </div>
  );
  const blockPanelInteraction = (event: React.SyntheticEvent) => {
    if (disabled || readOnly) {
      event.preventDefault();
      event.stopPropagation();
    }
  };
  const dropdownContent = (
    <div
      ref={popoverRef}
      aria-disabled={disabled || undefined}
      onClickCapture={blockPanelInteraction}
      onMouseDownCapture={blockPanelInteraction}
      onKeyDownCapture={blockPanelInteraction}
      {...({ "k-placement": currentPlacement } as HTMLAttributes<HTMLDivElement>)}
      className={clsx("k-color-picker-dropdown", {
        "k-color-picker-disabled-alpha": disabledAlpha,
        "k-color-picker-panel": panelOnly,
      })}
      style={
        panelOnly
          ? undefined
          : {
              left: position.left,
              top: position.top,
              transformOrigin: position.origin,
            }
      }
      onMouseEnter={() => hideTimerRef.current && clearTimeout(hideTimerRef.current)}
      onMouseLeave={
        trigger === "hover"
          ? () => {
              hideTimerRef.current = setTimeout(() => setVisible(false), 300);
            }
          : undefined
      }
    >
      <div className="k-color-picker-body" inert={disabled || readOnly}>
        <Paint
          disabled={disabled || readOnly}
          hue={currentHue}
          value={color}
          onUpdateRGB={(rgb: ColorObject) => update(Color({ ...rgb, alpha: currentAlpha }).rgb())}
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
              disabled={disabled || readOnly}
              hue={currentHue}
              onUpdateHue={(hue) => {
                if (disabled || readOnly) return;
                setCurrentHue(hue);
                update(color.hue(hue).rgb());
              }}
            />
            {!disabledAlpha && (
              <Alpha
                disabled={disabled || readOnly}
                value={color}
                onUpdateAlpha={(alpha) => {
                  if (disabled || readOnly) return;
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
            if (disabled || readOnly) return;
            if (modeProp === undefined) setInnerMode(next);
            onUpdateMode?.(next);
            update(color, next);
          }}
          onUpdateColorValue={(next) => {
            if (disabled || readOnly) return;
            setCurrentAlpha(next.alpha());
            if (next.saturationv() > 0) setCurrentHue(next.hue());
            update(next);
          }}
        />
        <Presets
          presets={presets}
          color={color}
          onUpdateColor={(next) => {
            if (disabled || readOnly) return;
            setCurrentAlpha(next.alpha());
            setCurrentHue(next.hue());
            update(next.rgb());
          }}
        />
      </div>
      {!panelOnly && (
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
      )}
    </div>
  );
  const dropdown = panelOnly ? (
    dropdownContent
  ) : (
    <Teleport to="body">
      <Transition show={currentOpen} name="k-color-picker" timeout={200} nodeRef={popoverRef}>
        {dropdownContent}
      </Transition>
    </Teleport>
  );
  if (panelOnly) return dropdown;
  return (
    <>
      {triggerNode}
      {dropdown}
    </>
  );
}

export type ColorPickerPanelProps = Omit<
  ColorPickerProps,
  "panelOnly" | "open" | "defaultOpen" | "children"
>;
export function ColorPickerPanel(props: ColorPickerPanelProps) {
  return <ColorPicker {...props} panelOnly />;
}
export default createFormFieldComponent(ColorPicker);
