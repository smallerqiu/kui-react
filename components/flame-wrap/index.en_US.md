# FlameWrap

Draws animated flames, sparks, smoke, and heat refraction around the outline of live content.

> This component is adapted from [Canvas UI FlameWrap](https://github.com/DavidHDev/canvas-ui/tree/main/src/lib/FlameWrap) by David Haz ([DavidHDev](https://github.com/DavidHDev)). The original project is licensed under MIT + Commons Clause.

## Browser support

Full burning and refraction rely on the experimental HTML-in-Canvas API. It can currently be tested in Chrome Canary 149+ with `chrome://flags/#canvas-draw-element` enabled. Production usage requires the HTML-in-Canvas Origin Trial. Other browsers keep the content visible and fall back to the outer WebGL flame effect.

## Examples

[Basic](./demo/basic.tsx?show=vertical)

- Wraps interactive content with the default cool flame.

[Custom flame](./demo/custom.tsx?show=vertical)

- Configures warm color, sparks, smoke, and animation speed.

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| children | Content wrapped by the flame | `ReactNode` | - |
| color | Flame RGB values in the 0–1 range | `[number, number, number]` | `[0.31, 0.54, 1]` |
| intensity | Overall brightness, recommended range 0–3 | `number` | `0.5` |
| height | Flame reach above the top edge in px | `number` | `170` |
| spread | Side and bottom glow reach in px | `number` | `8` |
| radius | Burning outline radius in px | `number` | `40` |
| speed | Overall animation speed multiplier | `number` | `0.25` |
| scale | Flame detail in the 0–1 range | `number` | `0.75` |
| turbulence | Turbulence amplitude in the 0–1 range | `number` | `0.5` |
| turbulenceScale | Turbulence frequency multiplier | `number` | `0.5` |
| turbulenceReach | Heat distortion reach from edges in px | `number` | `25` |
| sparks | Spark brightness; `0` disables sparks | `number` | `1.5` |
| sparkSize | Spark size multiplier | `number` | `0.35` |
| sparkDensity | Spark density multiplier | `number` | `1` |
| sparkSpeed | Spark rise and flicker speed | `number` | `1` |
| rim | Molten rim strength | `number` | `2.5` |
| melt | Distance flames eat into the outline in px | `number` | `4.5` |
| distortion | Edge heat-refraction strength in px | `number` | `10` |
| smoke | Smoke amount, recommended range 0–2 | `number` | `1.5` |
| ember | Burnt-edge ember brightness | `number` | `2` |
| scorch | Content-edge charring strength | `number` | `0` |
| className | Wrapper class name | `string` | - |
| style | Wrapper styles | `CSSProperties` | - |

FlameWrap respects `prefers-reduced-motion` and stops flame animation when reduced motion is requested.
