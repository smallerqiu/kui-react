# Form 表单

具有数据收集、校验和提交功能的表单，包含复选框、单选框、输入框、下拉选择框等元素。

## 何时使用

- 用于创建一个实体或收集信息。
- 需要对输入的数据类型进行校验时。

## 代码演示

在 `Modal`、`Drawer` 中，如果要在打开的时候对表单进行重置，请通过 `ref` 在弹窗内容渲染完成后调用：

```tsx
import { useRef, useState } from "react";
import { Button, Form, type FormExpose } from "react-kui";

function Demo() {
  const [open, setOpen] = useState(false);
  const formRef = useRef<FormExpose>(null);

  const openModal = () => {
    setOpen(true);
    // 弹窗内容渲染完成后再重置
    requestAnimationFrame(() => formRef.current?.reset());
  };

  return (
    <>
      <Button onClick={openModal}>打开</Button>
      <Modal open={open} onOpenChange={setOpen}>
        <Form ref={formRef} model={{}} />
      </Modal>
    </>
  );
}
```

[典型表单](./demo/basic.tsx?show=vertical)

- 包括各种表单项，比如输入框、选择器、开关、单选框、多选框等。

[对齐方式](./demo/align.tsx?show=vertical)

- 根据具体目标和制约因素，选择最佳的标签对齐方式。

[表单验证](./demo/valid.tsx?show=vertical)

- 在防止用户犯错的前提下，尽可能让用户更早地发现并纠正错误。

[辅助校验](./demo/length.tsx?show=vertical)

- 校验一些数据类型

[多表单联动](./demo/withmodal.tsx?show=vertical)

- 在Form之外，通过`submit`从外部提交表单，反之 则推荐使用 `<Button htmlType="submit" />`调用原生提交逻辑

[自定义校验规则](./demo/customvalid.tsx?show=vertical)

- 自定义验证规则来完成表单验证。

[动态校验规则](./demo/dynamicvalid.tsx?show=vertical)

- 根据不同情况执行不同的校验规则。

## Form API

| 属性       | 说明                                                                           | 类型                           | 默认值     |
| ---------- | ------------------------------------------------------------------------------ | ------------------------------ | ---------- |
| model      | 表单数据对象                                                                   | Object                         | -          |
| rules      | 表单验证规则，                                                                 | boolean                           | false      |
| name       | 表单名称，会作为表单字段 id 前缀使用                                           | string                         | -          |
| labelCol   | label 标签布局，同 `<Col>` 组件，设置 span offset 值，如 {span: 3, offset: 12} | {span:number,offset:number}    | -          |
| wrapperCol | 控件 标签布局，同 `<Col>` 组件，设置 span offset 值，如 {span: 15, offset: 12} | {span:number,offset:number}    | -          |
| theme      | 组件呈现主题                                                                   | string                         | -          |
| size       | 子组件的尺寸                                                                   | string                         | -          |
| layout     | 表单布局                                                                       | [horizontal ,vertical ,inline] | horizontal |
| shape      | 子组件的形状                                                                   | [circle,square]                | horizontal |
| disabled   | 表单是否可用                                                                   | boolean                           | true       |
| onReset    | 表单重置后的回调                                                               | ()=> void                      | -          |
| onSubmit   | 提交表单时触发事件                                                             | (e: SubmitEvent)=> void        | -          |
| onChange   | 表单模型值变化时触发                                                           | (model: Record<string, unknown>) => void | - |

## Form Expose API

| 属性     | 说明                                                   | 类型                                                     | 默认值 |
| -------- | ------------------------------------------------------ | -------------------------------------------------------- | ------ |
| test     | 对表单单个字段进行校验的方法                           | (key: string) => boolean \| Promise&lt;boolean&gt; \| undefined | -      |
| reset    | 对整个表单进行重置，将所有字段值重置为空并移除校验结果 | ()=>void                                                 | -      |
| submit   | 提交表单，并验证                                       | ()=>void                                                 | -      |
| validate | 验证表单，存在异步校验规则时返回 Promise               | (callback?: (result: { valid: boolean }) => void) => boolean \| Promise&lt;boolean&gt; | - |

## FormItem API

| 属性              | 说明                                              | 类型                                   | 默认值 |
| ----------------- | ------------------------------------------------- | -------------------------------------- | ------ |
| prop              | 对应表单域 model 里的字段，表单验证必须字段       | string                                 | -      |
| label             | 标签文本                                          | ReactNode                              | -      |
| rules             | 表单验证规则                                      | FormRule[]                             | -      |

## rules API

| 属性      | 说明                                                                                                                  | 类型                                                                    | 默认值 |
| --------- | --------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ------ |
| required  | 是否必填字段                                                                                                          | boolean                                                                    | false  |
| message   | 校验不通过提示语                                                                                                      | string                                                                  | -      |
| validator | 自定义校验方法，支持 callback 与异步函数两种写法                                                                      | (rule: FormRule, value: unknown, callback: (error?: Error \| string) => void) => void \| Promise&lt;unknown&gt; | - |
| type      | 数据类型校验，提供三种校验方式 `mobile`手机， `mail`邮箱， `number`数字类型判断                                       | string                                                                  | -      |
| pattern   | 自定义正则校验，比喻密码强度包含数字，字母，特殊符号可以这么写 `/(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,20}/` | string                                                                  | -      |
| trigger   | 该规则在何时触发校验，未设置时默认在 `change` 时校验                                                                  | change,blur 或其数组                                                    | -      |
| min       | 字段长度最小值校验                                                                                                    | number                                                                  | -      |
| max       | 字段长度最大值校验                                                                                                    | number                                                                  | -      |
