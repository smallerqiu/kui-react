# Rate评分

`value` 用于初始化组件，并同步后续的外部值变化。用户操作会更新内部值并触发 `onChange`，即使传入固定值或 `onChange` 仅用于监听也能交互。需要父子同步时使用 `value={state}` 配合 `onChange={setState}`。相同值的重新渲染不会重置内部编辑；数组值请使用新数组更新。

评分组件。

## 何时使用

- 对评价进行展示。
- 对事物进行快速的评级操作。

## 代码演示

[基本用法](./demo/basic.tsx)

- 最简单的用法。

[文案展现 / 允许清除](./demo/tips.tsx)

- 给评分组件加上文案展示。

[其他字符](./demo/character.tsx)

- 可以将星星替换为其他字符，比如字母，数字，字体图标甚至中文。

## Rate API

| 属性              | 说明                               | 类型                    | 默认值 |
| ----------------- | ---------------------------------- | ----------------------- | ------ |
| value             | 当前值，需配合 `onChange` 使用 | number                  | -      |
| allowClear        | 是否允许再次点击后清除             | boolean                 | true   |
| allowHalf         | 是否允许半选                       | boolean                 | false  |
| showScore         | 是否显示分数                       | boolean                 | false  |
| character         | 自定义字符                         | string                  | -      |
| count             | star 总数                          | number                  | 5      |
| icon              | 自定义展示的图标                   | Icon                    | -      |
| size              | 图标尺寸                           | number                  | -      |
| color             | 图标颜色                           | string                  | -      |
| disabled          | 只读，无法进行交互                 | boolean                 | false  |
| readOnly          | 只读，保持正常外观但无法修改       | boolean                 | false  |
| tooltips          | 自定义每项的提示信息               | string[]                | -      |
| onChange          | 选择时的回调                       | (value: number) => void | -      |
| symbolReverseFill | 符号反相填充颜色                   | boolean                 | false  |
| strokeWidth       | 符号边框单位                       | number                  | 1      |
