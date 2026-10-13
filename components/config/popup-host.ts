import { createContext, useCallback, useContext, useEffect, useRef } from "react";

type PopupCloser = () => void;
type PopupRegistrar = (close: PopupCloser) => () => void;

/**
 * Modal / Drawer 用它给自己圈一个浮层作用域：挂在里面的 Popup（下拉、气泡、子菜单……）
 * 把关闭方法登记进来，宿主窗口关的时候一起关掉——否则窗口都没了，teleported 的下拉还悬在 body 上。
 * Vue 侧是同名 API 的 provide/inject 版（components/config/popup-host.ts）。
 */
export const PopupHostContext = createContext<PopupRegistrar | null>(null);

/** 宿主窗口（Modal / Drawer）用：拿到 register 传给 Provider，关窗时调 closeAll。 */
export function usePopupHostScope() {
  const closers = useRef(new Set<PopupCloser>());
  const register = useCallback<PopupRegistrar>((close) => {
    closers.current.add(close);
    return () => {
      closers.current.delete(close);
    };
  }, []);
  useEffect(() => {
    const set = closers.current;
    return () => set.clear();
  }, []);
  const closeAll = useCallback(() => {
    // 先复制再遍历：关子浮层会触发它们自己的注销，边遍历边删会漏掉后面的。
    [...closers.current].forEach((close) => close());
  }, []);
  return { register, closeAll };
}

/** 浮层用：把自己的关闭方法登记给最近的宿主窗口；外面没有宿主时什么都不做。 */
export function usePopupHost(close: PopupCloser) {
  const register = useContext(PopupHostContext);
  // 登记的闭包要一直调到最新那份关闭逻辑，所以用 ref 转发，不跟着渲染换身份。
  const closeRef = useRef(close);
  useEffect(() => {
    closeRef.current = close;
  });
  useEffect(() => {
    if (!register) return;
    return register(() => closeRef.current());
  }, [register]);
}
