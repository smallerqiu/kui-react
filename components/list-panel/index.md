# ListPanel 列表面板

为查询条件、结果摘要、列表内容和分页提供统一布局，可容纳 Table、Kanban 或卡片列表。

## 代码演示

[查询列表](./demo/basic.tsx?show=vertical)

- 使用 `filters` 和 `summary` 组织查询条件与结果数量。

[工具操作](./demo/actions.tsx?show=vertical)

- 使用 `actions` 放置重置、新建等列表级操作。

[分页与外观](./demo/footer.tsx?show=vertical)

- 使用 `footer` 放置分页，并通过 `size`、`shape` 和 `theme` 调整外观。

[批量操作](./demo/selection.tsx?show=vertical)

- 配合 Table 的勾选状态，在存在选中项时用 `selection` 替换普通查询栏。

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| summary | 摘要内容 | `ReactNode` | - |
| filters | 筛选区域 | `ReactNode` | - |
| actions | 操作区域 | `ReactNode` | - |
| selection | 批量操作栏 | `ReactNode \| ((count: number) => ReactNode)` | - |
| footer | 底部区域 | `ReactNode` | - |
| bordered | 是否显示边框 | `boolean` | true |
| theme | 外观主题 | `"dashed" \| "solid" \| "fill" \| "outline" \| "plain"` | outline |
| shape | 形状 | `"round" \| "default" \| "square" \| "circle"` | round |
| size | 尺寸 | `"small" \| "medium" \| "large"` | medium |
| selectedCount | 已选数量 | `number` | 0 |

## 主题

`theme` 支持 `outline`、`fill`、`plain`、`solid`、`dashed` 五种外观，不写 `theme` 时就是 `outline`；`underlined` 是给可输入的控件用的，列表面板会按 `outline` 呈现。

面板自己不另起一块底，这一档画在它身下那张卡片上，所以五种外观改的是整个面板的铺底与外框，`bordered={false}` 只去掉外框、不换档。`solid` 用主色铺满面板，面板里两处自己带颜色的内容跟着反白：结果摘要换成铺底上的浅色文字，批量操作栏那一格从灰底换成主色上的一层浅白。其余内容是你自己放进去的节点，跟着面板的字色走。
