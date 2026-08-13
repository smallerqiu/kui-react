# 反馈面板 FeedbackPanel

集中展示操作结果、说明和后续动作。

[基础用法](./demo/basic.tsx)

[状态类型](./demo/kinds.tsx)

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| kind | 状态类型 | positive,negative,caution,neutral | neutral |
| heading | 标题 | ReactNode | - |
| description | 描述 | ReactNode | - |
| symbol | 自定义图标或内容 | IconType[],ReactNode | - |
| compact | 紧凑模式 | boolean | false |
| actions | 操作区域 | ReactNode | - |
| children | 详情内容 | ReactNode | - |
