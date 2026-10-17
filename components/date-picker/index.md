# DatePicker 日期选择框

`value` 用于初始化组件，并同步后续的外部值变化。用户操作会更新内部值并触发 `onChange`，即使传入固定值或 `onChange` 仅用于监听也能交互。需要父子同步时使用 `value={state}` 配合 `onChange={setState}`。相同值的重新渲染不会重置内部编辑；数组值请使用新数组更新。

输入或选择日期的控件。

## 何时使用

当用户需要输入一个日期，可以点击标准输入框，弹出日期面板进行选择。

## 代码演示

[基本用法](./demo/basic.tsx)

- 选择或手动输入日期，通过 `value` 和 `onChange` 控制日期值
- 手输的内容认不出来、或被 `disabledDate` / `disabledTime` 挡住时，输入框退回当前这份值；未受控时退回的是最近一次提交的结果，不会弹回初始传进来的值。
- 重复点已经选中的日期、重复提交同一个值，不会再触发一次 `onChange`。
- `mode="year"` / `mode="month"` 直接进年 / 月面板（`panelOnly` 的常驻面板也一样），格子也能用键盘选：Tab 到格子按 `Enter` 或空格，头部的年份、月份标签同样按这两个键切面板。
- 年 / 月面板的高亮跟着当前值走：翻年、翻月只改浏览位置，不会把选中样式挪到正在看的那一格。

[输出类型](./demo/value-type.tsx)

- 通过 `valueType` 指定输出类型

[时间区域](./demo/range.tsx)

- 支持时间日期区间选择。取值建议用 `startDate` , `endDate`
- 区间只凑齐一头不算选上：按 `Esc` 或点面板外面关掉时，输入框退回上次提交的那段区间，半截值不会发给 `onChange`。
- 区间还缺一头时，时间列上选的时间只写进输入框，不会当成结果发给 `onChange`。
- 范围只受控单边（只传 `startDate` 或只传 `endDate`）时，面板认已有的那头，下一次点选只补空出来的那一头，不会把父级给掉的那一头覆盖掉。

[不可选择日期和时间](./demo/disabled-date.tsx)

- 可用 `disabledDate` 和 `disabledTime` 分别禁止选择部分日期和时间；两者对点选、手输和预设都生效，`disabledTime` 在 `time` / `dateTime` / `dateTimeRange` 三种档下都参与判断。
- 年 / 月面板同样吃 `disabledDate`：一整年或一整月里一天都选不出来时，那一格置灰、点不进去，Tab 也会跳过它。
- 格里还能选出一天时，那一格照常能点：值落在浏览位置那一天，那一天被禁就往后找这一格里第一个能选的日子。
- 翻到某一年 / 某一月只是浏览、不算选值，所以不受 `disabledDate` 拦。

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
| format | 设置日期格式，只接受单个格式（解析和展示都用它），不支持数组多格式匹配。配置参考 [dayjs](http://day.js.org/) | `string` | 按 `mode` 取：`year` 为 `YYYY`、`month` 为 `YYYY-MM`、`date` / `dateRange` 为 `YYYY-MM-DD`、`time` 为 `HH:mm:ss`、`dateTime` / `dateTimeRange` 为 `YYYY-MM-DD HH:mm:ss` |
| theme | 主题 | `"dashed" \| "solid" \| "fill" \| "outline" \| "plain" \| "underlined"` | fill |
| dateIcon | 自定义图标 | `IconType[]` | - |
| shape | 组件呈现的形式 | `"round" \| "default" \| "square" \| "circle"` | - |
| bordered | 是否展示边框 | `boolean` | true |
| placement | 下拉展示的方位 | `"top" \| "top-left" \| "top-right" \| "bottom" \| "bottom-left" \| "bottom-right"` | bottom-left |
| destroyOnClose | 关闭后是否销毁面板内容。默认销毁（重开时重新挂载）；设为 false 可保留面板内已填写的表单状态，代价是每个打开过的实例留一份隐藏 DOM | `boolean` | true |
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
