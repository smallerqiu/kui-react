# Tooltip 文字提示

简单的文字提示气泡框。

## 何时使用

鼠标移入则显示提示，移出消失，气泡浮层不承载复杂文本和操作。

可用来代替系统默认的 `title` 提示，提供一个`按钮/文字/操作`的文案解释。

## 代码演示

[基本用法](./demo/basic.tsx)

- 最简单的用法，浮层的大小由内容区域决定。

[位置](./demo/placement.tsx)

- 通过 `placement`控制方向, 位置有十二个方向。

[多彩文字提示](./demo/color.tsx)

- 多种预设色彩的文字提示样式，用作不同场景使用。

## API

当显隐由业务状态管理（例如 Slider 拖动）时使用 trigger="manual"，鼠标移入/移出不再自动改变显隐；普通 Tooltip 仍默认使用 hover。

| 属性    | 说明                       | 类型                | 默认值 |
| ------- | -------------------------- | ------------------- | ------ |
| trigger | 自动悬停触发或手动控制显隐 | 'hover' \| 'manual' | hover  |

| 属性         | 说明                                                                                                                                                                       | 类型                    | 默认值 |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- | ------ |
| title        | 显示的标题                                                                                                                                                                 | ReactNode               | -      |
| color        | 背景颜色                                                                                                                                                                   | string                  | -      |
| placement    | 提示框出现的位置，可选值为`top`，`top-left`，`top-right`，`bottom`，`bottom-left`，`bottom-right`，`left`，`left-top`，`left-bottom`，`right`，`right-top`，`right-bottom` | string                  | top    |
| width        | 展示的宽度,默认为内容区域的大小                                                                                                                                            | string                  | -      |
| disabled     | 禁用状态                                                                                                                                                                   | boolean                 | false  |
| panelOnly    | 只渲染浮层本身，不包含触发元素、定位与动画                                                                                                                                 | boolean                 | false  |
| open         | 显示状态                                                                                                                                                                   | boolean                 | -      |
| show         | 已废弃，请使用 `open`                                                                                                                                                      | boolean                 | -      |
| onOpenChange | 显示状态变化时触发                                                                                                                                                         | (open: boolean) => void | -      |
| onShowChange | 已废弃，请使用 `onOpenChange`                                                                                                                                              | (show: boolean) => void | -      |
