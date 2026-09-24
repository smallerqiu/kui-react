# StatCard

Statistical indicators, can set title, value, description.

## When to Use

Can be used in BI/Dashboard scenarios, business backend oriented, intuitive.

## Examples

[Card Display](./demo/card.tsx?show=vertical)

- Used in Dashboard scenarios. Combined with `Grid`, it can adapt well to various devices.

[Trend Information](./demo/trend.tsx?show=vertical)

- Use `trend` for supplementary information and `trendStatus` for its status color; cards remain equal-height in a Grid when some items omit the trend.

[Combination Display](./demo/with-card.tsx)

- Show more custom data combined with the `Card` component

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| title | Card title | `ReactNode` | - |
| items | Data to display | `StatNumberItem[]` | [] |
| precision | Numerical precision | `number` | 0 |
| statNumberType | Numerical change type | `"rollup" \| "countup"` | 'countup' |
| separator | Separator | `string` | - |
| reverse | Whether to reverse number/number description arrangement | `boolean` | false |
| bordered | Show border or not | `boolean` | false |
| theme | Theme | `"fill" \| "outline" \| "plain"` | fill |
| shape | Shape | `"round" \| "default" \| "square" \| "circle"` | round |
| size | Size | `"small" \| "medium" \| "large"` | medium |
| prefix | Default prefix for all values | `ReactNode` | - |
| suffix | Default suffix for all values | `ReactNode` | - |

### items Options

| Property        | Description                                       | Type                                      | Default |
| --------------- | ------------------------------------------------- | ----------------------------------------- | ------- |
| key             | Unique key used to preserve animation state       | string \| number                          | -       |
| value           | Numerical value                                   | number                                    | -       |
| desc            | Numerical description                             | ReactNode                                 | -       |
| trend           | Trend or supporting content                       | ReactNode                                 | -       |
| trendStatus     | Trend status                                      | `default \| success \| danger \| warning` | default |
| prefix          | Prefix content of numerical value                 | ReactNode                                 | -       |
| suffix          | Suffix content of numerical value                 | ReactNode                                 | -       |
| precision       | Numerical precision                               | number                                    | 0       |
| separator       | Separator                                         | string                                    | -       |
| duration        | Numerical dynamic display time (seconds)          | number                                    | 1.2     |
| autoAnimate     | Trigger animation when target becomes visible     | boolean                                   | true    |
| autoAnimateOnce | Run animation only once for auto-animate triggers | boolean                                   | true    |

For standalone animated values, formatting, and animation controls, see [StatNumber](/components/stat-number-en).
