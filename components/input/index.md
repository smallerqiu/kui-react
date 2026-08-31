# Input 输入框

通过鼠标或键盘输入内容，是最基础的表单域的包装。

## 何时使用

- 需要用户输入表单域内容时。
- 提供组合型输入框，带搜索的输入框，还可以进行大小选择。

## 代码演示

[基本用法](./demo/basic.tsx)

- 使用 `value` 和 `onChange` 控制输入值

[主题](./demo/theme.tsx)

- 使用 `theme` 设定主题 ,`shape` 呈现圆角

[带图标](./demo/icon.tsx)

- 通过设置 `icon` 属性，可设置输入框图标，只对 `input` 有效。可以快速的实现 ，密码显示隐藏，搜索

[扩展, 前缀和后缀](./demo/suffix.tsx?show=vertical)

- suffix，prefix 扩展

[输入框组合](./demo/group.tsx?show=vertical)

- 使用 InputGroup 让组件之间紧凑连接且合并边框。默认 true

[尺寸](./demo/size.tsx)

- `large` 为大尺寸， `small` 为小尺寸

[事件](./demo/event.tsx)

- 本示例测试组件事件是否正常触发

[文本域](./demo/textarea.tsx)

- 通过设置 `rows` 来控制行数

## Input API

| 属性                | 说明                                       | 类型                    | 默认值 |
| ------------------- | ------------------------------------------ | ----------------------- | ------ |
| value               | 受控输入值                                 | string 、 number        | -      |
| defaultValue        | 非受控模式下的初始输入值                   | string、number          | ""     |
| size                | 按钮尺寸,可选值 `small`、`large`，默认不选 | string                  | -      |
| icon                | 输入框图标                                 | string                  | -      |
| suffix              | 扩展后缀                                   | string,ReactNode             | -      |
| prefix              | 扩展前缀                                   | string,ReactNode             | -      |
| theme               | 主题                                       | string                  | fill   |
| shape               | 输入框形状                                 | ShapeType               | -      |
| inputType           | 自定义样式类名前缀                         | string                  | input  |
| controls            | 输入框控制区域，供 InputNumber 等组件使用  | ReactNode               | -      |
| disabled            | 是否禁用                                   | boolean                 | false  |
| multiple            | 是否允许原生多值输入                       | boolean                 | false  |
| clearable           | 是否显示清除按钮                           | boolean                    | false  |
| visiblePasswordIcon | 是否显示切换按钮或者控制密码显隐           | boolean                    | true   |
| onSearch            | 搜索事件的回调                             | (value: string) => void | -      |
| onIconClick         | 图标点击事件的回调                         | (e: Event) => void      | -      |
| onClear             | 按下清除按钮的回调                         | () => void              | -      |
| onChange            | 输入框内容变化时的回调                     | (value: string) => void | -      |

## Input Group API

| 属性    | 说明                                           | 类型   | 默认值 |
| ------- | ---------------------------------------------- | ------ | ------ |
| block   | 是否继承父集宽度                               | boolean   | false  |
| compact | 是否使用紧促模式                               | boolean   | false  |
| size    | 子组件的间距,可选值 `small`、`large`，默认不选 | string | -      |

## TextArea API

| 属性         | 说明                                                        | 类型                          | 默认值 |
| ------------ | ----------------------------------------------------------- | ----------------------------- | ------ |
| value        | 受控输入值                                                  | string、number                | -      |
| defaultValue | 非受控模式下的初始输入值                                    | string、number                | ""     |
| size         | 尺寸，可选值 `small`、`large`，默认不选                     | string                        | -      |
| theme        | 主题                                                        | ThemeType                     | fill   |
| shape        | 形状                                                        | ShapeType                     | -      |
| rows         | 默认行数                                                    | number                        | 2      |
| disabled     | 是否禁用                                                    | boolean                       | false  |
| onChange     | 内容变化时的回调                                            | (value: string) => void       | -      |
