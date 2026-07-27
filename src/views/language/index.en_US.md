# Internationalization

KUI React provides locale configuration through React Context and uses Simplified Chinese by default. Pass a locale to `ConfigProvider` to switch languages:

```tsx
import ConfigProvider from "react-kui/components/config";
import en from "react-kui/components/locale/en";

export default function App() {
  return <ConfigProvider locale={en}>{/* application */}</ConfigProvider>;
}
```

## Example

[Locale switching example](./demo.tsx?show=vertical)

Built-in locales include Simplified and Traditional Chinese, German, Greek, English, French, Italian, Japanese, Korean, Russian, Thai, Ukrainian, and Vietnamese.
