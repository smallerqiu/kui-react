# 动效 Motion

提供统一的基础动效能力，用于反馈元素的进入、退出和状态变化。

## 代码演示

[基础动效](./demo/basic.tsx?show=vertical)

- 点击 Replay 可以重新播放淡入、缩放和方向滑入动画。

## 使用方式

将动效类添加到元素即可。动画时长和缓动默认使用主题中的动效变量，也可以在元素上覆盖 `animation-duration` 和 `animation-timing-function`。

| Class | 说明 |
| --- | --- |
| `k-motion-fade-in` | 淡入 |
| `k-motion-scale-in` | 缩放进入 |
| `k-motion-scale-y-in` | 纵向展开 |
| `k-motion-rotate` | 持续旋转 |
| `k-motion-slide-in-from-left` | 从左侧进入 |
| `k-motion-slide-in-from-right` | 从右侧进入 |
| `k-motion-slide-in-from-top` | 从顶部进入 |
| `k-motion-slide-in-from-bottom` | 从底部进入 |