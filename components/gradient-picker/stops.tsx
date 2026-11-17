import { useEffect, useRef, useState, type TouchEvent as ReactTouchEvent } from "react";
import { clamp } from "../utils/share";
import type { GradientStop } from "./types";

const round = (value: number) => Math.round(value * 100) / 100;
type StartEvent = Pick<
  MouseEvent,
  "clientX" | "clientY" | "currentTarget" | "preventDefault" | "stopPropagation"
>;
const touchStart = (event: ReactTouchEvent): StartEvent => ({
  clientX: event.touches[0].clientX,
  clientY: event.touches[0].clientY,
  currentTarget: event.currentTarget,
  preventDefault: () => event.preventDefault(),
  stopPropagation: () => event.stopPropagation(),
});

export interface StopsProps {
  disabled?: boolean;
  stops: GradientStop[];
  selected?: number;
  onAdd?: (offset: number) => void;
  onMove?: (index: number, offset: number) => void;
  onRemove?: (index: number) => void;
  onSelect?: (index: number) => void;
  onActivate?: (index: number, element: HTMLElement) => void;
}

export default function Stops({
  disabled = false,
  stops,
  selected = 0,
  onAdd,
  onMove,
  onRemove,
  onSelect,
  onActivate,
}: StopsProps) {
  const laneRef = useRef<HTMLDivElement>(null);
  // The stop being dragged out of the bar; drawing it faded is the only sign of the pending delete.
  const [removingIndex, setRemovingIndex] = useState(-1);
  const removingRef = useRef(-1);
  const dragRef = useRef({
    dragging: false,
    moved: false,
    index: -1,
    element: null as HTMLElement | null,
    startX: 0,
    startY: 0,
    min: 0,
    max: 100,
  });
  const cleanupRef = useRef<() => void>(() => undefined);
  // The drag listeners are attached once, at press time; each parent edit re-renders this component,
  // so they must reach the newest handlers rather than the ones captured when the drag began.
  const handlersRef = useRef({ onMove, onRemove, onActivate, stopsLength: stops.length });
  useEffect(() => {
    handlersRef.current = { onMove, onRemove, onActivate, stopsLength: stops.length };
  });

  const markRemoving = (index: number) => {
    removingRef.current = index;
    setRemovingIndex(index);
  };

  const stopDrag = () => {
    dragRef.current.dragging = false;
    dragRef.current.moved = false;
    dragRef.current.element = null;
    cleanupRef.current();
    cleanupRef.current = () => undefined;
    markRemoving(-1);
  };

  useEffect(() => () => cleanupRef.current(), []);
  // Disabling can arrive mid-drag: drop the listeners and the pending-delete mark at once. The
  // visual reset happens during render (`setState` in an effect would cascade a second pass), while
  // this effect only touches refs — the drag handlers must not keep reaching the parent.
  const [disabledState, setDisabledState] = useState(disabled);
  if (disabledState !== disabled) {
    setDisabledState(disabled);
    if (disabled) setRemovingIndex(-1);
  }
  useEffect(() => {
    if (!disabled) return;
    dragRef.current.dragging = false;
    dragRef.current.element = null;
    removingRef.current = -1;
    cleanupRef.current();
    cleanupRef.current = () => undefined;
  }, [disabled]);

  const offsetAt = (clientX: number) => {
    const rect = laneRef.current?.getBoundingClientRect();
    if (!rect || !rect.width) return 0;
    return round(clamp(((clientX - rect.left) / rect.width) * 100, 0, 100));
  };

  const beginDrag = (
    index: number,
    event: StartEvent,
    min: number,
    max: number,
    element: HTMLElement | null,
  ) => {
    cleanupRef.current();
    dragRef.current = {
      dragging: true,
      moved: false,
      index,
      element,
      startX: event.clientX,
      startY: event.clientY,
      min,
      max,
    };
    const move = (event: Pick<MouseEvent, "clientX" | "clientY">) => {
      const drag = dragRef.current;
      if (!drag.dragging) return;
      // A press that travels is a drag, not a click asking for the color panel.
      if (Math.abs(event.clientX - drag.startX) > 2 || Math.abs(event.clientY - drag.startY) > 2) {
        drag.moved = true;
      }
      const offset = round(clamp(offsetAt(event.clientX), drag.min, drag.max));
      handlersRef.current.onMove?.(drag.index, offset);
      markRemoving(
        event.clientY - drag.startY > 24 && handlersRef.current.stopsLength > 2 ? drag.index : -1,
      );
    };
    const touchMove = (event: TouchEvent) => {
      if (event.cancelable) event.preventDefault();
      if (event.touches[0]) move(event.touches[0]);
    };
    const up = () => {
      const { index: dragged, element: marker, moved } = dragRef.current;
      const removing = removingRef.current >= 0;
      const activating = !removing && !moved && marker !== null;
      stopDrag();
      if (removing) handlersRef.current.onRemove?.(dragged);
      else if (activating) handlersRef.current.onActivate?.(dragged, marker as HTMLElement);
    };
    cleanupRef.current = () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
      document.removeEventListener("touchmove", touchMove);
      document.removeEventListener("touchend", up);
      document.removeEventListener("touchcancel", stopDrag);
    };
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
    document.addEventListener("touchmove", touchMove, { passive: false });
    document.addEventListener("touchend", up);
    document.addEventListener("touchcancel", stopDrag);
  };

  // Empty space below the bar adds a stop; a press near an existing one grabs it instead.
  const startLaneDrag = (event: StartEvent) => {
    if (disabled) return;
    event.preventDefault();
    const offset = offsetAt(event.clientX);
    const near = stops.findIndex((stop) => Math.abs(stop.offset - offset) <= 2);
    let index = near;
    if (near >= 0) {
      onSelect?.(near);
    } else {
      index = stops.filter((stop) => stop.offset < offset).length;
      onAdd?.(offset);
      onSelect?.(index);
    }
    const previous = stops[index - 1];
    const next = near >= 0 ? stops[index + 1] : stops[index];
    const low = previous ? previous.offset + 0.1 : 0;
    const high = next ? next.offset - 0.1 : 100;
    const current = near >= 0 ? stops[index].offset : offset;
    beginDrag(index, event, Math.min(low, current), Math.max(high, current), null);
  };

  const startStopDrag = (event: StartEvent, index: number) => {
    if (disabled) return;
    event.preventDefault();
    event.stopPropagation();
    onSelect?.(index);
    const previous = stops[index - 1];
    const next = stops[index + 1];
    const low = previous ? previous.offset + 0.1 : 0;
    const high = next ? next.offset - 0.1 : 100;
    const current = stops[index].offset;
    const element = event.currentTarget as HTMLElement;
    beginDrag(index, event, Math.min(low, current), Math.max(high, current), element);
  };

  const onKeydown = (event: React.KeyboardEvent, index: number) => {
    if (disabled) return;
    const stop = stops[index];
    const previous = stops[index - 1];
    const next = stops[index + 1];
    const low = previous ? previous.offset + 0.1 : 0;
    const high = next ? next.offset - 0.1 : 100;
    const current = stop.offset;
    const lower = Math.min(low, current);
    const upper = Math.max(high, current);
    const step = event.shiftKey ? 10 : 1;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      const offset = stop.offset + (event.key === "ArrowRight" ? step : -step);
      onMove?.(index, round(clamp(offset, lower, upper)));
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      onMove?.(index, round(event.key === "Home" ? lower : upper));
    } else if ((event.key === "Delete" || event.key === "Backspace") && stops.length > 2) {
      event.preventDefault();
      onRemove?.(index);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect?.(index);
      onActivate?.(index, event.currentTarget as HTMLElement);
    }
  };

  return (
    <div
      className="k-gradient-picker-stops"
      ref={laneRef}
      onMouseDown={startLaneDrag}
      onTouchStart={(event) => {
        if (event.touches.length === 1) startLaneDrag(touchStart(event));
      }}
    >
      {stops.map((stop, index) => (
        <span
          key={index}
          className={[
            "k-gradient-picker-stop",
            index === selected && "k-gradient-picker-stop-active",
            index === removingIndex && "k-gradient-picker-stop-removing",
          ]
            .filter(Boolean)
            .join(" ")}
          style={{ left: `${stop.offset}%` }}
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-label={`Color stop ${index + 1}`}
          aria-haspopup="dialog"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={stop.offset}
          aria-disabled={disabled || undefined}
          onMouseDown={(event) => startStopDrag(event, index)}
          onTouchStart={(event) => {
            if (event.touches.length === 1) startStopDrag(touchStart(event), index);
          }}
          onKeyDown={(event) => onKeydown(event, index)}
        >
          <span className="k-gradient-picker-stop-color" style={{ backgroundColor: stop.color }} />
        </span>
      ))}
    </div>
  );
}
