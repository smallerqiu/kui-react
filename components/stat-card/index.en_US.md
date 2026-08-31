# StatCard

Statistical indicators, can set title, value, description.

## When to Use

Can be used in BI/Dashboard scenarios, business backend oriented, intuitive.

## Examples

[Card Display](./demo/card.tsx?show=vertical)

- Used in Dashboard scenarios. Combined with `Grid`, it can adapt well to various devices.

[Basic Usage](./demo/basic.tsx)

- Display Numbers Only

[Combination Display](./demo/with-card.tsx)

[Trend Status](./demo/trend.tsx?show=vertical)

- Show more custom data combined with the `Card` component

## API

| Property       | Description                                              | Type                | Default   |
| -------------- | -------------------------------------------------------- | ------------------- | --------- |
| title          | Card title                                               | string              | -         |
| items          | Data to display                                          | StatNumberItem[]    | []        |
| precision      | Numerical precision                                      | number              | 0         |
| statNumberType | Numerical change type                                    | `rollup`, `countup` | 'countup' |
| separator      | Separator                                                | string              | -         |
| reverse        | Whether to reverse number/number description arrangement | boolean                | false     |
| bordered       | Show border or not                                       | boolean                | false     |
| theme          | Theme                                                    | ThemeType              | -         |
| shape          | Shape                                                    | ShapeType              | -         |

### items Options

| Property        | Description                                       | Type   | Default |
| --------------- | ------------------------------------------------- | ------ | ------- |
| value           | Numerical value                                   | number | -       |
| desc            | Numerical description                             | string | []      |
| prefix          | Prefix content of numerical value                 | string | -       |
| suffix          | Suffix content of numerical value                 | string | -       |
| precision       | Numerical precision                               | number | 0       |
| separator       | Separator                                         | string | -       |
| duration        | Numerical dynamic display time (seconds)          | number | 1.2     |
| autoAnimate     | Trigger animation when target becomes visible     | boolean   | true    |
| autoAnimateOnce | Run animation only once for auto-animate triggers | boolean   | true    |

## StatNumber API

| Property        | Description                                       | Type                | Default   |
| --------------- | ------------------------------------------------- | ------------------- | --------- |
| value           | Numerical value                                   | number              | -         |
| duration        | Numerical dynamic display time (seconds)          | number              | 1.2       |
| prefix          | Prefix content of numerical value                 | string              | -         |
| suffix          | Suffix content of numerical value                 | string              | -         |
| precision       | Numerical precision                               | number              | 0         |
| type            | Numerical change type                             | `rollup`, `countup` | 'countup' |
| separator       | Separator                                         | string              | -         |
| autoAnimate     | Trigger animation when target becomes visible     | boolean                | true      |
| autoAnimateOnce | Run animation only once for auto-animate triggers | boolean                | true      |
