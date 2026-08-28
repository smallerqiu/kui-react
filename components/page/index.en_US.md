# Pagination

Separate long lists using pagination, loading only one page at a time.

## When to Use

- When loading/rendering all data would take a long time.
- When browsing data by switching page numbers.

## Examples

[Basic Usage](./demo/basic.tsx?show=vertical)

- Basic pagination.

[Items / Jump](./demo/sizer-elevator.tsx?show=vertical)

- Change the number of items displayed per page.

[Size](./demo/size.tsx?show=vertical)

- Display small size.

[Simple mode](./demo/simple.tsx?show=vertical)

- Use simple mode for a compact paginator.

## API

| Property     | Description                                                                     | Type                                 | Default          |
| ------------ | ------------------------------------------------------------------------------- | ------------------------------------ | ---------------- |
| page         | Current page number                                                             | number                               | 1                |
| disabled     | Disabled status                                                                 | boolean                                 | false            |
| total        | Total data count                                                                | number                               | 0                |
| pageSize     | number of items per page                                                        | number                               | 10               |
| showSizer    | Whether to show page size selector                                              | boolean                                 | false            |
| showTotal    | Whether to show total count                                                     | boolean                                 | false            |
| showElevator | Whether to show page elevator                                                   | boolean                                 | false            |
| simple       | Whether to use simple pagination mode                                          | boolean                                 | false            |
| shape        | Pagination shape                                                                | ShapeType                               | round            |
| sizeData     | Custom page size data                                                           | number[]                             | [10,15,20,30,40] |
| size         | When value is 'small', displays small size                                      | string                               | -                |
| theme        | The theme of page                                                               | string                               | fill             |
| onChange     | Callback when page number or page size changes, returns the changed page number | (page:number, pageSize:number)=>void | -                |
