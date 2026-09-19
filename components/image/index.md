# Image 图片

可预览的图片。

## 何时使用

- 需要展示图片时使用。
- 加载大图时显示 loading 或加载失败时容错处理。

## 代码演示

[基本用法](./demo/basic.tsx)

- 简单的展示。

[容错处理](./demo/errors.tsx)

- 加载失败显示图像占位符。

[照片墙](./demo/group.tsx)

- 点击左右切换按钮可以预览多张图片。

[扩展](./demo/extra.tsx)

- 可以扩展自定工具和面板。

## Image API

| 属性        | 说明                       | 类型                    | 默认值 |
| ----------- | -------------------------- | ----------------------- | ------ |
| width       | 组件的宽度                 | [string、number]        | -      |
| height      | 组件的高度                 | [string、number]        | -      |
| src         | 图片默认展示的地址         | string                  | -      |
| alt         | 图片替代文本               | string                  | -      |
| data        | 预览图片列表               | string[]                | -      |
| type        | Preview 内容类型           | `'img'` \| `'media'`    | `img`  |
| origin      | 点击图片展示的大图         | string                  | -      |
| placeholder | 图片加载失败时展示的占位符 | string                  | -      |
| imgStyle    | 图片的 style               | Object                  | -      |
| showPanel   | 默认是否展示扩展面板       | boolean                 | false  |
| onClose     | 关闭触发事件               | () => void              | -      |
| onSwitch    | 多图切换触发事件           | (index: number) => void | -      |
| theme       | 主题                       | ThemeType               | -      |
| shape       | 形状                       | ShapeType               | -      |
| tools       | 自定义工具栏按钮           | ReactNode               | -      |
| panel       | 自定义扩展面板             | ReactNode               | -      |

## ImageGroup API

| 属性 | 说明     | 类型     | 默认值 |
| ---- | -------- | -------- | ------ |
| data | 图片数据 | string[] | -      |
