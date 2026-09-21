import { isEventOutside } from "./popup";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import type { PlacementsType } from "../const/types";
import { setPlacement } from "./placement";

export function usePopoverPosition(
  placement: PlacementsType,
  visible: boolean,
  panelOnly: boolean,
  title: ReactNode,
) {
  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);
  const [currentPlacement, setCurrentPlacement] = useState(placement);
  const [transOrigin, setTransOrigin] = useState("bottom");
  const refPopper = useRef<HTMLDivElement>(null);
  const refSelection = useRef<HTMLElement>(null);
  const placementRef = useRef<string>(placement);
  const transOriginRef = useRef("bottom");
  const topRef = useRef(0);
  const leftRef = useRef(0);
  const updatePosition = useCallback(() => {
    if (!refSelection.current || !refPopper.current) return;
    placementRef.current = placement;
    setPlacement({
      refSelection,
      refPopper,
      currentPlacement: placementRef,
      transOrigin: transOriginRef,
      top: topRef,
      left: leftRef,
    });
    setCurrentPlacement(placementRef.current as PlacementsType);
    setTransOrigin(transOriginRef.current);
    setTop(topRef.current);
    setLeft(leftRef.current);
  }, [placement]);
  useEffect(() => {
    if (panelOnly || !visible) return;
    updatePosition();
  }, [panelOnly, title, updatePosition, visible]);
  useEffect(() => {
    if (panelOnly) return;
    window.addEventListener("resize", updatePosition);
    document.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      document.removeEventListener("scroll", updatePosition, true);
    };
  }, [panelOnly, updatePosition]);
  const setSelectionRef = useCallback((node: HTMLElement | null) => {
    refSelection.current = node;
  }, []);
  return {
    left,
    top,
    currentPlacement,
    transOrigin,
    refPopper,
    refSelection,
    updatePosition,
    setSelectionRef,
  };
}

export function usePopoverOutsideClick(
  visible: boolean,
  refSelection: React.RefObject<HTMLElement | null>,
  refPopper: React.RefObject<HTMLElement | null>,
  updateShow: (value: boolean) => void,
) {
  useEffect(() => {
    if (!visible) return;
    const outsideClick = (event: MouseEvent) => {
      if (isEventOutside(event, [refSelection.current, refPopper.current])) updateShow(false);
    };
    document.addEventListener("click", outsideClick);
    return () => document.removeEventListener("click", outsideClick);
  }, [visible, refSelection, refPopper, updateShow]);
}
