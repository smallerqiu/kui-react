# 多语言

KUI React 通过 React Context 提供多语言能力，默认使用简体中文。使用 `ConfigProvider` 的 `locale` 属性即可切换语言：

```tsx
import { ConfigProvider } from "react-kui";
import en from "react-kui/components/locale/en";

export default function App() {
  return <ConfigProvider locale={en}>{/* 应用内容 */}</ConfigProvider>;
}
```

## ConfigProvider API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| locale | 组件库语言配置 | Locale \| null | null |
| getPopupContainer | 弹层渲染的容器，默认渲染到 `body` | () => HTMLElement \| null \| undefined | - |

## 示例

[多语言切换示例](./demo.tsx?show=vertical)

目前 KUI 内置了以下语言：

- 简体中文(zh-CN)
- 繁体中文(zh-TW)
- 德语(de)
- 希腊语(el)
- 英语(en)
- 法语(fr)
- 意大利语(it)
- 日语(ja)
- 韩语(ko)
- 俄语(ru)
- 泰语(th)
- 乌克兰语(uk)
- 越南语(vi)

欢迎贡献代码，以支持更多语言。[Join](https://github.com/smallerqiu/kui-react/tree/master/components/locale/lang)
