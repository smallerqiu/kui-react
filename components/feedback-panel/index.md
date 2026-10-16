# 反馈面板 FeedbackPanel

集中展示操作结果、说明和后续动作。

[基础用法](./demo/basic.tsx?show=vertical)

- 反馈面板的基本用法说明

[状态类型](./demo/kinds.tsx?show=vertical)

- 演示不同的状态类型变体

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| kind | 状态类型 | `"positive" \| "negative" \| "caution" \| "neutral"` | neutral |
| heading | 标题 | `ReactNode` | - |
| description | 描述 | `ReactNode` | - |
| symbol | 自定义图标或内容 | `ReactNode \| IconType[]` | - |
| compact | 紧凑模式 | `boolean` | false |
| actions | 操作区域 | `ReactNode` | - |
| theme | 主题样式 | `"dashed" \| "solid" \| "fill" \| "outline" \| "plain" \| "underlined"` | outline |
| shape | 形状 | `"round" \| "default" \| "square" \| "circle"` | round |
| children | 详情内容 | ReactNode | - |

## 主题

`theme` 支持 `fill`、`outline`、`plain`、`solid`、`dashed` 五种外观，不写 `theme` 时就是 `outline`；`underlined` 是给可输入的控件用的，反馈面板会按 `outline` 呈现。

`solid` 用主色铺满整个面板，标题、描述、详情块和图标底片一起反白；左边那条状态色带报的是 `kind`，属于内容而不是外壳，五种外观都不会改掉它。
