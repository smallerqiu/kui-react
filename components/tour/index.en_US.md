# Tour

Introduces real interface targets one step at a time without owning business state.

## Examples

[Basic](./demo/basic.tsx)

- Positions each guide step around a real page target.

[Controlled](./demo/controlled.tsx)

- Controls visibility and the current step externally.

[Mask](./demo/mask.tsx)

- Controls whether the page mask is displayed.

[Placement](./demo/placement.tsx)

- Places guide cards around different targets.

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
