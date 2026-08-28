# 穿梭框 Transfer

用于在两个列表之间移动和管理数据。

## 代码演示

[基本用法](./demo/basic.tsx?show=vertical)

- 在可选列表和已选列表之间移动项目。

[搜索](./demo/search.tsx?show=vertical)

- 搜索两侧列表中的项目。

[自定义内容](./demo/custom.tsx?show=vertical)

- 自定义项目、筛选和底部内容。

[禁用状态](./demo/disabled.tsx?show=vertical)

- 展示整体禁用和单项禁用。

[事件](./demo/events.tsx?show=vertical)

- 监听移动和选择变化。

[分页](./demo/pagination.tsx?show=vertical)

- 为来源列表增加分页。

[主题](./demo/theme.tsx?show=vertical)

- 对比不同主题。

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| dataSource | 数据源 | TransferItem[] | [] |
| targetKeys | 受控目标项 | (string\|number)[] | [] |
| defaultTargetKeys | 初始目标项 | (string\|number)[] | [] |
| titles | 两侧标题 | [ReactNode, ReactNode] | Source, Target |
| operations | 两侧操作文案 | [string, string] | Add, Remove |
| searchable | 是否可搜索 | boolean | false |
| disabled | 是否禁用 | boolean | false |
| theme | 主题 | ThemeType | outline |
| filterOption | 自定义筛选 | (keyword, item) => boolean | - |
| onChange | 移动回调 | (event) => void | - |
| onSelectChange | 选择变化回调 | (sourceKeys, targetKeys) => void | - |