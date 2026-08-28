# 选择卡片 CheckCard

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
| checked | 受控选中状态 | boolean | - |
| defaultChecked | 初始选中状态 | boolean | false |
| value | 在 Group 中使用的选项值 | string \| number | - |
| title | 标题 | ReactNode | - |
| description | 描述 | ReactNode | - |
| symbol | 未选中图标 | IconType[] | - |
| checkedSymbol | 选中图标 | IconType[] | - |
| showIndicator | 是否显示选中标记 | boolean | true |
| disabled | 是否禁用 | boolean | false |
| theme | 主题 | outline\|fill | outline |
| size | 尺寸 | small\|medium\|large | medium |
| shape | 形状 | round\|circle\|square | round |
| onChange | 状态变化回调 | (event: CheckCardChangeEvent) => void | - |

## CheckCardGroup API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 受控值 | string\|number | - |
| defaultValue | 初始值 | string\|number | - |
| options | 选项 | CheckCardOption[] | - |
| disabled | 是否禁用 | boolean | false |
| direction | 排列方向 | horizontal\|vertical | horizontal |
| theme | 卡片主题 | outline\|fill | outline |
| size | 卡片尺寸 | small\|medium\|large | medium |
| shape | 卡片形状 | round\|circle\|square | round |
| onChange | 选中值变化回调 | (value: string\|number) => void | - |

## CheckCardOption

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 选项值 | string\|number | - |
| title | 标题 | ReactNode | - |
| description | 描述 | ReactNode | - |
| symbol | 未选中图标 | IconType[] | - |
| checkedSymbol | 选中图标 | IconType[] | - |
| disabled | 是否禁用该选项 | boolean | false |