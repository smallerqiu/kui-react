# Calendar

`value` initializes the component and synchronizes later external changes. User interaction updates the local value and emits `onChange`, even when `value` is a fixed literal or `onChange` only observes changes. Use `value={state}` with `onChange={setState}` to synchronize parent state. A rerender with the same value does not reset local edits; arrays should be updated immutably.

Displays dates and schedule events by month.

## Examples

[Basic Usage](./demo/basic.tsx?show=vertical)

- Display date selection and schedule events.

[Custom Content](./demo/custom.tsx?show=vertical)

- Customize the extra area, events, and more indicator with ReactNode values.

[Localization](./demo/locale.tsx?show=vertical)

- Switch the calendar language with `ConfigProvider`.

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| value | date | `string` | - |
| events | Schedule events | `CalendarEventData[]` | [] |
| firstDayOfWeek | First day of week, where 0 is Sunday | `number` | locale |
| maxEvents | Maximum events per date | `number` | 3 |
| showToolbar | Whether to show the toolbar | `boolean` | true |
| todayText | Text of the "Today" button | `string` | locale |
| weekdays | Custom labels ordered Sunday through Saturday | `string[]` | locale |
| onChange | Called when the date changes | `((date: string, cell: CalendarDateCell) => void)` | - |
| onMonthChange | Called when the month changes | `((value: { year: number; month: number; }) => void)` | - |
| onEventClick | Called when an event is clicked | `((event: CalendarEventData, cell: CalendarDateCell) => void)` | - |
| title | Custom title content | `React.ReactNode` | - |
| extra | Extra content on the right of the toolbar | `React.ReactNode` | - |
| dateCell | Custom date cell renderer | `((cell: CalendarDateCell) => React.ReactNode)` | - |
| event | Custom event renderer | `((event: CalendarEventData, cell: CalendarDateCell) => React.ReactNode)` | - |
| more | Custom "more" text renderer | `((count: number, cell: CalendarDateCell) => React.ReactNode)` | - |

When a date cell is focused, use the arrow keys to move, `Home` or `End` to move within the current week, and `Enter` or Space to select. Selecting a date from an adjacent month also changes the displayed month.
