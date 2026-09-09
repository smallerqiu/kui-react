# Radio 单选框

单选框。

## 何时使用

- 用于在多个备选项中选中单个状态。
- 传说中的二选一。

## 代码演示

[单选](./demo/basic.tsx)

- 单独使用时，通过 `checked` 和 `onChange` 控制选中状态。

[单选组](./demo/group.tsx)

- 可以使用 options 属性来设置选项, 也可以使用子组件来设置选项。

[组合布局](./demo/vertical.tsx)

- 组合布局

[可不用 / 可控](./demo/disabled.tsx)

- 通过 `disabled` 设置不可用

[组合Button使用](./demo/radio-buttons.tsx)

- 结合 `RadioGroup`,`RadioButton` 可以组合使用

## Radio API

| 属性           | 说明                     | 类型                     | 默认值 |
| -------------- | ------------------------ | ------------------------ | ------ |
| checked        | 受控的选中状态           | boolean                  | -      |
| defaultChecked | 非受控模式的初始选中状态 | boolean                  | false  |
| label          | 文字提示                 | string                   | -      |
| value          | 组合使用时的值           | string \| number         | -      |
| disabled       | 是否禁用当前项           | boolean                  | false  |
| readOnly       | 是否只读当前项           | boolean                  | false  |
| onChange       | 在选项状态发生改变时回调 | (e: ChangeEvent) => void | -      |

`RadioButton` 额外支持 `icon`、`theme`、`size` 和 `shape`，在 `RadioGroup type="button"` 中使用。

滑块式分段选择请使用独立的 [Segmented](../segmented/index.md) 组件；`RadioGroup` 不再支持 `theme="card"`。

## RadioGroup API

| 属性         | 说明                                       | 类型                              | 默认值     |
| ------------ | ------------------------------------------ | --------------------------------- | ---------- |
| value        | 受控的当前选中值                           | string \| number                  | -          |
| defaultValue | 非受控模式的初始选中值                     | string \| number                  | -          |
| disabled     | 是否禁用整个单选组                         | boolean                           | false      |
| readOnly     | 是否只读                                   | boolean                           | false      |
| size         | 按钮尺寸                                   | SizeType                          | -          |
| direction    | 布局方向                                   | 'horizontal' \| 'vertical'        | horizontal |
| shape        | `button` 的形状                            | ShapeType                         | -          |
| theme        | `button` 的主题                            | ThemeType                         | -          |
| onChange     | 在选项状态发生改变时触发，返回当前选中的项 | (value: string \| number) => void | -          |
| options      | 可以指定子项 `radio`                       | RadioOption[]                     | -          |
| type         | 使用按钮样式的单选项                       | 'radio' \| 'button'               | radio      |
