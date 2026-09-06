# Tabs 标签页

选项卡切换组件。

## 何时使用

提供平级的区域将大块内容进行收纳和展现，保持界面整洁。

- 卡片式的页签，提供可关闭的样式，常用于容器顶部。
- 标准线条式页签，用于容器内部的主功能切换，这是最常用的 Tabs。

## 代码演示

[基本用法](./demo/basic.tsx?show=vertical)

- 默认选中第一项。

[禁用](./demo/disabled.tsx?show=vertical)

- 禁用某一项。

[居中](./demo/centered.tsx?show=vertical)

- 标签居中展示。

[图标](./demo/icon.tsx?show=vertical)

- 有图标的标签。

[附加内容](./demo/extra.tsx?show=vertical)

- 可以在页签右边添加附加操作。

[卡片式页签](./demo/card.tsx?show=vertical)

- 另一种样式的页签。

[浏览器式页签](./demo/browser.tsx?show=vertical)

- 适用于多文档、编辑器和工作台场景。

[新增和关闭页签](./demo/closable.tsx?show=vertical)

- 卡片式和浏览器式页签支持关闭选项。使用 `closable={false}` 禁止关闭。

[极简式页签](./demo/sample.tsx?show=vertical)

- 简单的卡片呈现模式。

## Tabs API

| 属性         | 说明                                  | 类型                                      | 默认值         |
| ------------ | ------------------------------------- | ----------------------------------------- | -------------- |
| value        | 当前激活 tab 面板的 key               | string \| number                          | -              |
| defaultValue | 非受控模式初始激活的 key              | string \| number                          | 第一个可用面板 |
| variant      | 页签形态                              | `line` \| `card` \| `sample` \| `browser` | `line`         |
| card         | 是否为卡片式，兼容旧版本              | boolean                                   | false          |
| sample       | 是否为极简式，兼容旧版本              | boolean                                   | false          |
| animated     | 是否使用动画切换 Tabs                 | boolean                                   | true           |
| centered     | 是否居中显示标签                      | boolean                                   | false          |
| extra        | 标签栏右侧的额外内容                  | ReactNode                                 | -              |
| onRemove     | tab关闭时的回调，返回关闭的tab的key值 | (key: string) => void                     | -              |
| onChange     | 切换面板的回调                        | (key: string) => void                     | -              |
| onTabClick   | tab点击时的回调                       | (key: string) => void                     | -              |

## Tabs.TabPanel API

| 属性     | 说明                | 类型             | 默认值 |
| -------- | ------------------- | ---------------- | ------ |
| key      | TabPanel 的唯一标识 | string \| number | -      |
| title    | 选项卡头内容        | ReactNode        | -      |
| icon     | 选项卡头显示的图标  | IconType         | -      |
| disabled | tab是否被禁用       | boolean          | false  |
| closable | tab是否显示关闭按钮 | boolean          | false  |
