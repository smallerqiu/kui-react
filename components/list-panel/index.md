# 列表面板 ListPanel

用于组织筛选、摘要、列表内容和底部分页等区域。

## 代码演示

[基本用法](./demo/basic.tsx?show=vertical)

- 将筛选器和表格组合在统一面板中。

[操作区](./demo/actions.tsx?show=vertical)

- 在工具栏中放置筛选器和操作按钮。

[底部区域](./demo/footer.tsx?show=vertical)

- 在列表下方放置分页器。

[选择状态](./demo/selection.tsx?show=vertical)

- 选择列表项后显示批量操作区域。

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| summary | 摘要内容 | ReactNode | - |
| filters | 筛选区域 | ReactNode | - |
| actions | 操作区域 | ReactNode | - |
| selection | 选择状态区域 | ReactNode\|(count) => ReactNode | - |
| footer | 底部区域 | ReactNode | - |
| bordered | 是否显示边框 | boolean | false |
| theme | 主题 | ThemeType | outline |
| shape | 形状 | ShapeType | round |
| size | 尺寸 | SizeType | medium |
| selectedCount | 已选数量 | number | 0 |