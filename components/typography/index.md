# 排版 Typography

统一标题、正文和行内文字的语义与视觉样式。

## 代码演示

[基本排版](./demo/basic.tsx?show=vertical)

- 使用标题、正文和行内文本组织内容层级。

[标题层级](./demo/title.tsx?show=vertical)

- 使用 `tag` 展示 h1 至 h6 的标题层级。

[语义文本](./demo/type.tsx?show=vertical)

- 使用 `type` 表达不同语义。

[文本样式](./demo/style.tsx?show=vertical)

- 展示加粗、斜体、下划线、删除线、标记和行内代码。

[文本省略](./demo/ellipsis.tsx?show=vertical)

- 支持多行省略以及展开和折叠。

[复制与编辑](./demo/interactive.tsx?show=vertical)

- 文本支持复制和就地编辑。

## API

`Typography`、`TypographyText`、`TypographyParagraph` 和 `TypographyTitle` 共享以下属性。

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 受控文本 | string | - |
| defaultValue | 非受控初始文本 | string | - |
| tag | 渲染的 HTML 标签 | TypographyTag | span |
| type | 语义颜色 | TypographyType | - |
| strong | 加粗 | boolean | false |
| italic | 斜体 | boolean | false |
| underline | 下划线 | boolean | false |
| delete | 删除线 | boolean | false |
| mark | 标记样式 | boolean | false |
| code | 行内代码样式 | boolean | false |
| disabled | 禁用状态 | boolean | false |
| copyable | 允许复制 | boolean\|TypographyCopyableOptions | false |
| editable | 允许编辑 | boolean\|TypographyEditableOptions | false |
| ellipsis | 文本省略配置 | boolean\|number\|TypographyEllipsisOptions | false |
| onCopy | 复制后触发 | (text: string) => void | - |
| onChange | 编辑完成后触发 | (text: string) => void | - |