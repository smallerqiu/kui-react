# 日历 Calendar

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
| value | 受控日期 | string | - |
| defaultValue | 初始日期 | string | 当前日期 |
| events | 日程事件 | CalendarEventData[] | [] |
| firstDayOfWeek | 每周起始日 | number | 1 |
| maxEvents | 每个日期最多显示的事件数 | number | 3 |
| showToolbar | 是否显示工具栏 | boolean | true |
| todayText | “今天”按钮的文本 | string | Today |
| weekdays | 自定义星期名称 | string[] | - |
| onChange | 日期变化回调 | (date, cell) => void | - |
| onMonthChange | 月份变化回调 | (value) => void | - |
| onEventClick | 事件点击回调 | (event, cell) => void | - |
| title | 自定义标题内容 | ReactNode | - |
| extra | 工具栏右侧额外内容 | ReactNode | - |
| dateCell | 自定义日期单元格渲染 | (cell) => ReactNode | - |
| event | 自定义事件渲染 | (event, cell) => ReactNode | - |
| more | 自定义“更多”文本渲染 | (count, cell) => ReactNode | - |