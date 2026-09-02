# VirtualList

Only renders data near the viewport to optimize large-list rendering performance.

## Examples

[Basic Usage](./demo/basic.tsx?show=vertical)

- Renders many fixed-height items with a small overscan buffer.

## Usage in Components

[Usage in Select](../select/demo/virtual.tsx)

- Select uses virtual scrolling for large option sets while preserving keyboard navigation.

[Usage in Table](../table/demo/virtual.tsx?show=vertical)

- Table combines virtual scrolling with a fixed header, horizontal scrolling, stripes, and a fixed column.

[Usage in Tree](../tree/demo/virtual.tsx)

- Tree renders only visible nodes near the current viewport.

[Usage in TreeSelect](../tree-select/demo/virtual.tsx)

- TreeSelect uses virtual scrolling in its dropdown tree for large data sets.

## API

| Property   | Description                                       | Type                                                   | Default |
| ---------- | ------------------------------------------------- | ------------------------------------------------------ | ------- |
| data       | List data                                         | T[]                                                    | []      |
| height     | Viewport height                                   | number \| string                                       | 300     |
| itemHeight | Fixed item height                                 | number                                                 | 32      |
| overscan   | Extra items rendered above and below the viewport | number                                                 | 5       |
| itemKey    | Unique field or key getter                        | string \| (item: T, index: number) => string \| number | -       |
| onScroll   | Scroll callback                                   | (event: UIEvent) => void                               | -       |

## Methods

| Name          | Description       | Parameters      |
| ------------- | ----------------- | --------------- |
| scrollToIndex | Scroll to an item | (index, align?) |
