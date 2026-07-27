# 多语言

KUI React 通过 React Context 提供多语言能力，默认使用简体中文。使用 `ConfigProvider` 的 `locale` 属性即可切换语言：

```tsx
import ConfigProvider from "react-kui/components/config";
import en from "react-kui/components/locale/en";

export default function App() {
  return <ConfigProvider locale={en}>{/* 应用内容 */}</ConfigProvider>;
}
```

## 示例

[多语言切换示例](./demo.tsx?show=vertical)

内置简体中文、繁体中文、德语、希腊语、英语、法语、意大利语、日语、韩语、俄语、泰语、乌克兰语和越南语。
