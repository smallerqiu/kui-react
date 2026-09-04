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

| Property       | Description                                   | Type                       | Default |
| -------------- | --------------------------------------------- | -------------------------- | ------- |
| value          | Controlled date                               | string                     | -       |
| defaultValue   | Initial date                                  | string                     | Today   |
| events         | Schedule events                               | CalendarEventData[]        | []      |
| firstDayOfWeek | First day of week, where 0 is Sunday          | number                     | locale  |
| maxEvents      | Maximum events per date                       | number                     | 3       |
| showToolbar    | Whether to show the toolbar                   | boolean                    | true    |
| todayText      | Text of the "Today" button                    | string                     | locale  |
| weekdays       | Custom labels ordered Sunday through Saturday | string[]                   | locale  |
| onChange       | Called when the date changes                  | (date, cell) => void       | -       |
| onMonthChange  | Called when the month changes                 | (value) => void            | -       |
| onEventClick   | Called when an event is clicked               | (event, cell) => void      | -       |
| title          | Custom title content                          | ReactNode                  | -       |
| extra          | Extra content on the right of the toolbar     | ReactNode                  | -       |
| dateCell       | Custom date cell renderer                     | (cell) => ReactNode        | -       |
| event          | Custom event renderer                         | (event, cell) => ReactNode | -       |
| more           | Custom "more" text renderer                   | (count, cell) => ReactNode | -       |

When a date cell is focused, use the arrow keys to move, `Home` or `End` to move within the current week, and `Enter` or Space to select. Selecting a date from an adjacent month also changes the displayed month.
