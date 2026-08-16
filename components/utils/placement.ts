// Placement utility for positioning popups/popovers
// Converted from Vue Ref-based API to React-friendly mutable object API

import type { RefObject } from "react";

const popupAppearanceSources = new Map<HTMLElement, HTMLElement>();
let popupAppearanceObserver: MutationObserver | null = null;
const inheritedAppearanceAttributes = ["theme-mode", "shape-mode"] as const;

const syncPopupAppearance = (popup: HTMLElement, source: HTMLElement) => {
  inheritedAppearanceAttributes.forEach((attribute) => {
    const owner = source.closest<HTMLElement>(`[${attribute}]`);
    const value = owner?.getAttribute(attribute);
    const currentValue = popup.getAttribute(attribute);
    if (value) {
      if (currentValue !== value) popup.setAttribute(attribute, value);
    } else if (currentValue !== null) {
      popup.removeAttribute(attribute);
    }
  });
};

const inheritPopupAppearance = (popup: HTMLElement, source: HTMLElement) => {
  popupAppearanceSources.set(popup, source);
  syncPopupAppearance(popup, source);
  if (popupAppearanceObserver || typeof document === "undefined") return;
  popupAppearanceObserver = new MutationObserver(() => {
    popupAppearanceSources.forEach((appearanceSource, appearancePopup) => {
      if (!appearancePopup.isConnected || !appearanceSource.isConnected) {
        popupAppearanceSources.delete(appearancePopup);
        return;
      }
      syncPopupAppearance(appearancePopup, appearanceSource);
    });
  });
  popupAppearanceObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: [...inheritedAppearanceAttributes],
    subtree: true,
  });
};

interface PlacementOptions {
  refSelection: RefObject<HTMLElement | null>;
  refPopper: RefObject<HTMLElement | null>;
  currentPlacement: RefObject<string>;
  position?: {
    x: number;
    y: number;
  } | null;
  transOrigin: RefObject<string>;
  top: RefObject<number>;
  left: RefObject<number>;
  offset?: number;
}

