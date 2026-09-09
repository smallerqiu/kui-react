# Segmented 分段控制器

用于在一组互斥选项间快速切换。

## 代码演示

[基本用法](./demo/basic.tsx)

- 通过 `value` 和 `onChange` 控制当前选项。

[尺寸与布局](./demo/options.tsx)

- 支持尺寸、通栏、垂直布局和禁用选项。

[带图标的选项](./demo/icon.tsx)

- 通过 `options[].icon` 为选项添加图标。

[自定义标签](./demo/label.tsx)

- 通过 `renderLabel` 自定义选项内容，并根据选中状态调整展示。

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 当前选中值 | string \| number | - |
| defaultValue | 默认选中值 | string \| number | - |
| options | 选项数据 | SegmentedOption[] | [] |
| disabled | 是否禁用 | boolean | false |
| readOnly | 是否只读 | boolean | false |
| block | 是否撑满父容器 | boolean | false |
| direction | 排列方向 | `horizontal \| vertical` | horizontal |
| size | 尺寸 | SizeType | medium |
| shape | 形状 | ShapeType | round |
| onChange | 选中值改变时触发 | `(value: string \| number) => void` | - |
| renderLabel | 自定义选项内容 | `(option, selected) => ReactNode` | - |

### SegmentedOption

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 选项内容 | ReactNode | - |
| value | 选项值 | string \| number | - |
| icon | 选项图标 | IconType[] | - |
| disabled | 是否禁用 | boolean | false |
