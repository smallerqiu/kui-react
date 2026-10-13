# Modal

Modal dialog box.

## When to Use

- When users need to handle transactions without jumping to another page to interrupt the workflow, a Modal can be opened in the center of the current page to carry the corresponding operations.
- Additionally, when a simple confirmation box is needed to ask the user, syntax sugar methods like Modal.confirm() can be used.

## Examples

[Basic Usage](./demo/basic.tsx)

- Use `open` and `onOpenChange` to control visibility.

[Custom](./demo/custom.tsx)

- Custom `Modal`.

[Other Properties](./demo/more.tsx)

- When the footer is not needed, set `footer` to `null`.

[Global Mode](./demo/global.tsx)

- Use global mode.

[Confirmation Dialog](./demo/confirm.tsx)

- A global confirmation dialog that can be closed asynchronously.

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| open | dialog visibility | `boolean` | - |
| title | Dialog title | `React.ReactNode` | - |
| width | Dialog width | `string \| number` | 520 |
| okText | OK button text | `string` | OK |
| cancelText | Cancel button text | `string` | Cancel |
| draggable | Whether the modal can be dragged, not available in confirm mode | `boolean` | false |
| centered | Whether the window can be centered, not available in confirm mode | `boolean` | false |
| maximized | Whether the modal can be maximized, not available in confirm mode | `boolean` | false |
| maskClosable | Whether clicking the mask closes the modal (mask only; Esc is gated by `escKey`) | `boolean` | false |
| escKey | Whether to support closing with Esc key | `boolean` | true |
| panelOnly | Render only the modal panel, without mask, animation, or global events | `boolean` | false |
| destroyOnClose | Whether to destroy dialog content after closing. Destroyed by default (remounted on reopen); set false to keep form state at the cost of one hidden DOM node per opened dialog | `boolean` | true |
| footer | When `footer=false` the footer is hidden; pass a node to replace the whole footer. | `React.ReactNode` | true |
| loading | When set to `true`, the confirm button will be in a loading state | `boolean` | false |
| top | Distance from the top of the window | `number` | 100 |
| showClose | Whether to display the close button | `boolean` | true |
| mask | Whether to show the mask | `boolean` | true |
| onOk | Callback when OK is clicked, `Note: will not close Modal` | `(() => void)` | - |
| onCancel | Callback when Cancel is clicked | `(() => void)` | - |
| onClose | Callback when window closes | `(() => void)` | - |
| onAfterClose | Callback after the close animation finishes | `(() => void)` | - |
| onOpenChange | Callback for opening or closing a window | `((opened: boolean) => void)` | - |

### onCancel vs onClose

Closing splits into two channels that never fire together:

- The footer **Cancel** button emits `onCancel` only. The dialog still closes, but `onClose` does not run.
- Mask click, Esc and the top-right close button emit `onClose` only.

Listen to both if you need one "it closed" hook; keep them separate if you need to tell an explicit cancel apart from every other way of closing.
`onOk` never closes the dialog — it only sits on the OK button, so close it yourself inside that callback when you need to.
Keep the open state in sync through `onOpenChange` alone: all four ways of closing — cancel, mask, Esc, the close icon — fire `onOpenChange(false)`, while `onCancel` / `onClose` only tell you which channel closed it. So the controlled pattern is `open={open}` with `onOpenChange={setOpen}`, not a `setOpen(false)` in each of `onCancel` and `onClose`.

## Modal.method()

The component provides some static methods, used as follows:

- modal.info(options)
- modal.success(options)
- modal.warning(options)
- modal.error(options)
- modal.confirm(options)

Also provides global configuration and global destruction methods:

- modal.show(options)
- modal.destroyAll()

Imperative modals are mounted globally under `body` and are not owned by the current page component. Destroy them when the route location changes:

```tsx
const location = useLocation();

useEffect(() => () => modal.destroyAll(), [location.pathname]);
```

Parameter options is an object, specific description as follows:

| Property   | Description                                                                                                                                                   | Type       | Default |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------- |
| title      | Dialog title, accepts nodes as well as text                                                                                             | React.ReactNode | -       |
| content    | Dialog content, accepts nodes as well as text                                                                                   | React.ReactNode | -       |
| okText     | OK button text                                                                                                                                                | string     | OK      |
| cancelText | Cancel button text                                                                                                                                            | string     | Cancel  |
| icon       | Modal icon, available when type is toast, default optional values are success, warning, error, info, can also be customized, refer to /components/icon values | string     | -       |
| color      | Modal icon color, available when type is toast                                                                                                                | string     | -       |
| type       | Modal type for `modal.show`: `info`, `success`, `warning`, `error`, or `confirm`                                                                              | ToastType  | info    |
| onOk       | Callback when OK is clicked; returning a Promise hands the closing timing to the component — resolve closes it, reject only stops loading and keeps it open  | () => void \| PromiseLike | -       |
| onCancel   | Callback when Cancel is clicked                                                                                                                               | () => void | -       |
