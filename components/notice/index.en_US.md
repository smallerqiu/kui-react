# Notice

Globally display notification reminder information.

## When to Use

Display notification reminder information in the four corners of the system. Often used in the following situations:

- More complex notification content.
- Interactive notifications, giving users the next action point.
- System-initiated pushes.

## Examples

[Basic Usage](./demo/basic.tsx)

- Basic usage of `Notice`.

[Notification with Icon](./demo/types.tsx)

- Call different methods to display different types.

[Custom Icon](./demo/icon.tsx)

- Custom icon.

[Custom Duration](./demo/close.tsx)

[Grouping](./demo/grouping.tsx)

- Update an existing notice by using the same `grouping` key.

- Can be custom configured. Use `duration` to control the auto-close duration (default `3s`).

## API

The component provides some static methods, used as follows:

- `notice.info(options)`
- `notice.success(options)`
- `notice.warning(options)`
- `notice.error(options)`

Also provides global configuration and global destruction methods:

- `notice.open(options)`
- `notice.destroy()`

Parameter `options` is an object, specific description as follows:

| Property | Description                                      | Type          | Default |
| -------- | ------------------------------------------------ | ------------- | ------- |
| title    | Notification title                               | string        | -       |
| content  | Prompt content                                   | string, ReactNode | -       |
| duration | Auto-close delay, in seconds, 0 means not closed | number        | 3.5     |
| icon     | Custom icon                                      | string        | -       |
| color    | Custom icon color                                | string        | -       |
| onClose  | Callback when closing                            | () => void    | -       |
| grouping | Group key; notices with the same key reuse the existing entry and reset its timer | string | - |
