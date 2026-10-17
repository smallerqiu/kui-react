# Radio 单选框

`value` 用于初始化组件，并同步后续的外部值变化。用户操作会更新内部值并触发 `onChange`，即使传入固定值或 `onChange` 仅用于监听也能交互。需要父子同步时使用 `value={state}` 配合 `onChange={setState}`。相同值的重新渲染不会重置内部编辑；数组值请使用新数组更新。

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

## 主题

`theme` 只有 `fill`（浅底填充圆点）和 `outline`（描边圆点）两种外观；不写 `theme` 时就是 `fill`，其余档位同样按 `fill` 呈现。`outline` 的描边跟随 `--kui-theme-outline-border`，未设置时依次退回 `--kui-control-border`、`--kui-color-border`。

单选框组会把自身的 `theme` 传给组内每一项；每一项自己写了 `theme` 或 `size`（按钮项还有 `shape`）时以自己的为准。`type="button"` 的按钮组只有 `fill` 一档改用分隔线拼接的布局，其余档位保持按钮自身相邻边框的排布。

## Radio API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| checked | 选中状态 | `boolean` | - |
| label | 文字提示 | `string` | - |
| value | 组合使用时的值 | `string \| number` | - |
| disabled | 是否禁用当前项 | `boolean` | false |
| readOnly | 是否只读当前项 | `boolean` | false |
| onChange | 在选项状态发生改变时回调 | `((e: ChangeEvent) => void)` | - |

`RadioButton` 额外支持 `icon`、`theme`、`size` 和 `shape`，在 `RadioGroup type="button"` 中使用。

滑块式分段选择请使用独立的 [Segmented](../segmented/index.md) 组件；`RadioGroup` 不再支持 `theme="card"`。

## RadioButton API

在 Radio 属性的基础上，RadioButton 还支持：

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| icon | 从 `kui-icons` 导入的图标定义 | `IconType[]` | - |
| theme | 按钮外观 | `"dashed" \| "solid" \| "fill" \| "outline" \| "plain"` | - |
| size | 按钮尺寸 | `"small" \| "medium" \| "large"` | - |
| shape | 按钮形状 | `"round" \| "default" \| "square" \| "circle"` | - |

## RadioGroup API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 的当前选中值 | `T` | - |
| disabled | 是否禁用整个单选组 | `boolean` | false |
| readOnly | 是否只读 | `boolean` | false |
| size | 按钮尺寸 | `"small" \| "medium" \| "large"` | - |
| direction | 布局方向 | `"inline" \| "horizontal" \| "vertical"` | horizontal |
| shape | `button` 的形状 | `"round" \| "default" \| "square" \| "circle"` | - |
| theme | `button` 的主题 | `"dashed" \| "solid" \| "fill" \| "outline" \| "plain"` | - |
| onChange | 在选项状态发生改变时触发，返回当前选中的项 | `((value: T) => void)` | - |
| options | 可以指定子项 `radio` | `RadioOption[]` | - |
| type | 使用按钮样式的单选项 | `"button" \| "radio"` | radio |
