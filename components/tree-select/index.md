# TreeSelect 树选择

树型选择控件。

## 何时使用

类似 Select 的选择控件，可选择的数据结构是一个树形结构时，可以使用 TreeSelect，例如公司层级、学科系统、分类目录等等。

## 代码演示

[基本用法](./demo/basic.tsx)

- 最简单的用法。

[多选](./demo/multiple.tsx)

- 多选的树选择。

[可勾选](./demo/checkable.tsx)

- 使用勾选框实现多选功能。

[禁用](./demo/disabled.tsx)

- 禁用状态

[异步加载](./demo/sync.tsx)

- 点击展开节点，动态加载数据。

[尺寸](./demo/size.tsx)

- 选择框的尺寸有：`small`、`default`、`large`。

[奇葩的定义](./demo/theme.tsx)

- 一些奇奇怪怪的东西

[虚拟滚动](./demo/virtual.tsx)

- 大数据量时启用虚拟滚动，仅渲染下拉框可视区域内的树节点。

## TreeSelect API

| 属性              | 说明                                                 | 类型                                  | 默认值      |
| ----------------- | ---------------------------------------------------- | ------------------------------------- | ----------- |
| value             | 受控的选中值                                         | TreeSelectValue                       | -           |
| defaultValue      | 非受控模式的初始选中值                               | TreeSelectValue                       | -           |
| open              | 受控的下拉框显示状态                                 | boolean                               | -           |
| defaultOpen       | 非受控模式的初始下拉框状态                           | boolean                               | false       |
| width             | 组件宽度                                             | string,number                         | -           |
| placement         | 下拉框弹出位置                                       | DropPlacementsType                    | bottom-left |
| maxTagCount       | 多选时最多展示的标签数量，超出部分通过 Tooltip 展示  | number                                | -           |
| filterable        | 是否允许搜索过滤                                     | boolean                               | false       |
| block             | 是否撑满父容器宽度                                   | boolean                               | false       |
| options           | `treeData` 的兼容数据源属性                          | TreeNode[]                            | []          |
| arrowIcon         | 自定义下拉箭头图标                                   | IconType[]                            | -           |
| placeholder       | 选择框默认文字                                       | string                                | 请选择      |
| disabled          | 是否禁用当前项                                       | boolean                               | false       |
| readOnly          | 是否只读                                             | boolean                               | false       |
| size              | 组件尺寸大小,提供`small`,`large`两种尺寸，默认为正常 | string                                | -           |
| emptyText         | 没有数据时展示的提示                                 | string                                | '暂无数据'  |
| multiple          | 是否呈现多选模式                                     | boolean                               | false       |
| loading           | 异步加载状态                                         | boolean                               | false       |
| virtual           | 是否启用虚拟滚动                                     | boolean                               | false       |
| virtualHeight     | 虚拟滚动视口高度                                     | number                                | 300         |
| itemHeight        | 虚拟滚动节点高度                                     | number                                | 28          |
| overscan          | 可视区域外预渲染的节点数量                           | number                                | 5           |
| clearable         | 是否可以清空选项                                     | boolean                               | false       |
| bordered          | 是否显示边框                                         | boolean                               | true        |
| showArrow         | 是否显示下拉按钮                                     | boolean                               | true        |
| theme             | 主题                                                 | string                                | fill        |
| icon              | 自定义图标                                           | string                                | -           |
| shape             | shape='circle' 时呈现圆角                            | string                                | -           |
| treeLoadData      | 异步加载数据的方法                                   | (node: TreeNode) => Promise<unknown\> | -           |
| treeData          | 可嵌套的节点属性的数组，生成 `tree` 的数据           | TreeNode[]                            | []          |
| treeCheckable     | 是否显示多选框                                       | boolean                               | false       |
| treeShowLine      | 是否展示连接线                                       | boolean                               | false       |
| treeShowIcon      | 是否展示图标                                         | boolean                               | true        |
| treeExpandedKeys  | 指定展开的节点                                       | string[]                              | []          |
| treeSelectedKeys  | 受控的 Tree 选中节点                                 | string[]                              | -           |
| treeCheckedKeys   | 受控的 Tree 勾选节点                                 | string[]                              | -           |
| treeCheckStrictly | 父子节点勾选状态是否相互独立                         | boolean                               | false       |
| treeExpandedAll   | 是否默认展开全部非叶子节点                           | boolean                               | false       |

## Tree 事件

| 属性                     | 说明                         | 回调参数                                                  |
| ------------------------ | ---------------------------- | --------------------------------------------------------- |
| onTreeSelect             | 点击树节点时触发             | (value: string, label: string, selected: boolean) => void |
| onSearch                 | 搜索时触发                   | (e: InputEvent) => void                                   |
| onChange                 | 值改变时触发                 | (value: string\|string[]) => void                         |
| onTreeExpand             | Tree节点展开时触发           | (result: TreeExpandEvent) => void                         |
| onTreeExpandedKeysChange | Tree 展开 key 集合变化时触发 | (keys: string[]) => void                                  |
| onTreeCheckedKeysChange  | Tree 勾选 key 集合变化时触发 | (keys: string[]) => void                                  |
| onOpenChange             | 下拉框展开或收起时触发       | (open: boolean) => void                                   |
| onClear                  | 清空时触发                   | () => void                                                |
