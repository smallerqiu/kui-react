# StatCard 统计卡片

统计指标,可设置标题 , 数值 , 描述

## 何时使用

可在 BI / Dashboard 场景 使用 , 偏业务后台，直观

## 代码演示

[卡片展示](./demo/card.tsx?show=vertical)

- 用于 Dashboard 场景 , 结合 `Grid` 可以很好的适配多种设备.

[基本用法](./demo/basic.tsx)

- 只展示数字

[组合展示](./demo/with-card.tsx)

[趋势状态](./demo/trend.tsx?show=vertical)

- 结合`Card` 组件展示更多自定义数据

## API

| 属性           | 说明                      | 类型              | 默认值    |
| -------------- | ------------------------- | ----------------- | --------- |
| title          | 卡片标题                  | string            | -         |
| items          | 展示的数据                | StatNumberItem[]  | []        |
| precision      | 数值精度                  | number            | 0         |
| statNumberType | 数值变化类型              | `rollup, countup` | 'countup' |
| separator      | 分隔符                    | string            | -         |
| reverse        | 数值/数值描述是否反相排列 | boolean              | false     |
| bordered       | 是否显示边框              | boolean              | false     |
| theme          | 主题                      | ThemeType            | -         |
| shape          | 形状                      | ShapeType            | -         |

### items Options

| 属性            | 说明                         | 类型   | 默认值 |
| --------------- | ---------------------------- | ------ | ------ |
| value           | 数值                         | number | -      |
| desc            | 数值描述                     | string | []     |
| prefix          | 数值的前置内容               | string | -      |
| suffix          | 数值的后置内容               | string | -      |
| precision       | 数值精度                     | number | 0      |
| separator       | 分隔符                       | string | -      |
| duration        | 数值动态展示时间(秒)         | number | 1.2    |
| autoAnimate     | 当目标可见时触发动画         | boolean   | true   |
| autoAnimateOnce | 自动动画触发器仅运行一次动画 | boolean   | true   |

## StatNumber API

| 属性            | 说明                         | 类型              | 默认值    |
| --------------- | ---------------------------- | ----------------- | --------- |
| value           | 数值                         | number            | -         |
| duration        | 数值动态展示时间(秒)         | number            | 1.2       |
| prefix          | 数值的前置内容               | string            | -         |
| suffix          | 数值的后置内容               | string            | -         |
| precision       | 数值精度                     | number            | 0         |
| type            | 数值变化类型                 | `rollup, countup` | 'countup' |
| separator       | 分隔符                       | string            | -         |
| autoAnimate     | 当目标可见时触发动画         | boolean              | true      |
| autoAnimateOnce | 自动动画触发器仅运行一次动画 | boolean              | true      |
