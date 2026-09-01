# AutoComplete

Suggest options while keeping free-form input available.

## Examples

[Basic](./demo/basic.tsx)

- Supports free input, filtering, and keyboard selection.

[Controlled](./demo/controlled.tsx)

- Control the input externally with `value` and `onChange`.

[Filter](./demo/filter.tsx)

- Define suggestion matching with `filterOption`.

[Appearance](./demo/appearance.tsx)

- Shows different `size`, `theme`, and `shape` combinations.

[Show on empty](./demo/show-on-empty.tsx)

- Keep the dropdown closed for empty input by default, or enable `showOnEmpty`.

[Remote search](./demo/remote.tsx)

- Fetch remote suggestions with `onSearch` and display progress with `loading`.

## AutoComplete API

| Property     | Description                                 | Type                           | Default |
| ------------ | ------------------------------------------- | ------------------------------ | ------- |
| value        | Controlled value                            | string                         | -       |
| defaultValue | Initial value                               | string                         | -       |
| options      | Suggestions                                 | (string\|AutoCompleteOption)[] | []      |
| open         | Controlled open state                       | boolean                        | -       |
| defaultOpen  | Initial open state                          | boolean                        | false   |
| showOnEmpty  | Show suggestions for an empty focused input | boolean                        | false   |
| clearable    | Show clear button on hover                  | boolean                        | false   |
| loading      | Loading state                               | boolean                        | false   |
| loadingText  | Loading text                                | string                         | Loading |
| size         | Size                                        | small\|medium\|large           | medium  |
| theme        | Theme                                       | fill\|outline\|plain           | fill    |
| shape        | Shape                                       | circle\|square\|round\|default | default |
| filterOption | Filter strategy                             | boolean\|function              | true    |
| onChange     | Value change                                | function                       | -       |
| onClear      | Clear callback                              | function                       | -       |
| onSearch     | Search callback                             | function                       | -       |
| onSelect     | Option selection                            | function                       | -       |
| onOpenChange | Open state change                           | function                       | -       |
