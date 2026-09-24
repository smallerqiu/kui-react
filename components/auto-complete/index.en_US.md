# AutoComplete

`value` initializes the component and synchronizes later external changes. User interaction updates the local value and emits `onChange`, even when `value` is a fixed literal or `onChange` only observes changes. Use `value={state}` with `onChange={setState}` to synchronize parent state. A rerender with the same value does not reset local edits; arrays should be updated immutably.

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

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| value | value | `string` | - |
| options | Suggestions | `(string \| AutoCompleteOption)[]` | [] |
| open | open state | `boolean` | - |
| showOnEmpty | Show suggestions for an empty focused input | `boolean` | false |
| clearable | Show clear button on hover | `boolean` | false |
| disabled | Disabled | boolean | false |
| readOnly | Read-only; prevents editing, clearing and opening | boolean | false |
| placeholder | Placeholder | string | - |
| loading | Loading state | `boolean` | false |
| loadingText | Loading text | `string` | Loading |
| size | Size | `"small" \| "medium" \| "large"` | medium |
| theme | Theme | `"dashed" \| "solid" \| "default" \| "fill" \| "outline" \| "plain" \| "underlined"` | fill |
| shape | Shape | `"round" \| "default" \| "square" \| "circle"` | default |
| filterOption | Filter strategy | `boolean \| ((input: string, option: AutoCompleteOption) => boolean)` | true |
| onChange | Value change | `((value: string) => void)` | - |
| onClear | Clear callback | `(() => void)` | - |
| onSearch | Search callback | `((value: string) => void)` | - |
| onSelect | Option selection | `((value: string, option: AutoCompleteOption) => void)` | - |
| onOpenChange | Open state change | `((open: boolean) => void)` | - |
