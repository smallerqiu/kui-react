# Modal 对话框

模态对话框。

## 何时使用

- 需要用户处理事务，又不希望跳转页面以致打断工作流程时，可以使用 Modal 在当前页面正中打开一个浮层，承载相应的操作。
- 另外当需要一个简洁的确认框询问用户时，可以使用 Modal.confirm() 等语法糖方法。

## 代码演示

[基本用法](./demo/basic.tsx)

- 使用 `open` 和 `onOpenChange` 控制显示状态

[自定义](./demo/custom.tsx)

- 自定义 `Modal`

[其它属性](./demo/more.tsx)

- 不需要页脚时，可以把 `footer` 为`null`

[全局模式](./demo/global.tsx)

- 使用 全局模式

[提示框](./demo/confirm.tsx)

- 全局的确认提示框，可以异步关闭

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| open | 对话框显示状态 | `boolean` | - |
| title | 对话框标题，字符串之外可给任意节点；不给就不渲染标题栏（不会留一条空的横边框） | `React.ReactNode` | - |
| width | 对话框宽度 | `string \| number` | 520 |
| okText | 确定按钮文字 | `string` | 确定 |
| cancelText | 取消按钮文字 | `string` | 取消 |
| draggable | 弹框是否可拖动, confirm 模式不可用 | `boolean` | false |
| centered | 窗口是否可以居中 , confirm 模式不可用 | `boolean` | false |
| maximized | 弹框是否可以最大化显示 , confirm 模式不可用 | `boolean` | false |
| maskClosable | 是否点击遮罩关闭弹窗（只管遮罩，Esc 由 `escKey` 控制） | `boolean` | false |
| escKey | 是否支持按 Esc 关闭 | `boolean` | true |
| panelOnly | 只渲染弹窗面板本身，不包含遮罩、动画与全局事件 | `boolean` | false |
| destroyOnClose | 关闭后是否销毁窗口内容。默认销毁（重开时重新挂载）；设为 false 可保留窗口内已填写的表单状态，代价是打开过的窗口留一份隐藏 DOM | `boolean` | true |
| footer | 当`footer=false`时不展示底部按钮，给节点时用它替换整个底部 | `React.ReactNode` | true |
| loading | 为`true`时此时确定按钮为加载状态 | `boolean` | false |
| top | 窗口距离顶部的距离 | `number` | 100 |
| showClose | 是否展示关闭按钮 | `boolean` | true |
| mask | 是否展示蒙层 | `boolean` | true |
| onOk | 点击确定的回调，`注意：不会关闭 Modal` | `(() => void)` | - |
| onCancel | 点击取消的回调 | `(() => void)` | - |
| onClose | 窗口关闭的回调 | `(() => void)` | - |
| onAfterClose | 关闭动画结束后的回调 | `(() => void)` | - |
| onOpenChange | 打开或者窗口关闭的回调 | `((opened: boolean) => void)` | - |

### onCancel 与 onClose 的分工

关闭这个动作分成两条互不重叠的通道，挂了其中一个，另一个不会跟着响：

- 底部「取消」按钮：只触发 `onCancel`，窗口照样收起，但不走 `onClose`。
- 点遮罩、按 Esc、点右上角关闭按钮：只触发 `onClose`。

想在任何关闭方式下都收到通知，就两个回调都挂；要区分「用户明确取消」和「其他方式关闭」，各挂各的。
`onOk` 不负责关闭，它只挂在确定按钮上，需要关窗请自己在回调里收。
同步开合状态请只挂 `onOpenChange`：取消、遮罩、Esc、右上角这四种关法都会发一次 `onOpenChange(false)`，`onCancel` / `onClose` 只告诉你这次是哪条通道关的，不承担状态同步。所以受控写法是 `open={open}` 配 `onOpenChange={setOpen}`，而不是在 `onCancel` 和 `onClose` 里各 `setOpen(false)` 一次。
四处（Modal / Drawer × React / Vue）统一的顺序：先 `onOpenChange(false)` 把开合状态结掉，再 `onCancel` / `onClose` 说这次是哪条通道关的。所以在 `onCancel`、`onClose` 里读到的开合值已经是结算后的，不用自己在回调里再补一次 `setOpen(false)`。

## Modal.method()

组件提供了一些静态方法，使用方式如下

- modal.info(options)
- modal.success(options)
- modal.warning(options)
- modal.error(options)
- modal.confirm(options)

另外提供了全局配置和全局销毁的方法：

- modal.show(options)
- modal.destroyAll()

命令式 Modal 挂载在全局 `body` 下，不属于当前页面组件的生命周期。如果希望切换路由时自动关闭，可以监听路由位置变化并统一销毁：

```tsx
const location = useLocation();

useEffect(() => () => modal.destroyAll(), [location.pathname]);
```

参数 options 为对象，具体说明如下：

| 属性       | 说明                                                                                                                       | 类型       | 默认值 |
| ---------- | -------------------------------------------------------------------------------------------------------------------------- | ---------- | ------ |
| title      | 对话框标题，字符串之外可给任意节点                                                                                          | React.ReactNode | -      |
| content    | 对话框内容，字符串之外可给任意节点                                                                                          | React.ReactNode | -      |
| okText     | 确定按钮文字                                                                                                               | string     | 确定   |
| cancelText | 取消按钮文字                                                                                                               | string     | 取消   |
| icon       | 弹框的图标，type 为 toast 可用 ，默认可选值为 success，warning, error, info, 也可以自定义，参照 [Icon](/components/icon)值 | string     | -      |
| color      | 弹框的图标的颜色，type 为 toast 可用                                                                                       | string     | -      |
| type       | `modal.show` 的弹框类型，可选 `info`、`success`、`warning`、`error`、`confirm`                                             | ToastType  | info   |
| onOk       | 点击确定的回调；返回 Promise 时关闭时机交给组件：resolve 后关窗，reject 只停 loading 并保持窗口打开                       | () => void \| PromiseLike | -      |
| onCancel   | 点击取消的回调                                                                                                             | () => void | -      |
