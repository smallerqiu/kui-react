# InputNumber 数字输入框

通过鼠标或键盘，输入范围内的数值。

## 何时使用

当需要获取标准数值时。

## 代码演示

[基本用法](./demo/basic.tsx)

- 基本用法 ,使用 keyboard 属性可以控制键盘行为。

[高精度小数/格式化展示](./demo/format.tsx)

- 通过 formatter 格式化数字，以展示具有具体含义的数据，往往需要配合 parser 一起使用。

[扩展, 前缀和后缀](./demo/ffix.tsx)

- suffix，prefix 扩展

[尺寸](./demo/size.tsx)

- `large` 为大尺寸， `small` 为小尺寸

## InputNumber API

| 属性       | 说明                                                       | 类型                                | 默认值    |
| ---------- | ---------------------------------------------------------- | ----------------------------------- | --------- |
| min        | 最小值                                                     | number                              | -Infinity |
| max        | 最大值                                                     | number                              | Infinity  |
| step       | 每次改变步数，可以为小数                                   | number,string                       | 1         |
| value      | InputNumber 的受控值                                      | number,string                       | -         |
| defaultValue | 非受控模式的初始值                                      | number,string                       | -         |
| formatter  | 指定输入框展示值的格式                                     | (value: string \| number) => string | -         |
| parser     | 指定从 formatter 里转换回数字的方式，和 formatter 搭配使用 | (value: string) => string \| number | -         |
| size       | 输入框大小                                                 | string                              | -         |
| disabled   | 禁用                                                       | boolean                                | false     |
| precision  | 数值精度                                                   | number                              | -         |
| shape      | 组件的外观                                                 | `circle` , `square`                 | -         |
| suffix     | 自定义后缀                                                 | string,ReactNode                         | -         |
| prefix     | 前缀内容                                                   | string,ReactNode                         | -         |
| controls   | 是否显示增减按钮                                           | boolean                                | true      |
| clearable  | 是否显示清除按钮                                           | boolean                                | false     |
| theme      | 组件呈现主题                                               | string                              | fill      |
| onChange   | 变化回调                                                   | (value: number) => void             | -         |
