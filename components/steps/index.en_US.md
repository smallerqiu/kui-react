# Steps

Displays progress through a task or workflow.

## Examples

[Basic](./demo/basic.tsx?show=vertical)

[Vertical](./demo/vertical.tsx?show=vertical)
[Statuses](./demo/status.tsx?show=vertical)
[Clickable](./demo/clickable.tsx?show=vertical)
[Custom icons](./demo/icon.tsx?show=vertical)
[Controlled](./demo/controlled.tsx?show=vertical)

## Steps API

| Property  | Description      | Type                 | Default    |
| --------- | ---------------- | -------------------- | ---------- |
| current   | Current step     | number               | 0          |
| direction | Layout direction | horizontal\|vertical | horizontal |
| status    | Current status   | process\|error       | process    |
| items     | Step data        | StepProps[]          | -          |
| onChange  | Clicked step     | function             | -          |

## Step API

| Property    | Description      | Type       | Default |
| ----------- | ---------------- | ---------- | ------- |
| title       | Step title       | ReactNode  | -       |
| description | Step details     | ReactNode  | -       |
| icon        | Custom marker    | ReactNode  | -       |
| status      | Step status      | StepStatus | -       |
| disabled    | Disable clicking | boolean    | false   |
