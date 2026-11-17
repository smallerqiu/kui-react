import clsx from "clsx";
import { useRef, useState, type HTMLAttributes } from "react";
import Popup, { PopupArrow, type PopupRef } from "../popup";
import { ColorPickerPanel } from "../color-picker";
import { useFormAppearance } from "../config/use-config-appearance";
import { type ColorMode } from "../color-picker/mode";
import type { SizeType } from "../const/types";
import { createFormFieldComponent } from "../form/field-context";
import { useValue } from "../utils/use-value";
import Corners from "./corners";
import Stops from "./stops";
import {
  formatColor,
  formatGradient,
  gradientColorAtOffset,
  normalizeGradient,
  type CornerGradientValue,
  type GradientStop,
  type GradientType,
  type GradientValue,
} from "./types";

export type { CornerGradientValue, GradientStop, GradientType, GradientValue } from "./types";

export interface GradientPickerProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange" | "defaultValue" | "defaultChecked"
> {
  /** 渐变值，受控；色条、四角与颜色面板都跟随它。 */
  value?: GradientValue;
  /** 渐变类型，linear 为多色标渐变，corner 为四角渐变。 */
  type?: GradientType;
  /** 颜色面板是否提供透明度调节；开启后色标颜色可以是 `#rrggbbaa` / `rgba()`。 */
  alpha?: boolean;
  arrowPointAtCenter?: boolean;
  /** 颜色面板输入区的展示类型。 */
  mode?: ColorMode;
  /** 控件尺寸，与其它控件一样分三档；色条加色标或四角预览块的总高度与对应尺寸的控件一致。 */
  size?: SizeType;
  disabled?: boolean;
  readOnly?: boolean;
  onChange?: (value: GradientValue) => void;
  onUpdateMode?: (mode: ColorMode) => void;
}

