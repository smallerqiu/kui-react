# Ripple

Adds WebGL-rendered water ripples and refraction over live DOM content.


## Browser support

Full content refraction relies on the experimental HTML-in-Canvas API. It can currently be tested in Chrome Canary 149+ with `chrome://flags/#canvas-draw-element` enabled. Production usage requires the HTML-in-Canvas Origin Trial. The API has changed shape between versions: from Chrome 155, drawing the content into the canvas no longer keeps it clickable unless the element geometry is registered as well, while earlier Chromium and Edge only need the matrix returned by the draw call; from Chrome 156 the `layoutsubtree` attribute becomes `content="drawable"`, the drawn element declares itself with `drawable`, and the 2D draw returns no matrix because the browser synchronizes the position itself. The component branches on the attributes and methods the browser actually exposes, so content and interaction work under all three experimental shapes. Without the API it falls back to a WebGL ripple overlay that brightens each crest and darkens each trough, which stays visible over light and dark pages alike while keeping the content visible and interactive.

## Examples

[Basic](./demo/basic.tsx?show=vertical)

- Click anywhere in the content area to create a ripple.

[Custom effect](./demo/options.tsx?show=vertical)

- Uses hover triggering with customized wave parameters.

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| children | Content wrapped by the effect | `ReactNode` | - |
| trigger | Ripple trigger | `"none" \| "hover" \| "click"` | `'click'` |
| amplitude | Wave height, recommended range 0–3 | `number` | `0.5` |
| speed | Wave propagation speed multiplier | `number` | `0.65` |
| wavelength | Distance between wave crests in px | `number` | `80` |
| rings | Crests in each wave train, recommended range 1–8 | `number` | `2` |
| decay | Energy decay rate; higher values fade faster | `number` | `1` |
| refraction | Content refraction strength in px | `number` | `100` |
| dispersion | Chromatic dispersion, recommended range 0–1 | `number` | `0.5` |
| shine | Crest highlight intensity, recommended range 0–2 | `number` | `0.5` |
| interval | Seconds between ambient ripples; `0` disables them | `number` | `0` |
| className | Wrapper class name | `string` | - |
| style | Wrapper styles | `CSSProperties` | - |

Ripple respects `prefers-reduced-motion` and disables wave animation when reduced motion is requested.
