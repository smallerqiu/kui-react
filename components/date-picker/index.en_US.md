# DatePicker

`value` initializes the component and synchronizes later external changes. User interaction updates the local value and emits `onChange`, even when `value` is a fixed literal or `onChange` only observes changes. Use `value={state}` with `onChange={setState}` to synchronize parent state. A rerender with the same value does not reset local edits; arrays should be updated immutably.

Control for inputting or selecting a date.

## When to Use

When the user needs to input a date, they can click the standard input box to pop up a date panel for selection.

## Examples

[Basic Usage](./demo/basic.tsx)

- Select or manually enter a date. Use `value` and `onChange` to control the date value.
- When typed text is invalid, or is blocked by `disabledDate` / `disabledTime`, the box falls back to the current value: uncontrolled pickers fall back to the last committed result rather than to the value passed in first.
- Picking the already selected date, or submitting the same value again, does not emit another `onChange`.
- `mode="year"` / `mode="month"` open the year / month panel right away (a `panelOnly` picker included), and those cells work with the keyboard too: Tab to a cell and press `Enter` or Space; the year and month labels in the header switch panels with the same keys.
- The year / month highlight follows the current value: browsing to another year or month only moves what you are looking at, never the selected style.

[Output Type](./demo/value-type.tsx)

- Specify the output type via `valueType`.

[Date Range](./demo/range.tsx)

- Supports date and time range selection. It's recommended to use `startDate` and `endDate` for values.
- A range with only one end filled in is not a selection: closing the panel with `Escape` or a click outside puts the last committed range back, and the half value is never emitted.
- While the other end is still empty, a time picked in the time columns only writes into the box; it is never emitted as a result.
- When a range controls only one end (`startDate` or `endDate`), the panel keeps that end and the next pick only fills the empty one, so it never overwrites what the parent passed in.

[Disabled Dates and Times](./demo/disabled-date.tsx)

- Use `disabledDate` and `disabledTime` to block specific dates and times; both apply to clicking, typing and presets, and `disabledTime` counts in the `time`, `dateTime` and `dateTimeRange` modes.
- `disabledDate` counts in the year / month panels as well: when not a single day inside a whole year or month can be picked, that cell is greyed out, refuses clicks, and Tab skips it.
- A cell that still has a pickable day stays clickable: the value lands on the day you are browsing, or on the first pickable day inside that year / month when the browsed day itself is blocked.
- Browsing to a year / month is only navigation, not a selection, so `disabledDate` never blocks it.

[Disabled and Non-editable](./demo/disabled.tsx)

- The disabled, non-editable, and non-clearable states of the picker.

[Preset Ranges](./demo/presets.tsx)

- You can preset common date ranges to improve user experience.

[Weird Theme](./demo/theme.tsx)

- Strange things.

[Size](./demo/size.tsx)

- Use `small` and `large` to set the size of the picker.

[Multi-language](./demo/lang.tsx)

- DatePicker supports multiple languages,Default English, depending on `dayjs`.

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| value | date or time value | `DatePickerInput \| DatePickerInput[]` | - |
| open | dropdown visibility | `boolean` | - |
| startDate | Start value for range selection | `DatePickerInput` | - |
| endDate | End value for range selection | `DatePickerInput` | - |
| mode | Date picker mode | `"date" \| "time" \| "month" \| "year" \| "dateTime" \| "dateRange" \| "dateTimeRange"` | date |
| disabled | Whether the component is disabled | `boolean` | false |
| readOnly | Whether the component is read-only | `boolean` | false |
| size | Button size, optional values `small`, `large` | `"small" \| "medium" \| "large"` | - |
| clearable | Whether to show the clear icon | `boolean` | true |
| editable | Whether it is editable | `boolean` | true |
| placeholder | Placeholder text | `string \| string[]` | - |
| disabledDate | Disabled dates | `((date: Date) => boolean)` | - |
| disabledTime | Disabled times | `((date: Date) => boolean)` | - |
| format | Set the date format. When an array, supports multiple format matches, displayed according to the first one. Configuration reference http://day.js.org/ | `string` | YYYY-MM-DD |
| theme | When theme='fill', presents a fill theme | `"dashed" \| "solid" \| "default" \| "fill" \| "outline" \| "plain" \| "underlined"` | fill |
| dateIcon | Custom icon | `IconType[]` | - |
| shape | Component shape | `"round" \| "default" \| "square" \| "circle"` | - |
| bordered | Whether to display the border | `boolean` | true |
| placement | Direction displayed when pulled down | `"top" \| "top-left" \| "top-right" \| "bottom" \| "bottom-left" \| "bottom-right"` | bottom-left |
| destroyOnClose | Whether to destroy panel content after closing. Destroyed by default (remounted on reopen); set false to keep form state at the cost of one hidden DOM node per opened instance | `boolean` | true |
| valueType | Output value type | `"string" \| "date" \| "timestamp" \| "unix"` | string |
| presets | Preset dates | `DatePickerPreset[]` | - |
| header | Custom panel header content or render function | `ReactNode \| ((api: { emit: (value: DatePickerInput \| DatePickerInput[]) => void; }) => ReactNode)` | - |
| footer | Custom panel footer content or render function | `ReactNode \| ((api: { emit: (value: DatePickerInput \| DatePickerInput[]) => void; }) => ReactNode)` | - |
| onChange | Callback after the value changes | `((date: DatePickerOutput \| DatePickerOutput[], dateStr: string \| string[]) => void)` | - |
| onStartDateChange | Triggered when the range start date changes | `((value: DatePickerOutput) => void)` | - |
| onEndDateChange | Triggered when the range end date changes | `((value: DatePickerOutput) => void)` | - |
| onOpenChange | Triggered when the dropdown box expands or collapses | `((open: boolean) => void)` | - |
| onClear | Triggered when the clear button is clicked | `(() => void)` | - |
| panelOnly | Render only the picker panel, without a trigger or portal | `boolean` | false |
