# 虚拟列表 VirtualList

只渲染视口附近的数据，用于优化大数据列表的渲染性能。

## 代码演示

[基本用法](./demo/basic.tsx?show=vertical)

- 渲染大量固定高度数据，并保留少量缓冲项。

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| data | 列表数据 | unknown[] | [] |
| height | 可视区域高度 | number\|string | 300 |
| itemHeight | 每一项的固定高度 | number | 32 |
| overscan | 视口上下额外渲染的项目数量 | number | 5 |
| itemKey | 唯一标识字段或获取唯一值方法 | string\|((item,index)=>string\|number) | - |
| onScroll | 滚动回调 | (event: UIEvent) => void | - |

## Methods

| 名称 | 说明 | 参数 |
| --- | --- | --- |
| scrollToIndex | 滚动到指定数据项 | (index, align?) |