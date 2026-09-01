# Mentions 提及

在多行文本中通过触发字符插入结构化提及。

## 代码演示

[基础用法](./demo/basic.tsx)

- 输入 @ 后可通过键盘选择提及项。

[多个触发字符](./demo/triggers.tsx)

- 同时支持成员提及和话题关联。

[自定义过滤](./demo/filter.tsx)

- 自定义候选项的匹配规则。

[远程搜索](./demo/remote.tsx?show=vertical)

- 输入触发字符后异步加载候选项。

[尺寸](./demo/size.tsx?show=vertical)

- 展示小、中、大三种尺寸。

[尺寸、主题与形状](./demo/appearance.tsx)

- 展示不同输入框外观。

[空状态](./demo/empty.tsx)

- 没有匹配结果时展示 Empty。

[行数](./demo/rows.tsx)

- 使用 `rows` 控制输入区域行数。

[下拉位置](./demo/placement.tsx)

- 下拉菜单跟随光标，并在空间不足时自动翻转。

## Mentions API

| 属性         | 说明             | 类型                           | 默认值      |
| ------------ | ---------------- | ------------------------------ | ----------- |
| value        | 受控文本         | string                         | -           |
| defaultValue | 初始文本         | string                         | ''          |
| options      | 候选项           | (string\|MentionOption)[]      | []          |
| triggers     | 触发字符         | string[]                       | ['@']       |
| rows         | 文本域行数       | number                         | 2           |
| placement    | 下拉菜单优先位置 | DropPlacementsType             | bottom-left |
| size         | 尺寸             | small\|medium\|large           | medium      |
| theme        | 主题             | fill\|outline\|plain           | fill        |
| shape        | 形状             | circle\|square\|round\|default | default     |
| emptyText    | 空状态说明       | string                         | 暂无数据    |
| loading      | 是否显示加载状态 | boolean                        | false       |
| loadingText  | 加载状态文案     | string                         | Searching   |
| clearable    | 是否显示清除按钮 | boolean                        | true        |
| filterOption | 自定义过滤       | function                       | -           |
| onChange     | 文本变化         | (value:string)=>void           | -           |
| onSelect     | 选择提及         | (option,trigger)=>void         | -           |
| onSearch     | 搜索词变化       | (query:string)=>void           | -           |
| onClear      | 点击清除按钮     | ()=>void                       | -           |
