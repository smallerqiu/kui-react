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

| 属性           | 说明                           | 类型                               | 默认值 |
| -------------- | ------------------------------ | ---------------------------------- | ------ |
| columns        | 看板列                         | KanbanColumnData[]                 | []     |
| data           | 卡片数据                       | KanbanItemData[]                   | []     |
| rowKey         | 数据唯一标识字段               | string                             | id     |
| statusKey      | 状态字段                       | string                             | status |
| draggable      | 是否允许拖拽                   | boolean                            | true   |
| emptyText      | 空列提示，默认使用全局语言配置 | string                             | -      |
| minColumnWidth | 最小列宽                       | number\|string                     | 250    |
| theme          | 主题                           | `fill \| outline`                  | fill   |
| onMove         | 卡片移动回调                   | (event) => void                    | -      |
| onItemClick    | 卡片点击回调                   | (item, column) => void             | -      |
| columnTitle    | 自定义列标题渲染               | (column, items) => ReactNode       | -      |
| item           | 自定义卡片渲染                 | (item, column, index) => ReactNode | -      |
| empty          | 自定义空列渲染                 | (column) => ReactNode              | -      |
| footer         | 自定义列底部渲染               | (column, items) => ReactNode       | -      |

卡片获得焦点后，可以使用 `Alt + ←` 或 `Alt + →` 将其移动到相邻列。
