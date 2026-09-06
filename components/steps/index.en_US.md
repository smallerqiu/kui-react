# Steps

Displays progress through a task or workflow.

## Examples

[Basic](./demo/basic.tsx?show=vertical)

- Supports data items, clickable steps, and vertical layout.

[Vertical](./demo/vertical.tsx?show=vertical)

- Presents detailed workflows vertically.

[Statuses](./demo/status.tsx?show=vertical)

- Shows error and per-step custom statuses.

[Clickable steps](./demo/clickable.tsx?show=vertical)

- Handle change to switch the current step.

[Custom icons](./demo/icon.tsx?show=vertical)

- Sets a custom icon for each step.

[Controlled](./demo/controlled.tsx?show=vertical)

- Controls the current step with external state and buttons.

## Steps API

| Property  | Description    | Type                       | Default      |
| --------- | -------------- | -------------------------- | ------------ |
| current   | Current step   | number                     | 0            |
| direction | Direction      | `horizontal` \| `vertical` | `horizontal` |
| status    | Current status | `process` \| `error`       | `process`    |
| items     | Step data      | StepProps[]                | -            |
| onChange  | Step click     | (current: number) => void  | -            |

## Step API

| Property    | Description      | Type       | Default |
| ----------- | ---------------- | ---------- | ------- |
| title       | Step title       | ReactNode  | -       |
| description | Step details     | ReactNode  | -       |
| icon        | Custom marker    | ReactNode  | -       |
| status      | Step status      | StepStatus | -       |
| disabled    | Disable clicking | boolean    | false   |
