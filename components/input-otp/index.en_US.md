# InputOTP

Input for verification codes, one-time passwords, and other fixed-length values.

[Basic](./demo/basic.tsx)

[Length](./demo/length.tsx)

[Paste](./demo/paste.tsx)

[Separator](./demo/separator.tsx)

[Size](./demo/size.tsx)

[State](./demo/state.tsx)

[Theme](./demo/theme.tsx)

[Validator](./demo/validator.tsx)

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| value | Controlled value | string,number | - |
| defaultValue | Initial uncontrolled value | string,number | - |
| length | Number of inputs | number | 6 |
| type | Character type | number,text | number |
| mask | Whether to mask the value | boolean | false |
| separator | Separator content | ReactNode | - |
| validator | Character validator | (value:string)=>boolean | - |
| disabled | Whether disabled | boolean | false |
| readOnly | Whether read-only | boolean | false |
| autoFocus | Whether to focus automatically | boolean | false |
| size | Size | small,medium,large | - |
| theme | Theme | fill,outline,underlined | fill |
| shape | Shape | square,circle | - |
| onChange | Value change callback | (value:string)=>void | - |
| onComplete | Completion callback | (value:string)=>void | - |
| onFocus | Triggered when an input receives focus | (event: FocusEvent<HTMLInputElement>) => void | - |
| onBlur | Triggered when an input loses focus | (event: FocusEvent<HTMLInputElement>) => void | - |