export function setPlacement({
  refSelection,
  refPopper,
  currentPlacement,
  position = null,
  transOrigin,
  top,
  left,
  offset = 3,
}: PlacementOptions) {
  if (!refPopper) return;
  if (refPopper.current && refSelection.current) {
    inheritPopupAppearance(refPopper.current, refSelection.current);
  }
  // 模式检测 & 基准矩形
  // 是否是鼠标右键/坐标模式
  const isMouseMode = position && typeof position.x === "number" && typeof position.y === "number";
  const rect = isMouseMode
    ? {
        width: 0,
        height: 0,
        top: position.y,
        bottom: position.y,
        left: position.x,
        right: position.x,
      }
    : refSelection.current?.getBoundingClientRect();

  const pickerH = refPopper.current?.offsetHeight || 0;
  const pickerW = refPopper.current?.offsetWidth || 0;
  const { clientHeight, clientWidth, scrollTop, scrollLeft } = document.documentElement;

  if (rect == null) return;
  // 计算居中坐标 (仅用于检测)
  const centerLeft = rect.left + rect.width / 2 - pickerW / 2;
  const centerTop = rect.top + rect.height / 2 - pickerH / 2;

  const check = {
    // 主轴
    top: rect.top > pickerH + offset,
    bottom: clientHeight - rect.bottom > pickerH + offset,
    left: rect.left > pickerW + offset,
    right: clientWidth - rect.right > pickerW + offset,

    // 交叉轴 - 对齐检测
    alignLeft: clientWidth - rect.left > pickerW,
    alignRight: rect.right > pickerW,
    alignTop: clientHeight - rect.top > pickerH,
    alignBottom: rect.bottom > pickerH,

    // 交叉轴 - 居中检测 (只有非鼠标模式才需要关心这个)
    centerH: centerLeft > 0 && centerLeft + pickerW < clientWidth,
    centerV: centerTop > 0 && centerTop + pickerH < clientHeight,
  };

  // 智能决策
  let [side, align] = currentPlacement.current.split("-");

  // [关键修复] 仅在鼠标模式下，强制补全对齐方向
  if (isMouseMode && !align) {
    if (side === "top" || side === "bottom") align = "left";
    else if (side === "left" || side === "right") align = "top";
  }

  // 主轴翻转 (Main Axis Flip)
  if (side === "top" && !check.top && check.bottom) side = "bottom";
  else if (side === "bottom" && !check.bottom && check.top) side = "top";
  else if (side === "left" && !check.left && check.right) side = "right";
  else if (side === "right" && !check.right && check.left) side = "left";

  // 交叉轴翻转 (Cross Axis Logic)
  if (side === "top" || side === "bottom") {
    if (align === "left" && !check.alignLeft && check.alignRight) align = "right";
    else if (align === "right" && !check.alignRight && check.alignLeft) align = "left";
    else if (!align && !check.centerH) {
      if (check.alignLeft) align = "left";
      else if (check.alignRight) align = "right";
    }
  } else if (side === "left" || side === "right") {
    if (align === "top" && !check.alignTop && check.alignBottom) align = "bottom";
    else if (align === "bottom" && !check.alignBottom && check.alignTop) align = "top";
    else if (!align && !check.centerV) {
      if (check.alignTop) align = "top";
      else if (check.alignBottom) align = "bottom";
    }
  }

  // 生成最终 placement
  const finalPlacement = align ? `${side}-${align}` : side;

  // 坐标计算
  let calcTop: number;
  let calcLeft: number;
  let originX: string;
  let originY: string;

  // Y 轴
  if (side === "top") {
    calcTop = rect.top - pickerH - offset;
    originY = "bottom";
  } else if (side === "bottom") {
    calcTop = rect.bottom + offset;
    originY = "top";
  } else {
    if (align === "top") {
      calcTop = rect.top;
      originY = "top";
    } else if (align === "bottom") {
      calcTop = rect.bottom - pickerH;
      originY = "bottom";
    } else {
      calcTop = rect.top + (rect.height - pickerH) / 2;
      originY = "center";
    }
  }

  // X 轴
  if (side === "left") {
    calcLeft = rect.left - pickerW - offset;
    originX = "right";
  } else if (side === "right") {
    calcLeft = rect.right + offset;
    originX = "left";
  } else {
    if (align === "left") {
      calcLeft = rect.left;
      originX = "left";
    } else if (align === "right") {
      calcLeft = rect.right - pickerW;
      originX = "right";
    } else {
      calcLeft = rect.left + (rect.width - pickerW) / 2;
      originX = "center";
    }
  }

  const anchorInViewport =
    rect.bottom > 0 && rect.top < clientHeight && rect.right > 0 && rect.left < clientWidth;
  if (anchorInViewport) {
    if (calcLeft < 0) calcLeft = 0;
    else if (calcLeft + pickerW > clientWidth) calcLeft = clientWidth - pickerW;

    if (calcTop < 0) calcTop = 0;
    else if (calcTop + pickerH > clientHeight) calcTop = clientHeight - pickerH;
  }

  // 将视口坐标换算为弹层实际定位容器的坐标。这样弹层被 Portal 到
  // ConfigProvider 指定的局部主题容器时，位置仍然准确。
  const offsetParent = refPopper.current?.offsetParent as HTMLElement | null;
  const isDocumentRoot =
    !offsetParent || offsetParent === document.body || offsetParent === document.documentElement;
  if (isDocumentRoot) {
    top.current = calcTop + scrollTop;
    left.current = calcLeft + scrollLeft;
  } else {
    const parentRect = offsetParent.getBoundingClientRect();
    top.current = calcTop - parentRect.top + offsetParent.scrollTop;
    left.current = calcLeft - parentRect.left + offsetParent.scrollLeft;
  }
  transOrigin.current = `${originX} ${originY}`;

  if (currentPlacement.current !== finalPlacement) {
    currentPlacement.current = finalPlacement;
  }
}
