# Popconfirm 气泡确认框

点击元素，弹出气泡式的确认框。

## 何时使用

目标元素的操作需要用户进一步的确认时，在目标元素附近弹出浮层提示，询问用户。

和 ‘confirm’ 弹出的全屏居中模态对话框相比，交互形式更轻量。

## 代码演示

[基本用法](./demo/basic.tsx)

- 最简单的用法。

[国际化](./demo/local.tsx)

- 使用 `okText` 和 `cancelText` 自定义按钮文字。

[位置](./demo/placement.tsx)

- 通过 `placement`控制方向, 位置有十二个方向。

## API

| 属性       | 说明                                                                                                                                                                       | 类型         | 默认值 |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | ------ |
| title      | 显示的标题                                                                                                                                                                 | ReactNode    | -      |
| placement  | 提示框出现的位置，可选值为`top`，`top-left`，`top-right`，`bottom`，`bottom-left`，`bottom-right`，`left`，`left-top`，`left-bottom`，`right`，`right-top`，`right-bottom` | string       | top    |
| width      | 展示的宽度,默认为内容区域的大小                                                                                                                                            | string       | -      |
| okText     | 确定按钮的文字，                                                                                                                                                           | string       | 确定   |
| open       | 受控的显示状态                                                                                                                                                             | boolean      | -      |
| panelOnly  | 只渲染浮层本身，不包含触发元素、定位与动画                                                                                                                                 | boolean      | false  |
| show       | 已废弃，请使用 `open`                                                                                                                                                      | boolean      | -      |
| defaultOpen | 非受控模式的初始显示状态                                                                                                                                                 | boolean      | false  |
| dark       | 是否展示暗色主题                                                                                                                                                           | boolean         | false  |
| cancelText | 取消按钮的文字，                                                                                                                                                           | string       | 取消   |
| onCancel   | 点击取消的回调，                                                                                                                                                           | () => void   | -      |
| onOk       | 点击确定的回调，                                                                                                                                                           | () => void   | -      |
| onOpenChange | 显示状态变化时触发                                                                                                                                                       | (open: boolean) => void | - |
| onShowChange | 已废弃，请使用 `onOpenChange`                                                                                                                                           | (show: boolean) => void | - |
