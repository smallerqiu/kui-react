# InputOTP

Input for verification codes, one-time passwords, and other fixed-length values.

[Basic](./demo/basic.tsx?show=vertical)

- Supports per-digit input, full-code paste, keyboard navigation, and completion events.

[Custom length](./demo/length.tsx?show=vertical)

- Set the number of code digits with `length`.

[Theme and shape](./demo/theme.tsx?show=vertical)

- Provides light, outline, and underlined themes with square, round, and circular shapes.

[Size](./demo/size.tsx?show=vertical)

- Provides small, default, and large sizes.

[Disabled and read-only](./demo/state.tsx?show=vertical)

- Disabled state prevents interaction while read-only state remains focusable and copyable.

[Separator](./demo/separator.tsx?show=vertical)

- Set content between OTP fields with `separator`.

[Paste code](./demo/paste.tsx?show=vertical)

- Pasting a complete code splits it into the corresponding fields automatically.

[Validation](./demo/validator.tsx?show=vertical)

- `type` provides default character validation, and `validator` can customize allowed characters.

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
