# 验证码输入框 InputOTP

用于输入短信验证码、一次性密码等定长内容。

[基础用法](./demo/basic.tsx)

[长度](./demo/length.tsx)

[粘贴](./demo/paste.tsx)

[分隔符](./demo/separator.tsx)

[尺寸](./demo/size.tsx)

[状态](./demo/state.tsx)

[主题](./demo/theme.tsx)

[校验](./demo/validator.tsx)

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 受控输入值 | string,number | - |
| defaultValue | 非受控初始值 | string,number | - |
| length | 输入框数量 | number | 6 |
| type | 字符类型 | number,text | number |
| mask | 是否隐藏内容 | boolean | false |
| separator | 分隔内容 | ReactNode | - |
| validator | 单字符校验函数 | (value:string)=>boolean | - |
| disabled | 是否禁用 | boolean | false |
| readOnly | 是否只读 | boolean | false |
| autoFocus | 是否自动聚焦 | boolean | false |
| size | 尺寸 | small,medium,large | - |
| theme | 主题 | fill,outline,underlined | fill |
| shape | 形状 | square,circle | - |
| onChange | 值变化回调 | (value:string)=>void | - |
| onComplete | 输入完成回调 | (value:string)=>void | - |
