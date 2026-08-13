# Button

Buttons are used to initiate an immediate operation.

## When to Use

Marks one (or encapsulates a group of) operation commands, responds to user click behavior, and triggers the corresponding business logic.

## Import

```js
import { Button } from "react-kui";
```

## Examples

[Basic Usage](./demo/basic.tsx)

- Use the `type` property to define a `Button`.

[Theme](./demo/theme.tsx)

- Use `theme` to display different appearances.

[Color Variants](./demo/color.tsx)

- Use `color` to create more button variants.

[With Icon](./demo/with-icon.tsx)

- Set the button icon by adding the `icon` property.

[Size](./demo/size.tsx)

- `small` for small size, `large` for large size.

[Disabled](./demo/disabled.tsx)

- Add the `disabled` property to make the button unavailable.

[Loading State](./demo/loading.tsx)

- Add the `loading` property to put the button in a loading state.

[Block Button](./demo/block.tsx)

- The `block` property makes the button fit the width of its parent.

[Button Group](./demo/group.tsx)

- Place multiple `Button` components inside `ButtonGroup` to group them.

## API

| Property | Description                                                                                          | Type                                       | Default |
| -------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------ | ------- |
| type     | Set the button type                                                                                  | `primary` \| `link`\| `dashed` \| `danger` | -       |
| htmlType | Set the native type value of the button                                                              | string                                     | button  |
| disabled | Disabled state of the button                                                                         | boolean                                       | false   |
| size     | Button size,                                                                                         | [small,large]                              | -       |
| shape    | When shape=circle, presents a circular button                                                        | boolean                                       | false   |
| theme    | Button theme                                                                                         | [solid,fill,normal]                        | -       |
| icon     | Button icon                                                                                          | string                                     | -       |
| loading  | Whether the button is in loading mode                                                                | boolean                                       | false   |
| href     | The address to jump to when clicked. Specifying this property makes the button behave like an a link | string                                     | -       |
| target   | Equivalent to the target attribute of an a link, takes effect when href exists                       | string                                     | -       |
| block    | Option to fit button width to its parent width                                                       | boolean                                       | false   |
| color    | Custom button color                                                                                   | string                                     | -       |
| onClick  | Triggered when the button is clicked                                                                  | MouseEventHandler<HTMLElement>             | -       |
