# Mentions

Insert structured mentions into multiline text.

## Examples

[Basic](./demo/basic.tsx)

[Triggers](./demo/triggers.tsx)
[Filter](./demo/filter.tsx)
[Appearance](./demo/appearance.tsx)
[Empty](./demo/empty.tsx)
[Rows](./demo/rows.tsx)
[Placement](./demo/placement.tsx)

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
| filterOption | Custom filter                | function                       | -           |
| onChange     | Text change                  | function                       | -           |
| onSelect     | Mention selected             | function                       | -           |
