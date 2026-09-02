# Message

Globally display operation feedback information.

## When to Use

- Can provide feedback information such as success, warning, and error.
- Displayed centered at the top and automatically disappears. It is a lightweight prompt method that does not interrupt user operations.

## Examples

[Normal Prompt](./demo/basic.tsx)

- Informational feedback prompt.

[Grouping](./demo/grouping.tsx)

- Notifications with the same grouping will reuse the existing entry—only updating the content and resetting the timer without creating a new one.

[Custom Icon](./demo/icon.tsx)

- Custom icon.

[Prompt Types](./demo/types.tsx)

- Set the prompt type via `type`.

[Loading](./demo/loading.tsx)

- Perform a global loading and remove it asynchronously.

[Custom Duration](./demo/close.tsx)

- Customize configuration where `duration` controls auto-close time

## API

The component provides some static methods, used as follows:

- `message.info(content, [duration], onClose)`
- `message.success(content, [duration], onClose)`
- `message.warning(content, [duration], onClose)`
- `message.error(content, [duration], onClose)`
- `message.loading(content, [duration])`

Also provides global configuration and global destruction methods:

- `message.show(options)`
- `message.destroy()`

Parameter `options` is an object, specific description as follows:

| Property | Description                                                                        | Type              | Default |
| -------- | ---------------------------------------------------------------------------------- | ----------------- | ------- |
| type     | Prompt type, provides four optional types: `info`, `success`, `error`, `warning`   | string            | info    |
| content  | Prompt content                                                                     | string, ReactNode | -       |
| duration | Auto-close delay, in seconds, 0 means not auto-closed                              | number            | 3.5     |
| closable | Whether it can be manually closed                                                  | boolean           | false   |
| icon     | Custom icon                                                                        | string            | -       |
| color    | Custom icon color                                                                  | string            | -       |
| onClose  | Callback when closing                                                              | () => void        | -       |
| grouping | Group key; messages with the same key reuse the existing entry and reset its timer | string            | -       |