function GradientPicker({
  value,
  type = "linear",
  alpha = false,
  arrowPointAtCenter = true,
  mode: modeProp,
  size: sizeProp,
  disabled = false,
  readOnly = false,
  onChange,
  onUpdateMode,
  className,
  ...rest
}: GradientPickerProps) {
  const [innerValue, setInnerValue] = useValue(value, (next) => normalizeGradient(next, type));
  const [selectedStop, setSelectedStop] = useState(0);
  const [selectedCorner, setSelectedCorner] = useState(0);
  const [innerMode, setInnerMode] = useState<ColorMode>(modeProp ?? "hex");
  const mode = modeProp ?? innerMode;
  const appearance = useFormAppearance();
  const size = sizeProp ?? appearance.size;
  const [colorOpen, setColorOpen] = useState(false);
  const popup = useRef<PopupRef>(null);
  // The color panel follows whichever handle asked for it; the ref is what the popup anchors to.
  const markerRef = useRef<HTMLElement | null>(null);
  const blocked = disabled || readOnly;
  // `value` coming back from the parent after onChange is our own edit, not an outside change.
  // Compare the normalized content: a parent may clone the value, so the object identity is not reliable.
  const [lastEmitted, setLastEmitted] = useState<string | null>(null);

  // Switching `type` is authoritative: convert whatever is on screen the way the panel switches,
  // and start over from the first stop / corner.
  let current = innerValue;
  let stopIndex = selectedStop;
  const [syncedType, setSyncedType] = useState(type);
  if (syncedType !== type) {
    current = normalizeGradient(innerValue, type);
    setSyncedType(type);
    setInnerValue(current);
    setSelectedStop(0);
    setSelectedCorner(0);
    stopIndex = 0;
  }
  if (type === "linear" && stopIndex > (current as GradientStop[]).length - 1) {
    stopIndex = Math.max(0, (current as GradientStop[]).length - 1);
  }
  const cornerIndex = Math.min(selectedCorner, 3);
  const selectedColor =
    type === "corner"
      ? ((current as CornerGradientValue)[cornerIndex] ?? "#000000")
      : ((current as GradientStop[])[Math.max(0, stopIndex)]?.color ?? "#000000");
  const [syncedSource, setSyncedSource] = useState(value);
  if (syncedSource !== value) {
    setSyncedSource(value);
    if (JSON.stringify(normalizeGradient(value, type)) !== lastEmitted) setColorOpen(false);
  }
  const [syncedBlocked, setSyncedBlocked] = useState(blocked);
  if (syncedBlocked !== blocked) {
    setSyncedBlocked(blocked);
    if (blocked) setColorOpen(false);
  }

  const commit = (next: GradientValue) => {
    if (blocked) return;
    setLastEmitted(JSON.stringify(next));
    setInnerValue(next);
    onChange?.(next);
  };

  const writeSelectedColor = (color: string) => {
    if (blocked) return;
    const next = formatColor(color);
    const gradient = innerValue;
    if (type === "corner") {
      const colors = [...(gradient as CornerGradientValue)] as CornerGradientValue;
      colors[cornerIndex] = next;
      commit(colors);
    } else {
      const stops = (gradient as GradientStop[]).map((stop, index) =>
        index === stopIndex ? { ...stop, color: next } : stop,
      );
      commit(stops);
    }
  };
  const changeMode = (next: ColorMode) => {
    if (blocked) return;
    if (modeProp === undefined) setInnerMode(next);
    onUpdateMode?.(next);
  };

  // A stop or corner asks for its color panel: the panel follows that marker.
  const openColorPanel = (index: number, element: HTMLElement) => {
    if (blocked) return;
    if (type === "linear") setSelectedStop(index);
    else setSelectedCorner(index);
    markerRef.current = element;
    setColorOpen(true);
    popup.current?.updatePosition();
  };

  const addStop = (offset: number) => {
    if (blocked || type !== "linear") return;
    const stops = innerValue as GradientStop[];
    const color = gradientColorAtOffset(stops, offset);
    const index = stops.filter((stop) => stop.offset < offset).length;
    const next = [...stops];
    next.splice(index, 0, { color, offset });
    commit(next);
    setSelectedStop(index);
  };
  const moveStop = (index: number, offset: number) => {
    if (blocked || type !== "linear") return;
    const next = (innerValue as GradientStop[]).map((stop, i) =>
      i === index ? { ...stop, offset } : stop,
    );
    commit(next);
  };
  const removeStop = (index: number) => {
    if (blocked || type !== "linear") return;
    const stops = innerValue as GradientStop[];
    if (stops.length <= 2) return;
    const next = stops.filter((_, i) => i !== index);
    commit(next);
    setSelectedStop(Math.max(0, Math.min(index, next.length - 1)));
    setColorOpen(false);
  };

  // The panel is ColorPicker's own; its alpha row follows the `alpha` switch. It sits in a plain
  // box because the popup positions whatever it is given, and it needs a DOM element to measure.
  const colorPanel = (
    <div className="k-gradient-picker-color-popup k-color-picker-dropdown">
      <ColorPickerPanel
        value={selectedColor}
        disabled={blocked}
        disabledAlpha={!alpha}
        mode={mode}
        onChange={writeSelectedColor}
        onUpdateMode={changeMode}
      />
      <PopupArrow prefixCls="k-color-picker" />
    </div>
  );

  const cssText = formatGradient(current);
  return (
    <div
      {...rest}
      className={clsx(
        "k-gradient-picker",
        {
          "k-gradient-picker-disabled": disabled,
          "k-gradient-picker-readonly": readOnly,
          "k-gradient-picker-sm": size === "small",
          "k-gradient-picker-lg": size === "large",
        },
        className,
      )}
      aria-disabled={disabled || undefined}
      aria-readonly={readOnly || undefined}
    >
      {type === "linear" ? (
        <>
          <div className="k-gradient-picker-bar">
            <div className="k-gradient-picker-bar-fill" style={{ backgroundImage: cssText }} />
          </div>
          <Stops
            disabled={blocked}
            stops={current as GradientStop[]}
            selected={Math.max(0, stopIndex)}
            onAdd={addStop}
            onMove={moveStop}
            onRemove={removeStop}
            onSelect={setSelectedStop}
            onActivate={openColorPanel}
          />
        </>
      ) : (
        <Corners
          disabled={blocked}
          colors={current as CornerGradientValue}
          selected={cornerIndex}
          gradient={cssText}
          onActivate={openColorPanel}
        />
      )}
      <Popup
        ref={popup}
        raw
        arrowPointAtCenter={arrowPointAtCenter}
        open={colorOpen}
        target={markerRef}
        trigger="manual"
        placement="bottom-left"
        offset={6}
        destroyOnClose
        transitionName="k-color-picker"
        transitionDuration={200}
        outsideEvent="mousedown"
        onOpenChange={(open) => {
          if (!open) setColorOpen(false);
        }}
        overlay={colorPanel}
      />
    </div>
  );
}

export default createFormFieldComponent(GradientPicker, {
  inherit: ["size", "disabled", "readOnly"],
});
