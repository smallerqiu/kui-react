# Calendar

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
| value | Controlled date | string | - |
| defaultValue | Initial date | string | Today |
| events | Schedule events | CalendarEventData[] | [] |
| firstDayOfWeek | First day of week | number | 1 |
| maxEvents | Maximum events per date | number | 3 |
| showToolbar | Whether to show the toolbar | boolean | true |
| weekdays | Custom weekday labels | string[] | - |
| onChange | Called when the date changes | (date, cell) => void | - |
| onMonthChange | Called when the month changes | (value) => void | - |
| onEventClick | Called when an event is clicked | (event, cell) => void | - |