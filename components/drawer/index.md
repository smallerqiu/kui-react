#### API
| 属性        | 说明                                                               | 类型          | 默认值 |
|-------------|--------------------------------------------------------------------|---------------|--------|
| title       | 抽屉标题                                                           | string        | -      |
| width       | 抽屉宽度 `placement`为 `left` 或 `right` 时使用                    | number,string | 520    |
| height      | 抽屉高度 `placement`为 `top` 或 `bottom` 时使用                    | number,string | 256    |
| placement   | 抽屉显示方向，提供 `left` , `top` , `right` , `bottom` 4种展示方式 | string        | right  |
| footer      | 页脚内容，不显示页脚设置`footer=null`即可                          | ReactNode          | true   |
| closable    | 是否显示关闭按钮                                                   | boolean       | true   |
| masClosable | 点击蒙层是否允许关闭                                               | boolean       | true   |
| okText      | 确定按钮文字                                                       | string        | 确定   |
| cancelText  | 取消按钮文字                                                       | string        | 取消   |
| onOk        | 点击确定的回调                                                     | function      | -      |
| onCancel    | 点击取消的回调                                                     | function      | -      |
| onClose     | 抽屉关闭的回调                                                     | function      | -      |