# Steps

Displays progress through a task or workflow.

## Examples

[Basic](./demo/basic.tsx?show=vertical)

- Basic usage of Steps, showing horizontal step flow

[Vertical](./demo/vertical.tsx?show=vertical)

- Display steps in vertical direction

[Statuses](./demo/status.tsx?show=vertical)

- Display different step statuses (in progress, completed, error, etc.)

[Clickable](./demo/clickable.tsx?show=vertical)

- Steps can be clicked to navigate to corresponding step

[Custom icons](./demo/icon.tsx?show=vertical)

- Customize icons for steps

[Controlled](./demo/controlled.tsx?show=vertical)

- Manage step status in controlled mode

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
