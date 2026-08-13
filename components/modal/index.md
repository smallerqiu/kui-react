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

| 属性         | 说明                                          | 类型                  | 默认值 |
| ------------ | --------------------------------------------- | --------------------- | ------ |
| open         | 受控的对话框显示状态                         | bool                  | -      |
| defaultOpen  | 非受控模式的初始显示状态                     | bool                  | false  |
| title        | 对话框标题                                    | string                | -      |
| width        | 对话框宽度                                    | number, string        | 520    |
| okText       | 确定按钮文字                                  | string                | 确定   |
| cancelText   | 取消按钮文字                                  | string                | 取消   |
| draggable    | 弹框是否可拖动, confirm 模式不可用            | bool                  | false  |
| centered     | 窗口是否可以居中 , confirm 模式不可用         | bool                  | false  |
| maximized    | 弹框是否可以最大化显示 , confirm 模式不可用   | bool                  | false  |
| maskClosable | 是否点击遮罩关闭弹窗                          | bool                  | false  |
| escKey       | 是否支持按 Esc 关闭                           | bool                  | true   |
| footer       | 当`footer=false`时不展示底部按钮              | bool,ReactNode             | true   |
| loading      | 为`true`时此时确定按钮为加载状态              | bool                  | false  |
| top          | 窗口距离顶部的距离                            | number                | 100    |
| showClose    | 是否展示关闭按钮                              | bool                  | true   |
| mask         | 是否展示蒙层                                  | bool                  | true   |
| onOk         | 点击确定的回调，`注意：不会关闭 Modal`        | () => void            | -      |
| onCancel     | 点击取消的回调                                | () => void            | -      |
| onClose      | 窗口关闭的回调                                | () => void            | -      |
| onOpenChange | 打开或者窗口关闭的回调                        | (opened:bool) => void | -      |

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

参数 options 为对象，具体说明如下：

| 属性       | 说明                                                                                                                       | 类型       | 默认值 |
| ---------- | -------------------------------------------------------------------------------------------------------------------------- | ---------- | ------ |
| title      | 对话框标题                                                                                                                 | string     | -      |
| content    | 对话框内容                                                                                                                 | string     | -      |
| okText     | 确定按钮文字                                                                                                               | string     | 确定   |
| cancelText | 取消按钮文字                                                                                                               | string     | 取消   |
| icon       | 弹框的图标，type 为 toast 可用 ，默认可选值为 success，warning, error, info, 也可以自定义，参照 [Icon](/components/icon)值 | string     | -      |
| color      | 弹框的图标的颜色，type 为 toast 可用                                                                                       | string     | -      |
| onOk       | 点击确定的回调                                                                                                             | () => void | -      |
| onCancel   | 点击取消的回调                                                                                                             | () => void | -      |
