# Mentions

Insert structured mentions into multiline text.

## Examples

[Basic](./demo/basic.tsx)

- Type @ and select a mention with the keyboard.

[Triggers](./demo/triggers.tsx)

- Supports both people and topic triggers.

[Filter](./demo/filter.tsx)

- Customize suggestion matching.

[Remote Search](./demo/remote.tsx?show=vertical)

- Load mention options asynchronously after entering a trigger character.

[Size](./demo/size.tsx?show=vertical)

- Shows small, medium, and large sizes.

[Appearance](./demo/appearance.tsx)

- Shows different input appearances.

[Empty](./demo/empty.tsx)

- Displays Empty when no mention matches.

[Rows](./demo/rows.tsx)

- Controls the input height with `rows`.

[Placement](./demo/placement.tsx)

- Anchors the menu to the caret and flips it when space is insufficient.

## Mentions API

| Property     | Description                  | Type                           | Default     |
| ------------ | ---------------------------- | ------------------------------ | ----------- |
| value        | Controlled text              | string                         | -           |
| defaultValue | Initial text                 | string                         | ''          |
| options      | Suggestions                  | (string\|MentionOption)[]      | []          |
| triggers     | Trigger strings              | string[]                       | ['@']       |
| rows         | Textarea rows                | number                         | 2           |
| placement    | Preferred dropdown placement | DropPlacementsType             | bottom-left |
| size         | Size                         | small\|medium\|large           | medium      |
| theme        | Theme                        | fill\|outline\|plain           | fill        |
| shape        | Shape                        | circle\|square\|round\|default | default     |
| emptyText    | Empty-state text             | string                         | No data     |
| loading      | Whether to show loading      | boolean                       | false       |
| loadingText  | Loading text                 | string                        | Searching   |
| clearable    | Whether to show the clear button | boolean                    | true        |
| filterOption | Custom filter                | function                       | -           |
| onChange     | Text change                  | function                       | -           |
| onSelect     | Mention selected             | function                       | -           |
| onSearch     | Search query changed         | function                       | -           |
| onClear      | Clear button clicked         | function                       | -           |
