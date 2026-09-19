# Message 全局提示

全局展示操作反馈信息。

## 何时使用

- 可提供成功、警告和错误等反馈信息。
- 顶部居中显示并自动消失，是一种不打断用户操作的轻量级提示方式。

## 代码演示

[普通提示](./demo/basic.tsx)

- 信息提醒反馈。

[分组提示](./demo/grouping.tsx)

- 相同 grouping 的通知会复用同一条目，只更新内容和重置计时器，不会新增

[自定图标](./demo/icon.tsx)

- 自定图标。

[提示类型](./demo/types.tsx)

- 通过 `type` 来设置提示类型

[加载中](./demo/loading.tsx)

- 进行全局 loading，异步自行移除。

[自定义时长](./demo/close.tsx)

- 可以自定义配置，其中 `duration` 控制自动关闭时长

## API

组件提供了一些静态方法，使用方式如下

- `message.info(content, [duration], onClose)`
- `message.success(content, [duration], onClose)`
- `message.warning(content, [duration], onClose)`
- `message.error(content, [duration], onClose)`
- `message.loading(content, [duration])`

另外提供了全局配置和全局销毁的方法：

- `message.show(options)`
- `message.destroy()`

参数 `options` 为对象，具体说明如下：

| 属性     | 说明                                                              | 类型             | 默认值 |
| -------- | ----------------------------------------------------------------- | ---------------- | ------ |
| type     | 提示类型，提供 `info`、`success`、`error`、`warning` 四种可选类型 | string           | info   |
| content  | 提示内容                                                          | string,ReactNode | -      |
| duration | 自动关闭的延时，单位秒，0 为不自动关闭                            | number           | 3.5    |
| closable | 是否可手动关闭                                                    | boolean          | false  |
| icon     | 自定义图标                                                        | string           | -      |
| color    | 自定义图标颜色                                                    | string           | -      |
| onClose  | 关闭时的回调                                                      | () => void       | -      |
| grouping | 分组标识；相同标识的消息复用原条目并重新计时                      | string           | -      |
