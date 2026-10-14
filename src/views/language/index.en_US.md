# Internationalization

KUI React provides locale configuration through React Context. Built-in component text is English by default; register another locale through the `locale` property of `ConfigProvider`:

```tsx
import { ConfigProvider } from "react-kui";
import zhCN from "react-kui/locale/zh-CN";

export default function App() {
  return <ConfigProvider locale={zhCN}>{/* application */}</ConfigProvider>;
}
```

## ConfigProvider API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| locale | Component library locale configuration | Locale \| null | null |
| getPopupContainer | Container the popups render into, defaults to `body` | () => HTMLElement \| null \| undefined | - |
| size | Default size for supported components; component props take precedence | SizeType | - |
| shape | Default shape for supported components; component props take precedence | ShapeType | - |
| theme | Default appearance for supported components; component props take precedence | ThemeType | - |

## Example

[Locale switching example](./demo.tsx?show=vertical)

Currently, KUI has the following languages built-in:

- Simplified Chinese (zh-CN)
- Traditional Chinese (zh-TW)
- German (de)
- Greek (el)
- English (en, default)
- French (fr)
- Italian (it)
- Japanese (ja)
- Korean (ko)
- Russian (ru)
- Thai (th)
- Ukrainian (uk)
- Vietnamese (vi)

We welcome code contributions to support more languages.[Join](https://github.com/smallerqiu/kui-react/tree/master/components/locale/lang)
