# AutoComplete 自动完成

根据输入内容提供候选项，保留自由输入能力。

## 代码演示

[基础用法](./demo/basic.tsx)

[受控值](./demo/controlled.tsx)

[自定义过滤](./demo/filter.tsx)

[尺寸、主题与形状](./demo/appearance.tsx)

[空输入时展示](./demo/show-on-empty.tsx)

[远程搜索](./demo/remote.tsx)

## AutoComplete API

| 属性         | 说明                     | 类型                           | 默认值  |
| ------------ | ------------------------ | ------------------------------ | ------- |
| value        | 受控输入值               | string                         | -       |
| defaultValue | 初始输入值               | string                         | -       |
| options      | 候选项                   | (string\|AutoCompleteOption)[] | []      |
| open         | 受控展开状态             | boolean                        | -       |
| defaultOpen  | 初始展开状态             | boolean                        | false   |
| showOnEmpty  | 空输入聚焦时展示建议     | boolean                        | false   |
| clearable    | 有值且悬停时显示清除按钮 | boolean                        | false   |
| loading      | 是否正在加载             | boolean                        | false   |
| loadingText  | 加载提示文字             | string                         | 加载中  |
| size         | 尺寸                     | small\|medium\|large           | medium  |
| theme        | 主题                     | fill\|outline\|plain           | fill    |
| shape        | 形状                     | circle\|square\|round\|default | default |
| filterOption | 是否过滤或自定义过滤     | boolean\|function              | true    |
| onChange     | 输入变化                 | (value:string)=>void           | -       |
| onClear      | 点击清除按钮             | ()=>void                       | -       |
| onSearch     | 搜索时触发               | (value:string)=>void           | -       |
| onSelect     | 选择候选项               | (value,option)=>void           | -       |
| onOpenChange | 展开状态变化             | (open:boolean)=>void           | -       |
