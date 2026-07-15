// Placement utility for positioning popups/popovers
// Converted from Vue Ref-based API to React-friendly mutable object API

interface PlacementOptions {
  refSelection: HTMLElement | null;
  refPopper: HTMLElement | null;
  currentPlacement: { value: string };
  position?: {
    x: number;
    y: number;
  } | null;
  transOrigin: { value: string };
  top: { value: number };
  left: { value: number };
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

  // 模式检测 & 基准矩形
  let rect:
    | DOMRect
    | { width: number; height: number; top: number; bottom: number; left: number; right: number }
    | null = null;
  // 是否是鼠标右键/坐标模式
  const isMouseMode = position && typeof position.x === "number" && typeof position.y === "number";

  if (isMouseMode) {
    // 鼠标模式：0x0 虚拟矩形
    rect = {
      width: 0,
      height: 0,
      top: position.y,
      bottom: position.y,
      left: position.x,
      right: position.x,
    };
  } else if (refSelection) {
    // 元素模式：真实 DOM 矩形
    rect = refSelection.getBoundingClientRect?.();
  } else {
    return;
  }

  const pickerH = refPopper.offsetHeight;
  const pickerW = refPopper.offsetWidth;
  const { clientHeight, clientWidth, scrollTop, scrollLeft } = document.documentElement;

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
  let [side, align] = currentPlacement.value.split("-");

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
  let calcTop = 0;
  let calcLeft = 0;
  let originX = "center";
  let originY = "center";

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

  // 赋值
  top.value = calcTop + scrollTop;
  left.value = calcLeft + scrollLeft;
  transOrigin.value = `${originX} ${originY}`;

  if (currentPlacement.value !== finalPlacement) {
    currentPlacement.value = finalPlacement;
  }
}
