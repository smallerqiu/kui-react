# InputNumber 数字输入框

`value` 用于初始化组件，并同步后续的外部值变化。用户操作会更新内部值并触发 `onChange`，即使传入固定值或 `onChange` 仅用于监听也能交互。需要父子同步时使用 `value={state}` 配合 `onChange={setState}`。相同值的重新渲染不会重置内部编辑；数组值请使用新数组更新。

通过鼠标或键盘，输入范围内的数值。

## 何时使用

当需要获取标准数值时。

## 代码演示

[基本用法](./demo/basic.tsx)

- 基本用法 ,使用 keyboard 属性可以控制键盘行为。

[高精度小数/格式化展示](./demo/format.tsx)

- 通过 formatter 格式化数字，以展示具有具体含义的数据，往往需要配合 parser 一起使用。

[扩展, 前缀和后缀](./demo/ffix.tsx)

- suffix，prefix 扩展

[尺寸](./demo/size.tsx)

- `large` 为大尺寸， `small` 为小尺寸

## InputNumber API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| min | 最小值 | `number` | -Infinity |
| max | 最大值 | `number` | Infinity |
| step | 每次改变步数，可以为小数 | `string \| number` | 1 |
| value | InputNumber 的值 | `string \| number` | - |
| formatter | 指定输入框展示值的格式 | `((value: string \| number) => string)` | - |
| parser | 指定从 formatter 里转换回数字的方式，和 formatter 搭配使用 | `((value: string) => string \| number)` | - |
| size | 输入框大小 | `"small" \| "medium" \| "large"` | - |
| disabled | 禁用 | `boolean` | false |
| readOnly | 是否只读 | `boolean` | false |
| placeholder | 输入提示 | `string` | - |
| icon | 输入框图标 | `IconType[]` | - |
| precision | 数值精度 | `number` | - |
| shape | 组件的外观 | `"round" \| "default" \| "square" \| "circle"` | - |
| suffix | 自定义后缀 | `React.ReactNode` | - |
| prefix | 前缀内容 | `React.ReactNode` | - |
| controls | 是否显示增减按钮 | `boolean` | true |
| keyboard | 是否允许通过上下方向键调整数值 | `boolean` | true |
| theme | 组件呈现主题 | `"dashed" \| "solid" \| "default" \| "fill" \| "outline" \| "plain" \| "underlined"` | fill |
| onChange | 变化回调，清空时返回 `undefined` | `((value: number \| undefined) => void)` | - |
