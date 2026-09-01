# Dropdown 下拉菜单

向下弹出的列表。

## 何时使用

当页面上的操作命令过多时，用此组件可以收纳操作元素。点击或移入触点，会出现一个下拉菜单。可在列表中进行选择，并执行相应的命令。

## 代码演示

[基本用法](./demo/basic.tsx)

- 最简单的下拉菜单。

[右键菜单](./demo/right-menu.tsx?show=vertical)

- 默认是移入触发菜单，可以点击鼠标右键触发。

[带下拉框的按钮](./demo/dropdown-buttons.tsx)

- 左边是按钮，右边是额外的相关功能菜单。可设置 icon 属性来修改右边的图标。

[其他元素](./demo/divider.tsx)

- 分割线和不可用菜单项。

[弹出位置](./demo/placement.tsx)

- 支持 6 个弹出位置。

[显示箭头](./demo/arrow.tsx)

- 设置 `arrow` 展示指向触发元素的箭头。

[多级菜单](./demo/cascading.tsx)

- 传入的菜单里有多个层级。

## Dropdown API

| 属性         | 说明                                                                         | 类型                | 默认值      |
| ------------ | ---------------------------------------------------------------------------- | ------------------- | ----------- |
| open         | 受控的显示状态                                                               | boolean             | -           |
| show         | 已废弃，请使用 `open`                                                        | boolean             | -           |
| defaultOpen  | 非受控模式的初始显示状态                                                     | boolean             | false       |
| trigger      | 触发方式,支持hover(默认), click, custom 3种方式                              | string              | hover       |
| placement    | 菜单弹出位置：bottomLeft bottomCenter bottomRight topLeft topCenter topRight | string              | bottom-left |
| theme        | 组件呈现主题,默认'fill'                                                      | string              | fill        |
| arrow        | 是否显示箭头                                                                 | boolean                | false       |
| target       | 触发下拉的元素                                                               | ReactNode               | -           |
| disabled     | 是否允许触发下拉                                                             | boolean                | false       |
| onOpenChange | 打开或关闭Dropdown时触发                                                     | (opened:boolean)=>void | -           |
| overlay      | 下拉层内容                                                                   | ReactNode           | -           |

## DropdownButton API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| size | 按钮尺寸 | SizeType | - |
| shape | 按钮形状 | ShapeType | - |
| disabled | 是否禁用 | boolean | false |
| icon | 下拉触发按钮图标 | IconType | Ellipsis |
| theme | 按钮主题 | ThemeType | - |
| arrow | 是否显示下拉箭头 | boolean | false |
| placement | 下拉层位置 | DropPlacementsType | bottom-right |
| onClick | 主按钮点击回调 | (event: MouseEvent<HTMLButtonElement>) => void | - |
| overlay | 下拉层内容 | ReactNode | - |
