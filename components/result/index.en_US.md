# Result

Displays an operation result or HTTP status page.

[Success](./demo/basic.tsx?show=vertical)

- Display result feedback after successful operation

[Error](./demo/error.tsx?show=vertical)

- Display error operation result

[Info](./demo/info.tsx?show=vertical)

- Display information result page

[Warning](./demo/warning.tsx?show=vertical)

- Display warning result information

[403](./demo/403.tsx?show=vertical)

- Permission denied error page

[404](./demo/404.tsx?show=vertical)

- Page not found error page

[500](./demo/500.tsx?show=vertical)

- Server error page

[Custom](./demo/custom.tsx?show=vertical)

- Customize result page content and actions

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| status | Result status | success,error,info,warning,403,404,500 | info |
| title | Title | ReactNode | - |
| subTitle | Subtitle | ReactNode | - |
| icon | Custom icon or content | IconType[],ReactNode | - |
| children | Detail content | ReactNode | - |
| extra | Action content | ReactNode | - |
