# Transfer 穿梭框

在两个列表之间移动和选择数据。

## 代码演示

[基本用法](./demo/basic.tsx?show=vertical)

- 在可选列表和已选列表之间移动项目。

[搜索与操作文案](./demo/search.tsx?show=vertical)

- 可搜索列表内容，也可自定义操作按钮文案。

[主题](./demo/theme.tsx?show=vertical)

- 支持 `outline` 和 `fill` 两种主题，搜索框会与穿梭框保持一致。

[禁用状态](./demo/disabled.tsx?show=vertical)

- 可禁用单个数据项，也可禁用整个穿梭框。

[自定义内容](./demo/custom.tsx?show=vertical)

- 自定义项目、筛选和底部内容。

[事件](./demo/events.tsx?show=vertical)

- 监听选择和移动事件，实现受控反馈。

[分页加载](./demo/pagination.tsx?show=vertical)

- 在 Footer 中组合简洁分页，适合数据量较大的场景。

## API

| 属性              | 说明               | 类型                                 | 默认值         |
| ----------------- | ------------------ | ------------------------------------ | -------------- |
| dataSource        | 数据源             | TransferItem[]                       | []             |
| targetKeys        | 受控目标项         | (string\|number)[]                   | []             |
| defaultTargetKeys | 初始目标项         | (string\|number)[]                   | []             |
| titles            | 两侧标题           | [ReactNode, ReactNode]               | Source, Target |
| operations        | 向右、向左按钮文案 | [string, string]                     | ['', '']       |
| searchable        | 是否可搜索         | boolean                              | false          |
| disabled          | 是否禁用           | boolean                              | false          |
| theme             | 外观主题           | 'outline' \| 'fill'                  | outline        |
| filterOption      | 自定义筛选         | (keyword, item) => boolean           | -              |
| item              | 自定义列表项渲染   | (item) => ReactNode                  | -              |
| footer            | 自定义列表底部渲染 | (direction) => ReactNode             | -              |
| onChange          | 数据移动时触发     | (event: TransferChangeEvent) => void | -              |
| onSelectChange    | 选择变化回调       | (sourceKeys, targetKeys) => void     | -              |
| onSearch          | 搜索框内容变化回调 | (direction, value) => void           | -              |

### TransferItem

| 属性        | 说明         | 类型             | 默认值 |
| ----------- | ------------ | ---------------- | ------ |
| key         | 唯一标识     | string \| number | -      |
| title       | 标题         | string           | -      |
| description | 描述         | string           | -      |
| disabled    | 是否禁用此项 | boolean          | false  |
