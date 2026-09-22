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

| 属性         | 说明                                                                | 类型                                           | 默认值  |
| ------------ | ------------------------------------------------------------------- | ---------------------------------------------- | ------- |
| type         | 按钮类型，可选值为 `success`、`info`、`warning`、`error` 或者不设置 | string                                         | warning |
| message      | 警告提示内容                                                        | string，ReactNode                              | -       |
| description  | 警告提示的辅助性文字介绍                                            | string                                         | -       |
| showIcon     | 是否显示图标                                                        | boolean                                        | false   |
| bordered     | 是否展示边框                                                        | boolean                                        | false   |
| theme        | 主题                                                                | ThemeType                                      | -       |
| shape        | 形状                                                                | ShapeType                                      | -       |
| closable     | 是否显示关闭按钮                                                    | boolean                                        | false   |
| onClose      | 点击关闭按钮时触发                                                  | (event: React.MouseEvent<HTMLElement>) => void | -       |
| onAfterClose | 退出动画结束后触发                                                  | () => void                                     | -       |
| icon         | 自定义的图标                                                        | IconPath[]                                     | -       |
