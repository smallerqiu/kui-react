# DatePicker 日期选择框

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

| 属性         | 说明                                                                                                               | 类型                                                        | 默认值     |
| ------------ | ------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------- | ---------- |
| value        | 受控的日期或时间值                                                                                                 | DatePickerInput, DatePickerInput[]                           | -          |
| defaultValue | 非受控模式的初始日期或时间值                                                                                       | DatePickerInput, DatePickerInput[]                           | -          |
| open         | 受控的下拉面板显示状态                                                                                             | boolean                                                        | -          |
| defaultOpen  | 非受控模式的初始下拉面板状态                                                                                       | boolean                                                        | false      |
| startDate    | 开始时间（范围选择）                                                                                                | DatePickerInput                                             | -          |
| endDate      | 结束时间（范围选择）                                                                                                | DatePickerInput                                             | -          |
| mode         | 使用 `mode` 属性，可以自定义日期显示类型，提供 `year`,`month`,`date`,`time`,`dateTime`,`dateRange`,`dateTimeRange` | string                                                      | date       |
| disabled     | 是否禁用组件                                                                                                       | boolean                                                        | false      |
| size         | 按钮尺寸,可选值 `small`、`large`                                                                                   | string                                                      | -          |
| clearable    | 是否显示清除图标                                                                                                   | boolean                                                        | true       |
| editable     | 是否可编辑                                                                                                         | boolean                                                        | true       |
| placeholder  | 提示语                                                                                                             | string, string[]                                            | -          |
| disabledDate | 不可选择的日期                                                                                                     | (date: Date) => boolean                                     | -          |
| disabledTime | 不可选择的时间                                                                                                     | (date: Date) => boolean                                     | -          |
| format       | 设置日期格式，为数组时支持多格式匹配，展示以第一个为准。配置参考 [dayjs](http://day.js.org/)                       | string                                                      | YYYY-MM-DD |
| theme        | theme='fill' 时呈现浅色主题                                                                                        | string                                                      | fill       |
| dateIcon     | 自定义图标                                                                                                         | string                                                      | -          |
| shape        | 组件呈现的形式                                                                                                     | [circle,square]                                             | -          |
| bordered     | 是否展示边框                                                                                                       | boolean                                                        | true       |
| placement    | 下拉展示的方位                                                                                                     | string                                                      | bottom-left |
| valueType    | 默认输出的值的类型                                                                                                 | ["date" ,"timestamp" , "unix" , "string"]                   | string     |
| presets      | 预设的日期                                                                                                         | DatePickerPresetsType[]                                     | -          |
| header       | 自定义面板头部内容或渲染函数                                                                                       | ReactNode, (api) => ReactNode                                | -          |
| footer       | 自定义面板底部内容或渲染函数                                                                                       | ReactNode, (api) => ReactNode                                | -          |
| onChange     | 默认值改变之后的回调                                                                                               | (date: Date \| Date[], dateStr: string \| string[]) => void | -          |
| onStartDateChange | 范围选择开始日期变化时触发                                                                                   | (value: DatePickerOutput) => void                           | -          |
| onEndDateChange | 范围选择结束日期变化时触发                                                                                      | (value: DatePickerOutput) => void                           | -          |
| onOpenChange | 下拉框展开或收起时触发                                                                                             | (opened: boolean) => void                                   | -          |
| onClear      | 点击清除按钮时触发                                                                                                 | () => void                                                  | -          |
| panelOnly    | 只渲染选择面板，不包含触发元素与弹层                                                                               | boolean                                                     | false      |
