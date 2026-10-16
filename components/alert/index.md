# Alert 警告提示

警告提示，展现需要关注的信息。

## 何时使用

- 当某个页面需要向用户显示警告的信息时。
- 非浮层的静态展现形式，始终展现，不会自动消失，用户可以点击关闭。

## 代码演示

[基本用法](./demo/basic.tsx)

- 通过 `type` 来控制展示类型

[图标](./demo/icon.tsx)

- `showIcon` 来设置是否显示图标

[可关闭](./demo/close.tsx)

- `closable` 来控制是否显示可关闭按钮,关闭时播放退出动画

[自定义图标](./demo/custom-icon.tsx)

- `showIcon` 来设置是否显示图标

## 关闭

点击关闭按钮时触发 `onClose`，退出动画结束后移除内容并触发 `onAfterClose`。

如需在关闭后卸载整个组件，可在 `onAfterClose` 中更新父级状态，并通过条件渲染控制组件。

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 按钮类型，可选值为 `success`、`info`、`warning`、`error` 或者不设置 | `"info" \| "success" \| "warning" \| "error"` | warning |
| message | 警告提示内容 | `React.ReactNode` | - |
| description | 警告提示的辅助性文字介绍 | `React.ReactNode` | - |
| showIcon | 是否显示图标 | `boolean` | false |
| bordered | 是否展示边框 | `boolean` | false |
| theme | 外观主题 | `"dashed" \| "solid" \| "fill" \| "outline" \| "plain" \| "underlined"` | fill |
| shape | 形状 | `"round" \| "default" \| "square" \| "circle"` | - |
| closable | 是否显示关闭按钮 | `boolean` | false |
| onClose | 点击关闭按钮时触发 | `((e: React.MouseEvent<HTMLElement>) => void)` | - |
| onAfterClose | 退出动画结束后触发 | `(() => void)` | - |
| icon | 自定义的图标 | `IconType[]` | - |

## 主题

`theme` 支持 `fill`、`outline`、`plain`、`solid`、`dashed` 五种外观，不写 `theme` 时就是 `fill`；`underlined` 是给可输入的控件用的，提示条会按 `fill` 呈现。

提示条的颜色由 `type` 决定，`theme` 决定它显示到什么程度：`fill` 是那一色的浅底，`solid` 把同一色铺满并把文字、图标和关闭按钮一起反白，所以 `error` 和 `success` 在 `solid` 下仍是两种颜色，不会一起变成主色。`outline` 和 `plain` 不带底色，描边走库的边框色；`dashed` 只把外框换成虚线。`bordered` 管的是另一件事：把提示条自己的那层浅底挪到边框上。
