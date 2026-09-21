# Theme Customization

KUI uses CSS Variables as the public theme interface, allowing you to modify colors, border radius, density, font size, and component surfaces at runtime without recompiling the component library.

## Style Imports

The default entry includes theme variables, base styles, and all component styles:

```ts
import "react-kui/style/index.css";
```

To control which global base styles are included, import the styles separately:

```ts
import "react-kui/style/theme.css";
import "react-kui/style/components.css";
// Optional: global base styles for links, placeholders, and text selection
import "react-kui/style/base.css";
```

## Brand Theme

The primary color’s hover, active, outline, and semi-transparent variants are automatically derived from `--kui-color-primary`:

```css
:root {
  --kui-color-primary: #6d5dfc;
  --kui-border-radius: 8px;
  --kui-border-radius-card: 14px;
}
```

## Density and Typography

```css
:root {
  --kui-control-height-sm: 26px;
  --kui-control-height: 36px;
  --kui-control-height-lg: 44px;
  --kui-font-size-sm: 12px;
  --kui-font-size: 14px;
  --kui-font-size-lg: 16px;
  --kui-spacing-4: 18px;
}
```

## Component-level Customization

Component tokens fall back to semantic tokens, so you can customize the overall theme or individual component types:

```css
:root {
  --kui-control-bg: #fff;
  --kui-control-border: #d8dbe2;
  --kui-control-radius: 10px;
  --kui-card-bg: #fff;
  --kui-card-radius: 16px;
  --kui-card-padding: 20px;
  --kui-popup-bg: #fff;
  --kui-popup-shadow: 0 12px 36px rgb(0 0 0 / 12%);
}
```

## Appearance and Shape

Common controls use three shapes: `round`, `circle`, and `square`. When `shape` is omitted, it defaults to `round`; the legacy `default` value is still supported. The base appearance variants for `theme` are `default`, `fill`, `outline`, and `plain`, where `plain` is equivalent to `bordered=false` for input-like components.

If you need to switch the entire interface (including popup containers) to square, you can set `shape-mode="square"` on the root node. This uniformly overrides the border-radius tokens for controls, cards, and popups; the component's own `shape` is still used for local overrides. Elements that are inherently circular, such as slider handles and status dots, remain circular.

```html
<html shape-mode="square">
```

```css
:root {
  --kui-shape-round: 6px;
  --kui-shape-circle: 9999px;
  --kui-shape-square: 2px;
  --kui-theme-fill-bg: rgb(53 58 65 / 10%);
}
```

`fill` uses a semi-transparent background to preserve visual layering inside containers such as Table and Card. The native input inside each control stays transparent to prevent the background color from being applied twice.

## Light and Dark Themes

Set `theme-mode` on the root node or a local container:

```html
<div theme-mode="dark">...</div>
```

Popups with trigger elements, such as Select, DatePicker, and Poptip, will automatically follow the nearest `theme-mode` even when rendered into `body` through a React portal. For independent overlays without trigger elements, such as Modal, or when you need to inherit local custom tokens, you can specify the popup container via `ConfigProvider`:

```tsx
const themeRoot = useRef<HTMLDivElement>(null);

return (
  <div ref={themeRoot} theme-mode="dark">
    <ConfigProvider getPopupContainer={() => themeRoot.current}>
      <Select options={options} />
    </ConfigProvider>
  </div>
);
```

## Main Token Categories

- Brand and status: `--kui-color-primary`, `success`, `warning`, `danger`
- Text: `--kui-color-text`, `text-title`, `text-description`, `text-placeholder`
- Background: `--kui-color-bg`, `bg-layout`, `bg-container`, `bg-component`, `bg-pop`
- Interactive items: `--kui-color-item-hover`, `item-active`, `item-selected`, `item-disabled`
- Components: `--kui-control-*`, `--kui-card-*`, `--kui-popup-*`
- Dimensions: `--kui-control-height-*`, `--kui-font-size-*`, `--kui-spacing-*`
- Motion: `--kui-motion-duration-*`, `--kui-motion-easing`

Derived tokens such as `--kui-control-bg`, `--kui-control-radius`, and `--kui-color-primary-hover` are optional overrides. Components resolve defaults where properties consume them, rather than freezing defaults on the root. Local base colors, radii, and nested light/dark themes therefore remain effective, while explicit component overrides continue to inherit.

When using optional tokens in custom CSS, provide a base-token fallback, for example `background: var(--kui-control-bg, var(--kui-color-bg))`. Prefer base tokens when reading default theme values.
