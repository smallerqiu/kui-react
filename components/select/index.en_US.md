# Select

Dropdown selector.

## When to Use

- Pop up a dropdown menu for user selection operations, used to replace native selectors, or when a more elegant multi-selector is needed.
- When there are few options (less than 5), it is recommended to lay out the options directly. Using Radio is a better choice.

## Examples

[Single Selection](./demo/basic.tsx)

- Use `value` and `onChange` to control the selected value.

[Multiple Selection](./demo/multiple.tsx)

- Set the `multiple` value to present multi-select mode.

[Disabled and Non-clearable](./demo/disabled.tsx)

- For multiple selection, use an array `value` with `onChange`.

[Filtering and Searching](./demo/filterable.tsx)

- Set the `filterable` value to present filtering mode. > `filterable` and `onSearch` cannot be used simultaneously; search results will be filtered.

[Size](./demo/size.tsx)

- Control component size via `width` and `size`.

[Weird Definition](./demo/theme.tsx)

- Some strange things.

## Select API

| Property     | Description                                                                       | Type                                       | Default       |
| ------------ | --------------------------------------------------------------------------------- | ------------------------------------------ | ------------- |
| value        | Controlled selected value                                                        | string, number, (string\|number)[]         | -             |
| defaultValue | Initial selected value in uncontrolled mode                                      | string, number, (string\|number)[]         | -             |
| open         | Controlled dropdown visibility                                                    | boolean                                    | -             |
| defaultOpen  | Initial dropdown visibility in uncontrolled mode                                  | boolean                                    | false         |
| placement    | Dropdown placement                                                                 | DropPlacementsType                         | bottom-left   |
| block        | Whether to fill the parent width                                                   | boolean                                    | false         |
| filterable   | Whether search filtering is enabled                                                | boolean                                    | false         |
| loadingText  | Loading-state text                                                                 | string                                     | -             |
| arrowIcon    | Custom dropdown arrow icon                                                         | IconType[]                                 | -             |
| width        | Component width                                                                   | string, number                             | -             |
| placeholder  | Default text of selector                                                          | string                                     | Please select |
| disabled     | Whether current item is disabled                                                  | boolean                                       | false         |
| size         | Component size, provides two sizes: `small`, `large`, default is normal           | string                                     | -             |
| emptyText    | Prompt displayed when no data                                                     | string                                     | 'No data yet' |
| maxTagCount  | Maximum number of tags to display, excess shown with ellipsis                     | number                                     | -             |
| multiple     | Whether to display in multiple selection mode                                     | boolean                                       | false         |
| loading      | Whether to show asynchronous loading                                              | boolean                                       | false         |
| clearable    | Whether options can be cleared                                                    | boolean                                       | false         |
| bordered     | Whether to show border                                                            | boolean                                       | true          |
| extendWidth  | Whether dropdown width matches input width                                        | boolean                                       | true          |
| showArrow    | Whether to show dropdown button                                                   | boolean                                       | true          |
| options      | options data, if set, no need to manually construct Option nodes                  | SelectOption[]                             | []            |
| theme        | The theme of Select                                                               | string                                     | fill          |
| icon         | Custom icon                                                                       | string                                     | -             |
| shape        | When shape='circle', displays rounded corners                                     | string                                     | -             |
| onSelect     | Triggered when an item is selected                                                | (option: SelectOption) => void             | -             |
| onChange     | Triggered when option state changes, returns selected value                       | (value: string \| number \| any[]) => void | -             |
| onOpenChange | Triggered when dropdown expands or collapses                                      | (open: boolean) => void                    | -             |
| onSearch     | Triggered during search                                                           | (e: InputEvent) => void                    | -             |
| onClear      | Triggered when the clear button is clicked                                        | () => void                                 | -             |

## Option API

| Property | Description                                           | Type           | Default |
| -------- | ----------------------------------------------------- | -------------- | ------- |
| key      | Same meaning as value.                                | string, number | -       |
| value    | Option value, used for filtering by default, required | string, number | -       |
| label    | Option display content                                | string, number | -       |
| disabled | Whether current item is disabled                      | boolean           | false   |
