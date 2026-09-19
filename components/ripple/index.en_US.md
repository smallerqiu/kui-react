# Ripple

Adds WebGL-rendered water ripples and refraction over live DOM content.

> This component is adapted from [Canvas UI Ripple](https://github.com/DavidHDev/canvas-ui/tree/main/src/lib/Ripple) by David Haz ([DavidHDev](https://github.com/DavidHDev)). The original project is licensed under MIT + Commons Clause.

## Browser support

Full content refraction relies on the experimental HTML-in-Canvas API. It can currently be tested in Chrome Canary 149+ with `chrome://flags/#canvas-draw-element` enabled. Production usage requires the HTML-in-Canvas Origin Trial. Other browsers automatically fall back to a WebGL ripple overlay while keeping the content visible and interactive.

## Examples

[Basic](./demo/basic.tsx?show=vertical)

- Click anywhere in the content area to create a ripple.

[Custom effect](./demo/options.tsx?show=vertical)

- Uses hover triggering with customized wave parameters.

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| children | Content wrapped by the effect | `ReactNode` | - |
| trigger | Ripple trigger | `'click' \| 'hover' \| 'none'` | `'click'` |
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
