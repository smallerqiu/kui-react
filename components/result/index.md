# 结果 Result

展示操作结果或 HTTP 状态页面。

[成功](./demo/basic.tsx?show=vertical)

[错误](./demo/error.tsx?show=vertical)

[信息](./demo/info.tsx?show=vertical)

[警告](./demo/warning.tsx?show=vertical)

[403](./demo/403.tsx?show=vertical)

[404](./demo/404.tsx?show=vertical)

[500](./demo/500.tsx?show=vertical)

[自定义](./demo/custom.tsx?show=vertical)

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| status | 结果状态 | success,error,info,warning,403,404,500 | info |
| title | 标题 | ReactNode | - |
| subTitle | 副标题 | ReactNode | - |
| icon | 自定义图标或内容 | IconType[],ReactNode | - |
| children | 详情内容 | ReactNode | - |
| extra | 操作区域 | ReactNode | - |
