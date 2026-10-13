// App context management for React
import type { ConfigContextValue } from "./config-context";

let __mousePoint: Point | null = null;
interface Point {
  x: number;
  y: number;
}

export const recordMousePoint = () => {
  if (typeof window !== "undefined") {
    document.addEventListener("mousedown", (e) => {
      __mousePoint = { x: e.clientX, y: e.clientY };
    });
  }
};

export const getMousePoint = () => {
  return __mousePoint || { x: 0, y: 0 };
};

/**
 * 命令式 API（modal.info(...) 这类）是 createRoot 挂出去的独立 React 树，够不着 ConfigProvider，
 * 于是最外层 ConfigProvider 把自己的配置登记到这里，命令式弹窗渲染时再取一次。
 * Vue 侧做的是同一件事，那边用的是 appContext 栈（见 kui-vue/components/config/context.ts）。
 * 用栈而不是单个变量：页面上可能有两个互不相干的根，后挂载的那个才是命令式 API 默认服务的对象。
 */
const configs: ConfigContextValue[] = [];
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((listener) => listener());

export const pushConfig = (config: ConfigContextValue) => {
  configs.push(config);
  notify();
  return () => {
    const index = configs.lastIndexOf(config);
    if (index >= 0) configs.splice(index, 1);
    notify();
  };
};

/** 当前该给命令式弹窗用的配置；页面上没有 ConfigProvider 时返回 null。 */
export const currentConfig = () => configs.at(-1) ?? null;

/** 配置换了要通知活着的命令式弹窗重渲染，否则它们会停在打开那一刻的语言/尺寸上。 */
export const subscribeConfig = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
