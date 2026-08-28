# InputTag 标签输入

将连续输入整理成可增删的标签集合。

## 代码演示

[基础用法](./demo/basic.tsx)

[受控值](./demo/controlled.tsx)

[分隔符](./demo/separators.tsx)

[数量限制](./demo/limit.tsx)

[尺寸](./demo/size.tsx?show=vertical)

- 不同的尺寸。

[尺寸、主题与形状](./demo/appearance.tsx)

## InputTag API

| 属性            | 说明                                | 类型                           | 默认值  |
| --------------- | ----------------------------------- | ------------------------------ | ------- |
| value           | 受控标签                            | string[]                       | -       |
| defaultValue    | 初始标签                            | string[]                       | []      |
| placeholder     | 占位文本                            | string                         | -       |
| disabled        | 禁用                                | boolean                        | false   |
| clearable       | 是否显示一键清空按钮                | boolean                        | false   |
| block           | 是否撑满父容器宽度                  | boolean                        | false   |
| size            | 尺寸                                | small\|medium\|large           | medium  |
| theme           | 主题                                | fill\|outline\|plain           | fill    |
| shape           | 形状                                | circle\|square\|round\|default | default |
| allowDuplicates | 允许重复                            | boolean                        | false   |
| max             | 最大标签数                          | number                         | -       |
| maxTagCount     | 最多展示的标签数，超出部分显示为 +N | number                         | -       |
| separators      | 提交分隔键                          | string[]                       | [',']   |
| onChange        | 标签变化                            | (value:string[])=>void         | -       |
| onAdd           | 新增标签                            | (value:string)=>void           | -       |
| onRemove        | 删除标签                            | (value,index)=>void            | -       |
| onClear         | 清空标签                            | () => void                     | -       |
