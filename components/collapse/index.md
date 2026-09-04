# Collapse 折叠面板

可以折叠/展开的内容区域。

## 何时使用

- 对复杂区域进行分组和隐藏，保持页面的整洁。
- ‘手风琴’ 是一种特殊的折叠面板，只允许单个内容区域展开。

## 代码演示

[基本用法](./demo/basic.tsx)

- 默认可以同时展开一个或者多个面板

[手风琴](./demo/accordion.tsx)

- 设置 `accordion` 只允许同时展开一个面板

[嵌套面板](./demo/nesting.tsx)

- 嵌套折叠面板。

[额外节点](./demo/extra.tsx)

- 可以同时展开多个面板。

[简洁模式](./demo/sample.tsx)

- 设置 `sample` 呈现没有边框的简洁样式。

## API

| 属性             | 说明                               | 类型                                 | 默认值  |
| ---------------- | ---------------------------------- | ------------------------------------ | ------- |
| openKeys         | 受控模式下当前展开面板的 key       | (string \| number)[]                 | -       |
| defaultOpenKeys  | 非受控模式下默认展开面板的 key     | (string \| number)[]                 | []      |
| accordion        | 是否开启手风琴模式                 | boolean                              | false   |
| sample           | 是否开启简洁模式                   | boolean                              | false   |
| theme            | 主题                               | ThemeType                            | outline |
| shape            | 形状                               | ShapeType                            | round   |
| onChange         | 切换面板时触发，返回当前面板的 key | (key: string \| number) => void      | -       |
| onOpenKeysChange | 展开项变化时触发，返回全部展开项   | (keys: (string \| number)[]) => void | -       |

## Panel

| 属性     | 说明             | 类型             | 默认值 |
| -------- | ---------------- | ---------------- | ------ |
| title    | 面板标题         | ReactNode        | -      |
| key      | Panel 的唯一标识 | string \| number | -      |
| disabled | 是否禁用         | boolean          | false  |
| extra    | 标题右侧扩展内容 | ReactNode        | -      |
