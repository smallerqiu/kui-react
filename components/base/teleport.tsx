import React, { useContext, useEffect, useLayoutEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { ConfigContext } from "../config/config-context";

export interface TeleportProps {
  /** 目标容器：支持 CSS 选择器字符串（如 "#modal"）、HTMLElement 实例或 null/undefined */
  to?: string | HTMLElement | null | undefined;
  /** 是否禁用传送。为 true 时，内容将在组件原本的 DOM 位置渲染 */
  disabled?: boolean;
  /** 延迟解析目标 DOM。开启后将在下一轮宏任务中寻找节点（适用于目标 DOM 挂载较晚的场景） */
  defer?: boolean;
  /** 被传送的子节点 */
  children: ReactNode;
}

// 兼容 SSR 的 Layout Effect Hook
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const Teleport: React.FC<TeleportProps> = ({ to, disabled = false, defer = false, children }) => {
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const { getPopupContainer } = useContext(ConfigContext);

  useIsomorphicLayoutEffect(() => {
    // 禁用状态下清空容器，退回原位渲染
    if (disabled) {
      setContainer(null);
      return;
    }

    const resolveTarget = () => {
      if (!to) return getPopupContainer?.() || document.body;
      if (to === "body" && getPopupContainer) return getPopupContainer() || document.body;
      if (typeof to === "string") {
        return document.querySelector<HTMLElement>(to);
      }
      return to;
    };

    if (defer) {
      // 利用 setTimeout 将目标选择延迟到 DOM 挂载完成后
      const timer = setTimeout(() => {
        setContainer(resolveTarget());
      }, 0);
      return () => clearTimeout(timer);
    } else {
      setContainer(resolveTarget());
    }
  }, [to, disabled, defer, getPopupContainer]);

  // 禁用状态：直接在组件原位渲染
  if (disabled) {
    return <>{children}</>;
  }

  // 找到目标 DOM：通过 Portal 传送至指定 DOM 树下
  if (container) {
    return createPortal(children, container);
  }

  // 未找到目标容器（或 SSR 阶段）：暂时不渲染
  return null;
};

export default Teleport;
