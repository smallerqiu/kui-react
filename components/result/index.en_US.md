# Result

Displays an operation result or HTTP status page.

[Success](./demo/basic.tsx)

[Error](./demo/error.tsx)

[Info](./demo/info.tsx)

[Warning](./demo/warning.tsx)

[403](./demo/403.tsx)

[404](./demo/404.tsx)

[500](./demo/500.tsx)

[Custom](./demo/custom.tsx)

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| status | Result status | success,error,info,warning,403,404,500 | info |
| title | Title | ReactNode | - |
| subTitle | Subtitle | ReactNode | - |
| icon | Custom icon or content | IconType[],ReactNode | - |
| children | Detail content | ReactNode | - |
| extra | Action content | ReactNode | - |
