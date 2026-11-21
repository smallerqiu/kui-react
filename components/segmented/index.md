# Segmented 分段控制器

`value` 用于初始化组件，并同步后续的外部值变化。用户操作会更新内部值并触发 `onChange`，即使传入固定值或 `onChange` 仅用于监听也能交互。需要父子同步时使用 `value={state}` 配合 `onChange={setState}`。相同值的重新渲染不会重置内部编辑；数组值请使用新数组更新。

用于在一组互斥选项间快速切换。

## 代码演示

[基本用法](./demo/basic.tsx)

- 通过 `value` 和 `onChange` 控制当前选项。

[尺寸与布局](./demo/options.tsx)

- 支持尺寸、通栏、垂直布局和禁用选项。

[带图标的选项](./demo/icon.tsx)

- 通过 `options[].icon` 为选项添加图标。只传 `value` 和 `icon`、不设置 `label` 时仅显示图标，适合列表 / 网格布局切换；`value` 仍用于选中状态与变更回调，并作为纯图标选项的无障碍名称。需要图文并排时显式设置 `label`。

[自定义标签](./demo/label.tsx)

- 通过 `renderLabel` 自定义选项内容，并根据选中状态调整展示。

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 当前选中值 | `SegmentedValue` | - |
| options | 选项数据；直接传字符串或数字时，该值同时作为显示内容 | `SegmentedOptionInput[]` | [] |
| disabled | 是否禁用 | `boolean` | false |
| readOnly | 是否只读 | `boolean` | false |
| block | 是否撑满父容器 | `boolean` | false |
| direction | 排列方向 | `"horizontal" \| "vertical"` | horizontal |
| size | 尺寸 | `"small" \| "medium" \| "large"` | medium |
| shape | 形状 | `"round" \| "default" \| "square" \| "circle"` | round |
| onChange | 选中值改变时触发 | `((value: SegmentedValue) => void)` | - |
| renderLabel | 自定义选项内容 | `((option: SegmentedOption, selected: boolean) => React.ReactNode)` | - |

### SegmentedOption

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 选项内容 | ReactNode | - |
| value | 选项值 | string \| number | - |
| icon | 选项图标 | IconType[] | - |
| disabled | 是否禁用 | boolean | false |
