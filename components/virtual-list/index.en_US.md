# VirtualList

Only renders data near the viewport to optimize large-list rendering performance.

## Examples

[Basic Usage](./demo/basic.tsx?show=vertical)

- Renders many fixed-height items with a small overscan buffer.

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| data | List data | unknown[] | [] |
| height | Viewport height | number\|string | 300 |
| itemHeight | Fixed item height | number | 32 |
| overscan | Extra items rendered above and below the viewport | number | 5 |
| itemKey | Unique field or key getter | string\|((item,index)=>string\|number) | - |
| onScroll | Scroll callback | (event: UIEvent) => void | - |

## Methods

| Name | Description | Parameters |
| --- | --- | --- |
| scrollToIndex | Scroll to an item | (index, align?) |