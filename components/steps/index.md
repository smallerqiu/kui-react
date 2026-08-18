# Steps 步骤条

展示任务流程与当前进度。

## 代码演示

[基础用法](./demo/basic.tsx?show=vertical)

[纵向步骤](./demo/vertical.tsx?show=vertical)

[步骤状态](./demo/status.tsx?show=vertical)

[可点击步骤](./demo/clickable.tsx?show=vertical)

[自定义图标](./demo/icon.tsx?show=vertical)

[受控模式](./demo/controlled.tsx?show=vertical)

## Steps API

| 属性      | 说明     | 类型                   | 默认值     |
| --------- | -------- | ---------------------- | ---------- |
| current   | 当前步骤 | number                 | 0          |
| direction | 排列方向 | horizontal\|vertical   | horizontal |
| status    | 当前状态 | process\|error         | process    |
| items     | 步骤数据 | StepProps[]            | -          |
| onChange  | 点击步骤 | (current:number)=>void | -          |

## Step API

| 属性        | 说明       | 类型       | 默认值 |
| ----------- | ---------- | ---------- | ------ |
| title       | 步骤标题   | ReactNode  | -      |
| description | 补充描述   | ReactNode  | -      |
| icon        | 自定义节点 | ReactNode  | -      |
| status      | 单步状态   | StepStatus | -      |
| disabled    | 禁止点击   | boolean    | false  |
