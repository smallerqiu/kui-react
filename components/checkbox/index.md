### API
| 属性          | 说明                     | 类型              | 默认值 |
|---------------|--------------------------|-------------------|--------|
| checked       | 是否选中状态             | boolean           | false  |
| label         | 显示的文字               | string 、 number  | -      |
| disabled      | 是否禁用当前项           | boolean           | false  |
| indeterminate | 组合辅助选项控制半选状态 | boolean           | false  |
| onChange      | 在选项状态发生改变时回调 | function(e:Event) | event  |
| value         | 组合使用时表示的值       | string、number    | -      |
### Checkbox.Group API
| 属性     | 说明                                       | 类型                                              | 默认值  |
|----------|--------------------------------------------|---------------------------------------------------|---------|
| value    | 用于设置当前选中的值                       | array                                             | false   |
| disabled | 是否禁用组件                               | boolean                                           | false   |
| onChange | 在选项状态发生改变时触发，返回当前选中的值 | function                                          | [value] |
| options  | 可以指定子项 `checkbox`                    | array <{label:string/number,value:string/number}> | -       |

#### Option   
