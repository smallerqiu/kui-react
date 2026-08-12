# Checkbox 多选框

多选框

## 何时使用

- 在一组可选项中进行多项选择时；
- 单独使用可以表示两种状态之间的切换，和 switch 类似。区别在于切换 switch 会直接触发状态改变，而 checkbox 一般用于状态标记，需要和提交操作配合。

## 代码演示

[单选](./demo/basic.tsx)

- 单独使用时，通过 `checked` 和 `onChange` 控制选中状态。

[多选](./demo/group.tsx)

- 可以使用 options 属性来设置选项, 也可以使用子组件来设置选项。

[组合布局](./demo/group-layout.tsx)

- 组合布局

[可不用 / 可控](./demo/disabled.tsx)

- 通过 `disabled` 设置不可用

[全选](./demo/check-all.tsx)

- 全选组合

## API

| 属性          | 说明                                          | 类型                  | 默认值 |
| ------------- | --------------------------------------------- | --------------------- | ------ |
| checked       | 受控的选中状态                                | bool                  | false  |
| label         | 显示的文字                                    | string 、 number      | -      |
| value         | 结合使用时表示的值                            | string、number        | -      |
| disabled      | 是否禁用当前项                                | bool                  | false  |
| indeterminate | 组合辅助选项控制半选状态                      | bool                  | false  |
| theme         | 组件呈现主题,默认'fill'                       | string                | fill   |
| valueType     | 单位选项的输出值的类型                        | [string,number,bool]  | bool   |
| onChange      | 在选项状态发生改变时回调                      | (e:ChangeEvent)=>void | -      |

## CheckboxGroup API

| 属性       | 说明                                                 | 类型             | 默认值     |
| ---------- | ---------------------------------------------------- | ---------------- | ---------- |
| value      | 受控的当前选中值                                   | any[]            | -          |
| disabled   | 是否禁用组件                                         | bool             | false      |
| onChange   | 在选项状态发生改变时触发，返回当前选中的项和状态     | (any[])=>void    | -          |
| direction  | 布局方向,可选值 `horizontal`、`vertical`             | string           | horizontal |
| options    | 可以指定子项 `checkbox`                              | CheckboxOption[] | -          |
| size       | 设置复选框的大小                                     | string           | -          |
