# FeatureCard 功能卡片

用于简洁地展示产品特性、功能入口或能力说明。

[基础用法](./demo/basic.tsx?show=vertical)

- 展示包含图标、标题和描述的基础功能卡片。

[边框](./demo/bordered.tsx?show=vertical)

- 通过 `bordered` 控制是否显示边框。

[尺寸](./demo/size.tsx?show=vertical)

- 使用 `size` 同步调整内边距、图标和文字尺寸。

[功能入口](./demo/interactive.tsx?show=vertical)

- 组合 `direction="vertical"` 与 `clickable` 创建具有键盘交互能力的功能入口。

## API

| 属性           | 说明                                        | 类型                    | 默认值     |
| -------------- | ------------------------------------------- | ----------------------- | ---------- |
| icon           | 图标或自定义图标节点                        | IconType[] \| ReactNode | -          |
| title          | 标题                                        | ReactNode               | -          |
| desc           | 描述                                        | ReactNode               | -          |
| extra          | 右侧扩展区域                                | ReactNode               | -          |
| bordered       | 是否显示边框                                | boolean                 | false      |
| theme          | 外观主题                                    | ThemeType               | fill       |
| shape          | 卡片形状                                    | ShapeType               | round      |
| size           | 卡片尺寸                                    | small\|medium\|large    | medium     |
| direction      | 内容排列方向                                | horizontal\|vertical    | horizontal |
| clickable      | 是否可交互；启用键盘及按钮语义              | boolean                 | false      |
| disabled       | 是否禁用交互                                | boolean                 | false      |
| color          | 图标强调色                                  | string                  | primary    |
| iconBackground | 图标容器背景；未设置时根据 `color` 自动生成 | string                  | 自动       |

## Events

| 事件名  | 说明       | 回调参数                    |
| ------- | ---------- | --------------------------- |
| onClick | 点击时触发 | (event: MouseEvent) => void |
