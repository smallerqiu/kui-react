# Internationalization

KUI React provides locale configuration through React Context and uses Simplified Chinese by default. Pass a locale to `ConfigProvider` to switch languages:

```tsx
import { ConfigProvider } from "react-kui";
import en from "react-kui/components/locale/en";

export default function App() {
  return <ConfigProvider locale={en}>{/* application */}</ConfigProvider>;
}
```

## ConfigProvider API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| locale | Component library locale configuration | Locale \| null | null |

## Example

[Locale switching example](./demo.tsx?show=vertical)

Currently, KUI has the following languages built-in:

- Simplified Chinese (zh-CN)
- Traditional Chinese (zh-TW)
- German (de)
- Greek (el)
- English (en)
- French (fr)
- Italian (it)
- Japanese (ja)
- Korean (ko)
- Russian (ru)
- Thai (th)
- Ukrainian (uk)
- Vietnamese (vi)

We welcome code contributions to support more languages.[Join](https://github.com/smallerqiu/kui-react/tree/master/components/locale/lang)
