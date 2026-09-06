# InputNumber

Input values within a range via mouse or keyboard.

## When to Use

When standard numerical values need to be obtained.

## Examples

[Basic Usage](./demo/basic.tsx)

- Basic usage. The `keyboard` attribute can control keyboard behavior.

[High-Precision Decimals / Formatted Display](./demo/format.tsx)

- Format numbers using `formatter` to display data with specific meaning, often used in conjunction with `parser`.

[Extension, Prefix and Suffix](./demo/ffix.tsx)

- suffix, prefix extension

[Size](./demo/size.tsx)

- `large` for large size, `small` for small size

## InputNumber API

| Property     | Description                                                                 | Type                                 | Default   |
| ------------ | --------------------------------------------------------------------------- | ------------------------------------ | --------- |
| min          | Minimum value                                                               | number                               | -Infinity |
| max          | Maximum value                                                               | number                               | Infinity  |
| step         | Step value for each change, can be a decimal                                | number \| string                     | 1         |
| value        | Controlled InputNumber value                                                | number \| string                     | -         |
| defaultValue | Initial value in uncontrolled mode                                          | number \| string                     | -         |
| formatter    | Specifies the format of the value displayed in the input box                | (value: string \| number) => string  | -         |
| parser       | Specifies how to convert back from formatter to number, used with formatter | (value: string) => string \| number  | -         |
| size         | Input box size                                                              | SizeType                             | -         |
| disabled     | Disabled                                                                    | boolean                              | false     |
| readOnly     | Whether the input is read-only                                              | boolean                              | false     |
| placeholder  | Input placeholder                                                           | string                               | -         |
| icon         | Input icon                                                                  | IconType[]                           | -         |
| precision    | Numerical precision                                                         | number                               | -         |
| shape        | Component appearance                                                        | ShapeType                            | -         |
| suffix       | Custom suffix                                                               | ReactNode                            | -         |
| prefix       | Prefix content                                                              | ReactNode                            | -         |
| controls     | Whether to show increase/decrease buttons                                   | boolean                              | true      |
| keyboard     | Whether the value can be adjusted with the up/down arrow keys               | boolean                              | true      |
| theme        | Component theme                                                             | ThemeType                            | fill      |
| onChange     | Change callback; returns `undefined` when cleared                           | (value: number \| undefined) => void | -         |
