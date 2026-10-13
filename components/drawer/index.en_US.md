# Drawer

A floating panel that slides in from the edge of the screen.

## When to Use

- The drawer slides in from the edge of the parent window, covering part of the parent window content. Users can operate within the drawer without leaving the current task. After the operation is completed, they can smoothly return to the original task.
- When an additional panel is needed to control the parent window content, this panel can be called out when needed. For example, controlling interface display styles, adding content to the interface.
- When temporary tasks need to be inserted into the current task flow, creating or previewing additional content. For example, displaying terms of agreement, creating sub-objects.

## Examples

[Basic Usage](./demo/basic.tsx)

- Use `open` and `onOpenChange` to control whether the `Drawer` is displayed. If `title` is null or false, the title is not shown.

[Custom](./demo/custom.tsx)

- Use `title` to set the title, `width` to control the width, and `placement` to control the direction.

[Form Mode](./demo/with-form.tsx)

- Content will be presented in form mode, with a header and footer, and the footer can be customized.

[Inject into Target Element](./demo/target.tsx)

- Can be expanded within the target element.

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| open | drawer visibility | `boolean` | - |
| escKey | Whether to support closing with Esc key | `boolean` | true |
| destroyOnClose | Whether to destroy drawer content after closing. Destroyed by default (remounted on reopen); set false to keep form state at the cost of one hidden DOM node per opened drawer | `boolean` | true |
| maskClosable | Whether clicking the mask closes the drawer (mask only; Esc is gated by `escKey`) | `boolean` | true |
| title | Drawer title. When null or false, the title is not displayed | `React.ReactNode` | - |
| width | Drawer width, used when `placement` is `left` or `right`, supports percentage | `string \| number` | 520 |
| height | Drawer height, used when `placement` is `top` or `bottom`, supports percentage | `string \| number` | 520 |
| placement | The display direction of the drawer. Provides 4 display methods: `left`, `top`, `right`, `bottom` | `"top" \| "bottom" \| "left" \| "right"` | right |
| footer | Footer content. Set `footer=null` to not display the footer | `React.ReactNode` | true |
| closable | Whether to show the close button | `boolean` | true |
| target | Display container; accepts an element, Ref, or element getter | `DrawerTarget` | () => document.body |
| okText | OK button text | `string` | OK |
| cancelText | Cancel button text | `string` | Cancel |
| mask | Whether to show the mask | `boolean` | true |
| loading | When set to `true`, the confirm button will be in a loading state | `boolean` | false |
| onOk | Callback when OK is clicked | `(() => void)` | - |
| onClose | Callback when the drawer closes | `(() => void)` | - |
| onCancel | Callback when Cancel is clicked | `(() => void)` | - |
| onOpenChange | Callback for opening or closing the drawer | `((opened: boolean) => void)` | - |

### onCancel vs onClose

Closing splits into two channels that never fire together:

- The footer **Cancel** button emits `onCancel` only. The drawer still closes, but `onClose` does not run.
- Mask click, Esc and the top-right close button emit `onClose` only.

Listen to both if you need one "it closed" hook; keep them separate if you need to tell an explicit cancel apart from every other way of closing.
`onOk` never closes the drawer — it only sits on the OK button, so close it yourself inside that callback when you need to.
Keep the open state in sync through `onOpenChange` alone: all four ways of closing — cancel, mask, Esc, the close icon — fire `onOpenChange(false)`, while `onCancel` / `onClose` only tell you which channel closed it. So the controlled pattern is `open={open}` with `onOpenChange={setOpen}`, not a `setOpen(false)` in each of `onCancel` and `onClose`.
