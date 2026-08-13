# Card 卡片

通用卡片容器

## 何时使用

最基础的卡片容器，可承载文字、列表、图片、段落，常用于后台概览页面。

## 代码演示

[基本用法](./demo/basic.tsx)

- 通过 `title` 和 `icon` 可设置标题和图标

[边框](./demo/border.tsx)

- `bordered` 可以设置是否显示边框

[边框和标题](./demo/notitle.tsx)

- 通过 `bordered` 属性控制边框，通过 `title` 属性控制标题。

[封面卡片](./demo/cover.tsx)

- 使用 `cover` 和 `CardMeta` 展示带封面的内容卡片。

| 属性     | 说明             | 类型         | 默认值 |
| -------- | ---------------- | ------------ | ------ |
| title    | 卡片的标题       | ReactNode    | -      |
| icon     | 卡片标题的图标   | IconType[]   | -      |
| bordered | 卡片是否显示边框 | bool         | false  |
| extra    | 卡片标题扩展     | ReactNode    | -      |
| cover    | 卡片封面         | string,ReactNode | -   |

### CardMeta

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| avatar | 头像 | string,ReactNode | - |
| title | 标题 | ReactNode | - |
| description | 描述 | ReactNode | - |
