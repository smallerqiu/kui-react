# ColorPicker 颜色选择器

可以自由的输出颜色。

## 何时使用

- 需要自定义颜色时

## 代码演示

[基本用法](./demo/basic.tsx)

- 点击打开颜色面板

[尺寸大小 / 不可用](./demo/size.tsx)

- `small` 为小尺寸， `large` 为大尺寸

[自定义触发器](./demo/custom-trigger.tsx)

- 自定义颜色面板的触发器。

[弹出位置](./demo/placement.tsx)

- 支持 6 个弹出位置 , 如果上面的空间不够，色盘会自动在下面展示

## API

| 属性          | 说明                                               | 类型                      | 默认值      |
| ------------- | -------------------------------------------------- | ------------------------- | ----------- |
| value         | 受控颜色值                                         | `string`                  | -           |
| defaultValue  | 非受控初始颜色值                                   | `string`                  | `#000000ff` |
| open          | 受控的弹层显示状态                                 | `boolean`                 | -           |
| defaultOpen   | 非受控模式的初始弹层状态                           | `boolean`                 | `false`     |
| mode          | 颜色展示类型，支持 `hex`、`rgb`、`hsl`             | `ColorMode`               | `hex`       |
| presets       | 自定义颜色盘                                       | `string[]`                | 内置色盘    |
| disabledAlpha | 是否禁用透明度                                     | `boolean`                 | `false`     |
| disabled      | 是否禁用                                           | `boolean`                 | `false`     |
| trigger       | 弹层触发方式                                       | `hover \| click`          | `click`     |
| showText      | 是否展示颜色文字                                   | `boolean`                 | `false`     |
| size          | 颜色选择器尺寸                                     | `SizeType`                | -           |
| placement     | 弹层位置                                           | `DropPlacementsType`      | `bottom-left` |
| children      | 自定义触发元素                                     | `ReactNode`               | -           |
| onUpdateMode  | 颜色模式更新时触发                                 | `(mode: ColorMode) => void` | -         |
| onChange      | 颜色值改变时触发                                   | `(color: string) => void` | -           |
| onOpenChange  | 颜色选择器展开或收起时触发                         | `(open: boolean) => void` | -           |
