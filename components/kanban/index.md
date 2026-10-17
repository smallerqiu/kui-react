# 看板 Kanban

用于按状态分栏展示任务，并支持拖拽移动。

## 代码演示

[基本用法](./demo/basic.tsx?show=vertical)

- 拖拽卡片在不同状态栏之间移动。

[自定义内容](./demo/custom.tsx?show=vertical)

- 自定义列标题、卡片、空状态和底部操作。

[自定义字段](./demo/fields.tsx?show=vertical)

- 使用 `rowKey` 和 `statusKey` 配置数据字段。

[主题](./demo/theme.tsx?show=vertical)

- 切换看板主题。

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| columns | 看板列 | `KanbanColumnData[]` | [] |
| data | 卡片数据 | `KanbanItemData[]` | [] |
| rowKey | 数据唯一标识字段 | `string` | id |
| statusKey | 状态字段 | `string` | status |
| draggable | 是否允许拖拽 | `boolean` | true |
| emptyText | 空列提示，默认使用全局语言配置 | `string` | - |
| minColumnWidth | 最小列宽 | `string \| number` | 250 |
| theme | 外观主题 | `"dashed" \| "solid" \| "fill" \| "outline" \| "plain" \| "underlined"` | `fill` |
| onMove | 卡片移动回调 | `((event: KanbanMoveEvent) => void)` | - |
| onItemClick | 卡片点击回调 | `((item: KanbanItemData, column: KanbanColumnData) => void)` | - |
| columnTitle | 自定义列标题渲染 | `((column: KanbanColumnData, items: KanbanItemData[]) => React.ReactNode)` | - |
| item | 自定义卡片渲染 | `((item: KanbanItemData, column: KanbanColumnData, index: number) => React.ReactNode)` | - |
| empty | 自定义空列渲染 | `((column: KanbanColumnData) => React.ReactNode)` | - |
| footer | 自定义列底部渲染 | `((column: KanbanColumnData, items: KanbanItemData[]) => React.ReactNode)` | - |

卡片获得焦点后，可以使用 `Alt + ←` 或 `Alt + →` 将其移动到相邻列。
## 主题

`theme` 支持 `fill`、`outline`、`plain`、`solid`、`dashed` 五种外观，不写 `theme` 时就是 `fill`；`underlined` 是给可输入的控件用的，看板会按 `fill` 呈现。

外观落在每一列上，不是整块看板：`fill` 给列铺一层浅底，`outline` 只描一条库的边框色，`plain` 既不铺底也不描边，`dashed` 把那一圈换成虚线。`solid` 用主色铺满整列，列标题、计数和列里的卡片一起反白，卡片上的键盘焦点环也跟着换成主色上的一层浅白。列头那颗状态点吃的是 `column.color`，属于数据不属于外观，五种外观都不改它。把卡片拖到某一列上方时的提示——一条主色描边加一层主色浅底——在五种外观下都看得见，`solid` 的列改用铺底的反白色来描这条边。
