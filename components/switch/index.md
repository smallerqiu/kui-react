### API
| 属性                               | 说明                                                      | 类型              | 默认值 |
|------------------------------------|-----------------------------------------------------------|-------------------|--------|
| checked                            | 指定当前是否选中                                          | Boolean           | false  |
| disabled                           | 禁用开关                                                  | Boolean           | false  |
| type                               | 主题颜色 可传入 `success`，`warning`，`danger`，`primary` | String            | -      |
| size                               | 组件尺寸，值为`small`展示小尺寸                           | String            | -      |
| checkedChildren(uncheckedChildren) | 选中(非选中)时的内容                                      | ReactNode         | -      |
| trueText                           | 当 `checked` 为 `true` 时 ，显示的文字                    | String            | -      |
| falseText                          | 当 `checked` 为 `false` 时 ，显示的文字                   | String            | -      |
| onChange                           | 当 `checked` 改变时触发，回调                             | Function(e:Event) | -      |