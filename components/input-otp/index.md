# 验证码输入框 InputOTP

用于输入短信验证码、一次性密码等定长内容。

[基础用法](./demo/basic.tsx?show=vertical)

- 支持逐位输入、整段粘贴、键盘移动和完成事件。

[自定义长度](./demo/length.tsx?show=vertical)

- 通过 `length` 设置验证码位数。

[主题与形状](./demo/theme.tsx?show=vertical)

- 提供亮色、描边、下划线主题，以及方形、圆角和圆形外观。

[尺寸](./demo/size.tsx?show=vertical)

- 提供小、默认和大三种尺寸。

[禁用与只读](./demo/state.tsx?show=vertical)

- 禁用状态不可交互，只读状态仍可聚焦和复制。

[分隔符](./demo/separator.tsx?show=vertical)

- 通过 `separator` 设置字段之间的内容。

[粘贴验证码](./demo/paste.tsx?show=vertical)

- 粘贴完整验证码时自动切割，并依次填入对应字段。

[输入验证](./demo/validator.tsx?show=vertical)

- `type` 提供默认字符验证，也可通过 `validator` 自定义允许输入的字符。

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
| onFocus | 输入框获得焦点时触发 | (event: FocusEvent<HTMLInputElement>) => void | - |
| onBlur | 输入框失去焦点时触发 | (event: FocusEvent<HTMLInputElement>) => void | - |
