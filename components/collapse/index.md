### API
| 属性      | 说明                                           | 类型     | 默认值 |
|-----------|------------------------------------------------|----------|--------|
| activeKey | 当前激活的面板的值                             | array    | -      |
| accordion | 是否开启手风琴模式，开启后每次至多展开一个面板 | boolean  | false  |
| sample    | 是否开启简洁模式                               | boolean  | false  |
| change    | 切换面板时触发回调，返回当前选项卡的 `name`    | function | -      |

### Collapse.Panel
| 属性  | 说明             | 类型          | 默认值 |
|-------|------------------|---------------|--------|
| title | 面板的标题       | string        | -      |
| extra | 面板的标题的扩展 | ReactNode     | -      |
| key   | React 所需 key   | stirng,number | -      |