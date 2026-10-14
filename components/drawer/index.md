# Drawer 抽屉

屏幕边缘滑出的浮层面板。

## 何时使用

- 抽屉从父窗体边缘滑入，覆盖住部分父窗体内容。用户在抽屉内操作时不必离开当前任务，操作完成后，可以平滑地回到到原任务。
- 当需要一个附加的面板来控制父窗体内容，这个面板在需要时呼出。比如，控制界面展示样式，往界面中添加内容。
- 当需要在当前任务流中插入临时任务，创建或预览附加内容。比如展示协议条款，创建子对象。

## 代码演示

[基本用法](./demo/basic.tsx)

- 通过 `open` 和 `onOpenChange` 控制 `Drawer` 是否展示，`title` 为 null 或 false 时不显示标题

[自定义](./demo/custom.tsx)

- 通过 `title` 来设置标题， `width` 控制宽度， 还有 `placement` 控制方向

[表单模式](./demo/with-form.tsx)

- 内容将呈现表单模式，有页头和页尾, 可自定义页尾

[植入目标元素](./demo/target.tsx)

- 可以在目标元素内展开

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| open | 抽屉显示状态 | `boolean` | - |
| escKey | 是否支持按 Esc 关闭 | `boolean` | true |
| destroyOnClose | 关闭后是否销毁抽屉内容。默认销毁（重开时重新挂载）；设为 false 可保留抽屉内已填写的表单状态，代价是打开过的抽屉留一份隐藏 DOM | `boolean` | true |
| maskClosable | 是否点击遮罩关闭抽屉（只管遮罩，Esc 由 `escKey` 控制） | `boolean` | true |
| title | 抽屉标题，不写就没有标题文本（不再有默认标题）；标题栏仍留给右上角关闭按钮，`closable: false` 且没有标题才整条不收 | `React.ReactNode` | - |
| width | 抽屉宽度 `placement`为 `left` 或 `right` 时使用,支持百分比 | `string \| number` | 520 |
| height | 抽屉高度 `placement`为 `top` 或 `bottom` 时使用,支持百分比 | `string \| number` | 520 |
| placement | 抽屉显示方向，提供 `left` , `top` , `right` , `bottom` 4种展示方式 | `"top" \| "bottom" \| "left" \| "right"` | right |
| footer | 页脚内容，不显示页脚设置`footer=null`即可 | `React.ReactNode` | true |
| closable | 是否显示关闭按钮 | `boolean` | true |
| target | 展示的父元素，支持元素、Ref 或获取元素的函数 | `DrawerTarget` | () => document.body |
| okText | 确定按钮文字 | `string` | 确定 |
| cancelText | 取消按钮文字 | `string` | 取消 |
| mask | 是否展示蒙层 | `boolean` | true |
| loading | 为`true`时此时确定按钮为加载状态 | `boolean` | false |
| onOk | 点击确定的回调 | `(() => void)` | - |
| onCancel | 点击取消的回调 | `(() => void)` | - |
| onClose | 抽屉关闭的回调 | `(() => void)` | - |
| onOpenChange | 打开或抽屉关闭的回调 | `((opened: boolean) => void)` | - |

### onCancel 与 onClose 的分工

关闭这个动作分成两条互不重叠的通道，挂了其中一个，另一个不会跟着响：

- 底部「取消」按钮：只触发 `onCancel`，抽屉照样收起，但不走 `onClose`。
- 点遮罩、按 Esc、点右上角关闭按钮：只触发 `onClose`。

想在任何关闭方式下都收到通知，就两个回调都挂；要区分「用户明确取消」和「其他方式关闭」，各挂各的。
`onOk` 不负责关闭，它只挂在确定按钮上，需要关抽屉请自己在回调里收。
同步开合状态请只挂 `onOpenChange`：取消、遮罩、Esc、右上角这四种关法都会发一次 `onOpenChange(false)`，`onCancel` / `onClose` 只告诉你这次是哪条通道关的，不承担状态同步。所以受控写法是 `open={open}` 配 `onOpenChange={setOpen}`，而不是在 `onCancel` 和 `onClose` 里各 `setOpen(false)` 一次。
四处（Modal / Drawer × React / Vue）统一的顺序：先 `onOpenChange(false)` 把开合状态结掉，再 `onCancel` / `onClose` 说这次是哪条通道关的。所以在 `onCancel`、`onClose` 里读到的开合值已经是结算后的，不用自己在回调里再补一次 `setOpen(false)`。
