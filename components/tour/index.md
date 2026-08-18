# Tour 漫游式引导

围绕页面中的真实目标逐步介绍功能，可控、可跳过，不接管业务状态。

## 代码演示

[基础用法](./demo/basic.tsx)

[受控模式](./demo/controlled.tsx)

[蒙层](./demo/mask.tsx)

[弹出位置](./demo/placement.tsx)

## Tour API

| 属性           | 说明         | 类型                   | 默认值 |
| -------------- | ------------ | ---------------------- | ------ |
| open           | 受控显示状态 | boolean                | -      |
| defaultOpen    | 初始显示状态 | boolean                | false  |
| current        | 当前步骤     | number                 | -      |
| defaultCurrent | 初始步骤     | number                 | 0      |
| steps          | 引导步骤     | TourStep[]             | -      |
| mask           | 显示遮罩     | boolean                | true   |
| closable       | 显示关闭按钮 | boolean                | true   |
| onChange       | 步骤变化     | (current:number)=>void | -      |
| onOpenChange   | 显示状态变化 | (open:boolean)=>void   | -      |
| onFinish       | 完成引导     | ()=>void               | -      |
