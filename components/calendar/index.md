# 日历 Calendar

`value` 用于初始化组件，并同步后续的外部值变化。用户操作会更新内部值并触发 `onChange`，即使传入固定值或 `onChange` 仅用于监听也能交互。需要父子同步时使用 `value={state}` 配合 `onChange={setState}`。相同值的重新渲染不会重置内部编辑；数组值请使用新数组更新。

用于按月展示日期和日程事件。

## 代码演示

[基本用法](./demo/basic.tsx?show=vertical)

- 展示日期选择和日程事件。

[自定义内容](./demo/custom.tsx?show=vertical)

- 使用 ReactNode 自定义额外区域、事件和更多提示。

[国际化](./demo/locale.tsx?show=vertical)

- 使用 `ConfigProvider` 切换日历语言。

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 日期 | `string` | - |
| events | 日程事件 | `CalendarEventData[]` | [] |
| firstDayOfWeek | 每周起始日，0 为周日 | `number` | 根据语言 |
| maxEvents | 每个日期最多显示的事件数 | `number` | 3 |
| showToolbar | 是否显示工具栏 | `boolean` | true |
| todayText | “今天”按钮的文本 | `string` | 根据语言 |
| weekdays | 自定义星期名称，按周日至周六排列 | `string[]` | 根据语言 |
| onChange | 日期变化回调 | `((date: string, cell: CalendarDateCell) => void)` | - |
| onMonthChange | 月份变化回调 | `((value: { year: number; month: number; }) => void)` | - |
| onEventClick | 事件点击回调 | `((event: CalendarEventData, cell: CalendarDateCell) => void)` | - |
| title | 自定义标题内容 | `React.ReactNode` | - |
| extra | 工具栏右侧额外内容 | `React.ReactNode` | - |
| dateCell | 自定义日期单元格渲染 | `((cell: CalendarDateCell) => React.ReactNode)` | - |
| event | 自定义事件渲染 | `((event: CalendarEventData, cell: CalendarDateCell) => React.ReactNode)` | - |
| more | 自定义“更多”文本渲染 | `((count: number, cell: CalendarDateCell) => React.ReactNode)` | - |

日期单元格获得焦点后，可使用方向键移动焦点，使用 `Home`、`End` 移至当前周首尾，并用 `Enter` 或空格选择日期。选择相邻月份的日期时会同时切换展示月份。
