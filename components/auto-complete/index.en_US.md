# AutoComplete

Suggest options while keeping free-form input available.

## Examples

[Basic](./demo/basic.tsx)

[Controlled](./demo/controlled.tsx)
[Filter](./demo/filter.tsx)
[Appearance](./demo/appearance.tsx)
[Show on empty](./demo/show-on-empty.tsx)
[Remote search](./demo/remote.tsx)

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
