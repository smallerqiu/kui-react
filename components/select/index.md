### Select API
| 属性         | 说明                                                    | 类型                           | 默认值 |
|--------------|---------------------------------------------------------|--------------------------------|--------|
| value        | 指定选中项目的 `value` 值                               | string,number                  | -      |
| width        | 组件宽度                                                | string,number                  | -      |
| placeholder  | 选择框默认文字                                          | string                         | 请选择 |
| disabled     | 是否禁用当前项                                          | boolean                        | false  |
| size         | 组件尺寸大小,提供`small`,`large`两种尺寸，默认为正常    | string                         | -      |
| multiple     | 是否呈现多选模式                                        | boolean                        | false  |
| loading      | 是否显示异步加载                                        | boolean                        | false  |
| clearable    | 是否可以清空选项                                        | boolean                        | false  |
| bordered     | 是否显示边框                                            | boolean                        | true   |
| showArrow    | 是否显示下拉按钮                                        | boolean                        | true   |
| transfer     | 默认渲染到body 上，如定位有问题，请尝试修改为 false     | boolean                        | true   |
| onChange     | 在选项状态发生改变时触发，返回选择项{value:xx,label:xx} | function                       | -      |
| onOpenChange | 下拉框展开或收起时触发                                  | function                       | -      |
| options      | options 数据，如果设置则不需要手动构造 Option 节点      | array <{value,label,disabled}> | []     |

### Option API
| 属性     | 说明                                       | 类型          | 默认值 |
|----------|--------------------------------------------|---------------|--------|
| key      | 和 value 含义一致。然后可以省略 value 设置 | string,number | -      |
| value    | 选项值，默认根据此属性值进行筛选，必填     | string,number | -      |
| label    | 选项显示的内容                             | string,number | -      |
| disabled | 是否禁用当前项                             | boolean       | false  |