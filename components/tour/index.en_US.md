# Tour

Introduces real interface targets one step at a time without owning business state.

## Examples

[Basic](./demo/basic.tsx)

[Controlled](./demo/controlled.tsx)
[Mask](./demo/mask.tsx)
[Placement](./demo/placement.tsx)

## Tour API

| Property       | Description           | Type       | Default |
| -------------- | --------------------- | ---------- | ------- |
| open           | Controlled visibility | boolean    | -       |
| defaultOpen    | Initial visibility    | boolean    | false   |
| current        | Controlled step       | number     | -       |
| defaultCurrent | Initial step          | number     | 0       |
| steps          | Tour steps            | TourStep[] | -       |
| mask           | Show mask             | boolean    | true    |
| closable       | Show close action     | boolean    | true    |
| onChange       | Step change           | function   | -       |
| onOpenChange   | Visibility change     | function   | -       |
| onFinish       | Tour completed        | function   | -       |
