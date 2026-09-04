# CheckCard

Present richer choices with a title, description, and optional symbol.

## When to Use

- Use standalone for a toggleable boolean choice, such as accepting an agreement.
- Use inside `CheckCardGroup` for a single choice among multiple cards, such as an account or plan type.

## Examples

[Standalone](./demo/basic.tsx?show=vertical)

- A standalone card can be selected and deselected.

[Single-selection group](./demo/group.tsx?show=vertical)

- Groups use radio semantics and support arrow-key navigation.

[Custom symbol](./demo/custom.tsx?show=vertical)

- Use the `symbol` and `checkedSymbol` properties to set card icons.

[Appearance and disabled](./demo/appearance.tsx?show=vertical)

- Themes, sizes, shapes, and disabled states.

## CheckCard API

| Property       | Description                   | Type                                  | Default |
| -------------- | ----------------------------- | ------------------------------------- | ------- |
| checked        | Controlled checked state      | boolean                               | -       |
| defaultChecked | Initial checked state         | boolean                               | false   |
| value          | Option value inside a group   | string \| number                      | -       |
| title          | Title                         | ReactNode                             | -       |
| description    | Description                   | ReactNode                             | -       |
| symbol         | Unchecked symbol              | IconType[]                            | -       |
| checkedSymbol  | Checked symbol                | IconType[]                            | -       |
| showIndicator  | Whether to show the indicator | boolean                               | true    |
| disabled       | Whether disabled              | boolean                               | false   |
| readOnly       | Whether read-only             | boolean                               | false   |
| theme          | Theme                         | outline\|fill                         | outline |
| size           | Size                          | small\|medium\|large                  | medium  |
| shape          | Shape                         | round\|circle\|square                 | round   |
| onChange       | State change callback         | (event: CheckCardChangeEvent) => void | -       |

## CheckCardGroup API

| Property     | Description             | Type                            | Default    |
| ------------ | ----------------------- | ------------------------------- | ---------- |
| value        | Controlled value        | string\|number                  | -          |
| defaultValue | Initial value           | string\|number                  | -          |
| options      | Options                 | CheckCardOption[]               | -          |
| disabled     | Whether disabled        | boolean                         | false      |
| readOnly     | Whether read-only       | boolean                         | false      |
| direction    | Layout direction        | horizontal\|vertical            | horizontal |
| theme        | Card theme              | outline\|fill                   | outline    |
| size         | Card size               | small\|medium\|large            | medium     |
| shape        | Card shape              | round\|circle\|square           | round      |
| onChange     | Selected value callback | (value: string\|number) => void | -          |

## CheckCardOption

| Property      | Description                     | Type           | Default |
| ------------- | ------------------------------- | -------------- | ------- |
| value         | Option value                    | string\|number | -       |
| title         | Title                           | ReactNode      | -       |
| description   | Description                     | ReactNode      | -       |
| symbol        | Unchecked symbol                | IconType[]     | -       |
| checkedSymbol | Checked symbol                  | IconType[]     | -       |
| disabled      | Whether this option is disabled | boolean        | false   |
