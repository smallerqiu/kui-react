# DatePicker 日期选择框

`value` 用于初始化组件，并同步后续的外部值变化。用户操作会更新内部值并触发 `onChange`，即使传入固定值或 `onChange` 仅用于监听也能交互。需要父子同步时使用 `value={state}` 配合 `onChange={setState}`。相同值的重新渲染不会重置内部编辑；数组值请使用新数组更新。

输入或选择日期的控件。

## 何时使用

当用户需要输入一个日期，可以点击标准输入框，弹出日期面板进行选择。

## 代码演示

[基本用法](./demo/basic.tsx)

- 选择或手动输入日期，通过 `value` 和 `onChange` 控制日期值

[输出类型](./demo/value-type.tsx)

- 通过 `valueType` 指定输出类型

[时间区域](./demo/range.tsx)

- 支持时间日期区间选择。取值建议用 `startDate` , `endDate`

[不可选择日期和时间](./demo/disabled-date.tsx)

- 可用 `disabledDate` 和 `disabledTime` 分别禁止选择部分日期和时间.

[禁用和不可编辑](./demo/disabled.tsx)

- 选择框的不可用 、 不可编辑, 不可清除 状态。

[预设范围](./demo/presets.tsx)

- 可以预设常用的日期范围以提高用户体验。。

[奇葩的主题](./demo/theme.tsx)

- 奇奇怪怪的东西

[尺寸](./demo/size.tsx)

- 通过 `small` ,`large` 来设置选择框的大小呈现

[多语言](./demo/lang.tsx)

- DatePicker 支持多语言。默认英语,依赖 `dayjs`.

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 的日期或时间值 | `DatePickerInput \| DatePickerInput[]` | - |
| open | 下拉面板显示状态 | `boolean` | - |
| startDate | 开始时间（范围选择） | `DatePickerInput` | - |
| endDate | 结束时间（范围选择） | `DatePickerInput` | - |
| mode | 日期选择模式 | `"date" \| "time" \| "month" \| "year" \| "dateTime" \| "dateRange" \| "dateTimeRange"` | date |
| disabled | 是否禁用组件 | `boolean` | false |
| readOnly | 是否只读 | `boolean` | false |
| size | 按钮尺寸,可选值 `small`、`large` | `"small" \| "medium" \| "large"` | - |
| clearable | 是否显示清除图标 | `boolean` | true |
| editable | 是否可编辑 | `boolean` | true |
| placeholder | 提示语 | `string \| string[]` | - |
| disabledDate | 不可选择的日期 | `((date: Date) => boolean)` | - |
| disabledTime | 不可选择的时间 | `((date: Date) => boolean)` | - |
| format | 设置日期格式，为数组时支持多格式匹配，展示以第一个为准。配置参考 [dayjs](http://day.js.org/) | `string` | YYYY-MM-DD |
| theme | theme='fill' 时呈现浅色主题 | `"dashed" \| "solid" \| "default" \| "fill" \| "outline" \| "plain" \| "underlined"` | fill |
| dateIcon | 自定义图标 | `IconType[]` | - |
| shape | 组件呈现的形式 | `"round" \| "default" \| "square" \| "circle"` | - |
| bordered | 是否展示边框 | `boolean` | true |
| placement | 下拉展示的方位 | `"top" \| "top-left" \| "top-right" \| "bottom" \| "bottom-left" \| "bottom-right"` | bottom-left |
| valueType | 输出值类型 | `"string" \| "date" \| "timestamp" \| "unix"` | string |
| presets | 预设日期 | `DatePickerPreset[]` | - |
| header | 自定义面板头部内容或渲染函数 | `ReactNode \| ((api: { emit: (value: DatePickerInput \| DatePickerInput[]) => void; }) => ReactNode)` | - |
| footer | 自定义面板底部内容或渲染函数 | `ReactNode \| ((api: { emit: (value: DatePickerInput \| DatePickerInput[]) => void; }) => ReactNode)` | - |
| onChange | 值改变后的回调 | `((date: DatePickerOutput \| DatePickerOutput[], dateStr: string \| string[]) => void)` | - |
| onStartDateChange | 范围选择开始日期变化时触发 | `((value: DatePickerOutput) => void)` | - |
| onEndDateChange | 范围选择结束日期变化时触发 | `((value: DatePickerOutput) => void)` | - |
| onOpenChange | 下拉框展开或收起时触发 | `((open: boolean) => void)` | - |
| onClear | 点击清除按钮时触发 | `(() => void)` | - |
| panelOnly | 只渲染选择面板，不包含触发元素与弹层 | `boolean` | false |
