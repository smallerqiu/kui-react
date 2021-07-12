### API
| 属性        | 说明                                                                | 类型         | 默认值  |
|-------------|---------------------------------------------------------------------|--------------|---------|
| type        | 按钮类型，可选值为 `success`、`info`、`warning`、`error` 或者不设置 | string       | warning |
| message     | 警告提示内容                                                        | string，ReactNode | -       |
| description | 警告提示的辅助性文字介绍                                            | string       | -       |
| showIcon    | 是否显示图标                                                        | boolean      | false   |
| closable    | 是否显示关闭按钮                                                    | boolean      | false   |
| onClose     | 关闭时触发的回调函数                                                | function     | -       |