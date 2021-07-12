### API
组件提供了一些静态方法，使用方式如下
 
  
- `Message.info(content, [duration], onClose)`
- `Message.success(content, [duration], onClose)`
- `Message.warning(content, [duration], onClose)`
- `Message.error(content, [duration], onClose)`

  

另外提供了全局配置和全局销毁的方法：
 
  
- `Message.config(options)`
- `Message.destroy()`

  
参数 `options` 为对象，具体说明如下：

| 属性     | 说明                                                              | 类型     | 默认值 |
|----------|-------------------------------------------------------------------|----------|--------|
| type     | 提示类型，提供 `info`、`success`、`error`、`warning` 四种可选类型 | string   | info   |
| content  | 提示内容                                                          | string   | -      |
| duration | 自动关闭的延时，单位秒，0为 不自动关闭                            | number   | 3      |
| closable | 是否可手动关闭                                                    | boolean  | false  |
| onClose  | 关闭时的回调                                                      | function | -      |
