# Switch 开关

开关选择器。

## 何时使用

- 需要表示开关状态/两种状态之间的切换时；
- 和 checkbox的区别是，切换 switch 会直接触发状态改变，而 checkbox 一般用于状态标记，需要和提交操作配合。

## 代码演示

[基本用法](./demo/basic.tsx)

- 使用 `checked` 和 `onChange` 控制开关状态

[文字 / 图标](./demo/with-text.tsx)

- 通过 `trueText` 和 `falseText` 设置选中和未选中时的文字，也可以通过 `checkedChildren` 和 `unCheckedChildren` 传入自定义 ReactNode。

[禁用 / 可控](./demo/disabled.tsx)

- 通过 `disabled` 属性设置组件是否被禁用

[两种大小](./demo/size.tsx)

- size="small" 表示小号开关。

[加载中](./demo/loading.tsx)

- 标识开关操作仍在执行中。

### API

| 属性               | 说明                                                      | 类型                     | 默认值 |
| ------------------ | --------------------------------------------------------- | ------------------------ | ------ |
| checked            | 受控的开关状态                                             | boolean                     | -      |
| defaultChecked     | 非受控模式的初始开关状态                                   | boolean                     | false  |
| disabled           | 禁用开关                                                  | boolean                     | false  |
| loading            | 加载状态，加载时不可操作                                  | boolean                  | false  |
| type               | 主题颜色 可传入 `success`，`warning`，`danger`，`primary` | string                   | -      |
| size               | 组件尺寸，值为`small`展示小尺寸                           | string                   | -      |
| checkedChildren    | 选中时的自定义内容                                 | ReactNode                     | -      |
| unCheckedChildren  | 未选中时的自定义内容                               | ReactNode                     | -      |
| trueText           | 当 `checked` 为 `true` 时显示的文字                       | string                   | -      |
| falseText          | 当 `checked` 为 `false` 时显示的文字                      | string                   | -      |
| valueType          | 单位选项的输出值的类型                                    | [string,number,boolean]     | boolean   |
| onChange           | 当 `checked` 改变时触发，回调                             | (value: boolean) => void | -      |
