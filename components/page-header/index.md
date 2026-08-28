# 页面头部 PageHeader

用于展示页面标题、描述、面包屑和操作区域。

## 代码演示

[基础用法](./demo/basic.tsx?show=vertical)

- 展示标题、描述和右侧操作按钮。

[简单模式](./demo/simple.tsx?show=vertical)

- 只显示页面标题和描述。

[自定义内容](./demo/slots.tsx?show=vertical)

- 使用 ReactNode 自定义面包屑、返回按钮、标题、描述、操作和补充内容。

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 标题 | ReactNode | - |
| description | 描述 | ReactNode | - |
| breadcrumb | 面包屑区域 | ReactNode | - |
| back | 返回按钮区域 | ReactNode | - |
| actions | 操作区域 | ReactNode | - |
| children | 补充内容 | ReactNode | - |