# ColorPicker 颜色选择器

`value` 用于初始化组件，并同步后续的外部值变化。用户操作会更新内部值并触发 `onChange`，即使传入固定值或 `onChange` 仅用于监听也能交互。需要父子同步时使用 `value={state}` 配合 `onChange={setState}`。相同值的重新渲染不会重置内部编辑；数组值请使用新数组更新。

可以自由的输出颜色。

## 何时使用

- 需要自定义颜色时

## 代码演示

[基本用法](./demo/basic.tsx)

- 点击打开颜色面板

[尺寸大小 / 不可用](./demo/size.tsx)

- `small` 为小尺寸， `large` 为大尺寸

[主题与形状](./demo/appearance.tsx)

- 支持 `outline`、`fill`、`plain` 主题，以及 `round`、`circle`、`square` 形状

[自定义触发器](./demo/custom-trigger.tsx)

- 自定义颜色面板的触发器。

[弹出位置](./demo/placement.tsx)

- 支持 6 个弹出位置 , 如果上面的空间不够，色盘会自动在下面展示

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 颜色值 | `string` | - |
| open | 弹层显示状态 | `boolean` | - |
| mode | 颜色展示类型，支持 `hex`、`rgb`、`hsl` | `"hex" \| "rgb" \| "hsl"` | `hex` |
| presets | 自定义颜色盘 | `string[]` | 内置色盘 |
| disabledAlpha | 是否禁用透明度 | `boolean` | `false` |
| disabled | 是否禁用 | `boolean` | `false` |
| readOnly | 是否只读 | `boolean` | `false` |
| trigger | 弹层触发方式 | `"hover" \| "click"` | `click` |
| showText | 是否展示颜色文字 | `boolean` | `false` |
| size | 颜色选择器尺寸 | `"small" \| "medium" \| "large"` | - |
| theme | 外观主题，支持 `outline`、`fill`、`plain`，未设置时可继承 Form 或 ConfigProvider | `"dashed" \| "solid" \| "default" \| "fill" \| "outline" \| "plain" \| "underlined"` | `outline` |
| shape | 形状，支持 `round`、`circle`、`square`，未设置时可继承 Form 或 ConfigProvider | `"round" \| "default" \| "square" \| "circle"` | - |
| placement | 弹层位置 | `"top" \| "top-left" \| "top-right" \| "bottom" \| "bottom-left" \| "bottom-right"` | `bottom-left` |
| children | 自定义触发元素 | `ReactNode` | - |
| panelOnly | 只渲染颜色面板，不包含触发元素与弹层 | `boolean` | false |
| onUpdateMode | 颜色模式更新时触发 | `((mode: ColorMode) => void)` | - |
| onChange | 颜色值改变时触发 | `((color: string) => void)` | - |
| onOpenChange | 颜色选择器展开或收起时触发 | `((open: boolean) => void)` | - |
