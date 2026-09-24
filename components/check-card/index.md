# 选择卡片 CheckCard

`value` 用于初始化组件，并同步后续的外部值变化。用户操作会更新内部值并触发 `onChange`，即使传入固定值或 `onChange` 仅用于监听也能交互。需要父子同步时使用 `value={state}` 配合 `onChange={setState}`。相同值的重新渲染不会重置内部编辑；数组值请使用新数组更新。

使用标题、描述和可选图标呈现更丰富的选择项。

## 何时使用

- 单独使用时表示一个可选中、可取消的布尔状态，例如同意协议。
- 使用 `CheckCardGroup` 在多个卡片中进行单选，例如选择账号或套餐类型。

## 代码演示

[独立选择](./demo/basic.tsx?show=vertical)

- 独立使用时支持选中和取消选中。

[单选组](./demo/group.tsx?show=vertical)

- 卡片组默认使用单选语义，并支持方向键切换。

[自定义 Symbol](./demo/custom.tsx?show=vertical)

- 使用 `symbol` 和 `checkedSymbol` 属性设置卡片图标。

[外观与禁用](./demo/appearance.tsx?show=vertical)

- 支持主题、尺寸、形状和禁用状态。

## CheckCard API

### CheckCard

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| checked | 选中状态 | `boolean` | - |
| value | 在 Group 中使用的选项值 | `import("./types").CheckCardValue` | - |
| title | 标题 | `React.ReactNode` | - |
| description | 描述 | `React.ReactNode` | - |
| symbol | 未选中图标 | `import("../icon").IconType[]` | - |
| checkedSymbol | 选中图标 | `import("../icon").IconType[]` | - |
| showIndicator | 是否显示选中标记 | `boolean` | true |
| disabled | 是否禁用 | `boolean` | false |
| readOnly | 是否只读 | `boolean` | false |
| theme | 主题 | `"fill" \| "outline"` | outline |
| size | 尺寸 | `"small" \| "medium" \| "large"` | medium |
| shape | 形状 | `"round" \| "default" \| "square" \| "circle"` | round |
| onChange | 状态变化回调 | `((event: import("./types").CheckCardChangeEvent) => void)` | - |

## CheckCardGroup API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 值 | `CheckCardValue` | - |
| options | 选项 | `import("./types").CheckCardOption[]` | - |
| disabled | 是否禁用 | `boolean` | false |
| readOnly | 是否只读 | `boolean` | false |
| direction | 排列方向 | `"horizontal" \| "vertical"` | horizontal |
| theme | 卡片主题 | `"fill" \| "outline"` | outline |
| size | 卡片尺寸 | `"small" \| "medium" \| "large"` | medium |
| shape | 卡片形状 | `"round" \| "default" \| "square" \| "circle"` | round |
| onChange | 选中值变化回调 | `((value: CheckCardValue) => void)` | - |

## CheckCardOption

| 属性          | 说明           | 类型             | 默认值 |
| ------------- | -------------- | ---------------- | ------ |
| value         | 选项值         | string \| number | -      |
| title         | 标题           | ReactNode        | -      |
| description   | 描述           | ReactNode        | -      |
| symbol        | 未选中图标     | IconType[]       | -      |
| checkedSymbol | 选中图标       | IconType[]       | -      |
| disabled      | 是否禁用该选项 | boolean          | false  |
| readOnly      | 是否只读该选项 | boolean          | false  |
