# Result

Displays an operation result or HTTP status page.

[Success](./demo/basic.tsx?show=vertical)

[Error](./demo/error.tsx?show=vertical)

[Info](./demo/info.tsx?show=vertical)

[Warning](./demo/warning.tsx?show=vertical)

[403](./demo/403.tsx?show=vertical)

[404](./demo/404.tsx?show=vertical)

[500](./demo/500.tsx?show=vertical)

[Custom](./demo/custom.tsx?show=vertical)

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| status | Result status | success,error,info,warning,403,404,500 | info |
| title | Title | ReactNode | - |
| subTitle | Subtitle | ReactNode | - |
| icon | Custom icon or content | IconType[],ReactNode | - |
| children | Detail content | ReactNode | - |
| extra | Action content | ReactNode | - |
