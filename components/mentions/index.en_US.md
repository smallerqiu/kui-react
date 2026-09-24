# Mentions

`value` initializes the component and synchronizes later external changes. User interaction updates the local value and emits `onChange`, even when `value` is a fixed literal or `onChange` only observes changes. Use `value={state}` with `onChange={setState}` to synchronize parent state. A rerender with the same value does not reset local edits; arrays should be updated immutably.

Insert structured mentions into multiline text.

## Examples

[Basic](./demo/basic.tsx)

- Type @ and select a mention with the keyboard.

[Triggers](./demo/triggers.tsx)

- Supports both people and topic triggers.

[Filter](./demo/filter.tsx)

- Customize suggestion matching.

[Remote Search](./demo/remote.tsx?show=vertical)

- Enter at least one character after a trigger to call `onSearch` and load options asynchronously.

[Size](./demo/size.tsx?show=vertical)

- Shows small, medium, and large sizes.

[Appearance](./demo/appearance.tsx)

- Shows different input appearances.

[Empty](./demo/empty.tsx)

- Displays Empty when no mention matches.

[Rows](./demo/rows.tsx)

- Controls the input height with `rows`; use 1 for a single-line input appearance.

[Placement](./demo/placement.tsx)

- Anchors the menu to the caret and flips it when space is insufficient.

## Mentions API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| value | text | `string` | - |
| options | Suggestions | `(string \| MentionOption)[]` | [] |
| triggers | Trigger strings | `string[]` | ['@'] |
| rows | Textarea rows | `number` | 1 |
| placement | Preferred dropdown placement | `"top" \| "top-left" \| "top-right" \| "bottom" \| "bottom-left" \| "bottom-right"` | bottom-left |
| size | Size | `"small" \| "medium" \| "large"` | medium |
| theme | Theme | `"dashed" \| "solid" \| "default" \| "fill" \| "outline" \| "plain" \| "underlined"` | fill |
| shape | Shape | `"round" \| "default" \| "square" \| "circle"` | default |
| emptyText | Empty-state text | `string` | No data |
| loading | Whether to show loading | `boolean` | false |
| loadingText | Loading text | `string` | - |
| clearable | Whether to show the clear button | `boolean` | true |
| filterOption | Custom filter | `((query: string, option: MentionOption) => boolean)` | - |
| onChange | Text change | `((value: string) => void)` | - |
| onSelect | Mention selected | `((option: MentionOption, trigger: string) => void)` | - |
| onSearch | Remote search with query and trigger | `((query: string, trigger: string) => void)` | - |
| onClear | Clear button clicked | `(() => void)` | - |
