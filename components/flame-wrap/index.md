# FlameWrap 火焰包裹

在内容轮廓周围绘制动态火焰、火星、烟雾与热浪折射效果。

> 本组件基于 David Haz（[DavidHDev](https://github.com/DavidHDev)）的 [Canvas UI FlameWrap](https://github.com/DavidHDev/canvas-ui/tree/main/src/lib/FlameWrap) 改造，原项目采用 MIT + Commons Clause 许可。

## 浏览器支持

完整的内容燃烧和折射依赖实验性的 HTML-in-Canvas API。目前可在 Chrome Canary 149+ 开启 `chrome://flags/#canvas-draw-element` 后体验；生产环境需要参加 HTML-in-Canvas Origin Trial。不支持该 API 时会保留内容，并降级展示 WebGL 外围火焰。

## 代码演示

[基础用法](./demo/basic.tsx?show=vertical)

- 使用默认的冷色火焰包裹交互内容。

[自定义火焰](./demo/custom.tsx?show=vertical)

- 配置暖色火焰、火星、烟雾与动画速度。

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| children | 被火焰包裹的内容 | `ReactNode` | - |
| color | 火焰 RGB 颜色，每项范围 0–1 | `[number, number, number]` | `[0.31, 0.54, 1]` |
| intensity | 火焰整体亮度，建议范围 0–3 | `number` | `0.5` |
| height | 顶部火焰延伸高度，单位 px | `number` | `170` |
| spread | 两侧和底部光晕范围，单位 px | `number` | `8` |
| radius | 燃烧轮廓圆角，单位 px | `number` | `40` |
| speed | 整体动画速度倍率 | `number` | `0.25` |
| scale | 火焰细节，范围 0–1 | `number` | `0.75` |
| turbulence | 湍流振幅，范围 0–1 | `number` | `0.5` |
| turbulenceScale | 湍流频率倍率 | `number` | `0.5` |
| turbulenceReach | 热浪影响边缘的范围，单位 px | `number` | `25` |
| sparks | 火星亮度，`0` 表示关闭 | `number` | `1.5` |
| sparkSize | 火星大小倍率 | `number` | `0.35` |
| sparkDensity | 火星密度倍率 | `number` | `1` |
| sparkSpeed | 火星上升与闪烁速度 | `number` | `1` |
| rim | 贴近边缘的熔融光强度 | `number` | `2.5` |
| melt | 火焰侵入内容轮廓的距离，单位 px | `number` | `4.5` |
| distortion | 边缘热浪折射强度，单位 px | `number` | `10` |
| smoke | 烟雾量，建议范围 0–2 | `number` | `1.5` |
| ember | 燃烧边缘余烬亮度 | `number` | `2` |
| scorch | 内容边缘焦黑强度 | `number` | `0` |
| className | 外层容器类名 | `string` | - |
| style | 外层容器样式 | `CSSProperties` | - |

组件会响应 `prefers-reduced-motion`，用户开启减少动态效果后会停止火焰动画。
