## Tree API

| 属性      | 说明                                       | 类型    | 默认值 |
|-----------|--------------------------------------------|---------|--------|
| data      | 可嵌套的节点属性的数组，生成 `tree` 的数据 | Array   | []     |
| checkable | 是否显示多选框                             | Boolean | false  |
| draggable | 是否可以拖拽                               | Boolean | false  |
| showLine  | 是否展示连接线                             | Boolean | false  |
| showIcon  | 是否展示图标                               | Boolean | true   |
| showExtra | 是否默认展示扩展元素                       | Boolean | false  |

## TreeNode API

| 属性     | 说明         | 类型    | 默认值 |
|----------|--------------|---------|--------|
| title    | 节点标题     | String  | -      |
| icon     | 自定义图标   | String  | -      |
| disabled | 是否禁用节点 | Boolean | false  |
| children | 子节点       | Array   | -      |

## Tree 事件
| 属性        | 说明                   | 回调参数                                     |
|-------------|------------------------|----------------------------------------------|
| onLoadData  | 异步加载数据的方法     | Function(node,callback)                      |
| onSelect    | 点击树节点时触发       | Function({selectedKeys,selected,node,vnode}) |
| onCheck     | 点击复选框时触发       | Function({checkedKeys,checked,node,vnode})   |
| onExpand    | 展开和收起子节点时触发 | Function({expandedKeys,expanded,node,vnode}) |
| onDragStart | 开始拖拽时调用         | Function({event,node})                       |
| onDragEnd   | dragend 触发时调用     | Function({event,node})                       |
| onDragEnter | dragenter 触发时调用   | Function({event, node, expandedKeys})        |
| onDragLeave | dragleave 触发时调用   | Function({event,node})                       |
| onDrop      | drop 触发时调用        | Function({event,node,dragNode})              |