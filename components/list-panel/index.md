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

| 属性          | 说明         | 类型                                      | 默认值  |
| ------------- | ------------ | ----------------------------------------- | ------- |
| summary       | 摘要内容     | ReactNode                                 | -       |
| filters       | 筛选区域     | ReactNode                                 | -       |
| actions       | 操作区域     | ReactNode                                 | -       |
| selection     | 批量操作栏   | ReactNode \| (count: number) => ReactNode | -       |
| footer        | 底部区域     | ReactNode                                 | -       |
| bordered      | 是否显示边框 | boolean                                   | false   |
| theme         | 主题         | ThemeType                                 | outline |
| shape         | 形状         | ShapeType                                 | round   |
| size          | 尺寸         | SizeType                                  | medium  |
| selectedCount | 已选数量     | number                                    | 0       |
