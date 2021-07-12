## API

| 属性         | 说明                                       | 类型           | 默认值 |
|--------------|--------------------------------------------|----------------|--------|
| visible      | 对话框是否显示。                           | boolean        | false  |
| title        | 对话框标题                                 | string         | -      |
| width        | 对话框宽度                                 | number, string | 520    |
| okText       | 确定按钮文字                               | string         | 确定   |
| cancelText   | 取消按钮文字                               | string         | 取消   |
| draggable    | 弹框是否可拖动, confirm模式不可用          | boolean        | false  |
| centered     | 窗口是否可以居中 , confirm模式不可用       | boolean        | false  |
| maximized    | 弹框是否可以最大化显示 , confirm模式不可用 | boolean        | false  |
| maskClosable | 是否点击遮罩关闭弹窗, 为否时Esc键将失效    | boolean        | true   |
| onOk         | 点击确定的回调                             | function       | -      |
| onCancel     | 点击取消的回调                             | function       | -      |
| onClose      | 窗口关闭的回调                             | function       | -      |
  

## Modal.method()

组件提供了一些静态方法，使用方式如下

* Modal.info(options)
* Modal.success(options)
* Modal.warning(options)
* Modal.error(options)
* Modal.show(options)
* Modal.confirm(options)

另外提供了全局配置和全局销毁的方法：

* Modal.show(options)
* Modal.destroy()

参数 options 为对象，具体说明如下：

| 属性       | 说明                                                                                                                   | 类型     | 默认值 |
|------------|------------------------------------------------------------------------------------------------------------------------|----------|--------|
| title      | 对话框标题                                                                                                             | string   | -      |
| content    | 对话框内容                                                                                                             | string   | -      |
| okText     | 确定按钮文字                                                                                                           | string   | 确定   |
| cancelText | 取消按钮文字                                                                                                           | string   | 取消   |
| icon       | 弹框的图标，type为toast可用 ，默认可选值为success，warning, error, info, 也可以自定义，参照 [Icon](/components/icon)值 | string   | -      |
| color      | 弹框的图标的颜色，type为toast可用                                                                                      | string   | -      |
| onOk       | 点击确定的回调                                                                                                         | function | -      |
| onCancel   | 点击取消的回调                                                                                                         | function | -      |
