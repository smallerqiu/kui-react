# Select 选择器

下拉选择器。

## 何时使用

- 弹出一个下拉菜单给用户选择操作，用于代替原生的选择器，或者需要一个更优雅的多选器时。
- 当选项少时（少于 5 项），建议直接将选项平铺，使用 Radio 是更好的选择。

## 代码演示

[单选](./demo/basic.tsx)

- 使用 `value` 和 `onChange` 控制选中值

[多选](./demo/multiple.tsx)

- 通过设置 `multiple` 值来呈现多选模式

[禁用和不可清除](./demo/disabled.tsx)

- 多选时使用数组形式的 `value` 和 `onChange` 控制选中值

[过滤 和 搜索](./demo/filterable.tsx)

- 通过设置 `filterable` 值来呈现过滤模式 > filterable 和 onSearch 不可以同时使用, 搜索的结果会被过滤

[创建选项](./demo/allow-create.tsx)

- 多选模式下开启 `allowCreate`，输入内容并按回车可创建并选中一个不重复的新选项

[尺寸](./demo/size.tsx)

- 通过 `width` 和 `size` 可控制组件尺寸大小

[奇葩的定义](./demo/theme.tsx)

- 一些奇奇怪怪的东西

[虚拟滚动](./demo/virtual.tsx?show=vertical)

- 使用虚拟滚动高效展示大量选项。

## Select API

| 属性         | 说明                                                 | 类型                             | 默认值      |
| ------------ | ---------------------------------------------------- | -------------------------------- | ----------- |
| value        | 受控的选中值                                         | string,number,(string\|number)[] | -           |
| defaultValue | 非受控模式的初始选中值                               | string,number,(string\|number)[] | -           |
| open         | 受控的下拉框显示状态                                 | boolean                          | -           |
| defaultOpen  | 非受控模式的初始下拉框状态                           | boolean                          | false       |
| placement    | 下拉框弹出位置                                       | DropPlacementsType               | bottom-left |
| block        | 是否撑满父容器宽度                                   | boolean                          | false       |
| filterable   | 是否允许搜索过滤                                     | boolean                          | false       |
| allowCreate  | 多选时是否允许输入并创建新选项                       | boolean                          | false       |
| loadingText  | 加载状态提示文字                                     | string                           | -           |
| arrowIcon    | 自定义下拉箭头图标                                   | IconType[]                       | -           |
| width        | 组件宽度                                             | string,number                    | -           |
| placeholder  | 选择框默认文字                                       | string                           | 请选择      |
| disabled     | 是否禁用当前项                                       | boolean                          | false       |
| size         | 组件尺寸大小,提供`small`,`large`两种尺寸，默认为正常 | string                           | -           |
| emptyText    | 没有数据时展示的提示                                 | string                           | '暂无数据'  |
| maxTagCount  | 多选时最多展示的标签数，超出部分通过 Tooltip 展示    | number                           | -           |
| multiple     | 是否呈现多选模式                                     | boolean                          | false       |
| loading      | 是否显示异步加载                                     | boolean                          | false       |
| clearable    | 是否可以清空选项                                     | boolean                          | false       |
| bordered     | 是否显示边框                                         | boolean                          | true        |
| extendWidth  | 下拉框的宽度是否与input一致                          | boolean                          | true        |
| showArrow    | 是否显示下拉按钮                                     | boolean                          | true        |
| options      | options 数据，如果设置则不需要手动构造 Option 节点   | SelectOption[]                   | []          |
| theme        | 主题                                                 | string                           | fill        |
| icon         | 自定义图标                                           | string                           | -           |
| shape        | shape='circle' 时呈现圆角                            | string                           | -           |
| virtual      | 是否开启虚拟滚动，用于高效渲染大量选项               | boolean                          | false       |
| itemHeight   | 虚拟滚动时每个选项的高度，单位 `px`                 | number                           | 32          |
| overscan     | 虚拟滚动时视口外额外渲染的选项数量                   | number                           | 5           |
| onSelect     | 选中一项时触发                                       | (option: SelectOption) => void   | -           |
| onChange     | 在选项状态发生改变时触发，返回选择的值               | (value: SelectValue) => void     | -           |
| onSearch     | 搜索时触发                                           | (e: InputEvent) => void          | -           |
| onOpenChange | 下拉框展开或收起时触发                               | (open: boolean) => void          | -           |
| onClear      | 点击清除按钮时触发                                   | () => void                       | -           |

## Option API

| 属性     | 说明                                   | 类型          | 默认值 |
| -------- | -------------------------------------- | ------------- | ------ |
| key      | 和 value 含义一致。                    | string,number | -      |
| value    | 选项值，默认根据此属性值进行筛选，必填 | string,number | -      |
| label    | 选项显示的内容                         | string,number | -      |
| disabled | 是否禁用当前项                         | boolean       | false  |
