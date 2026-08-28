# Typography

Provides consistent semantics and visual styles for headings, paragraphs, and inline text.

## Examples

[Basic](./demo/basic.tsx?show=vertical)

- Use headings, paragraphs, and inline text to create hierarchy.

[Title Levels](./demo/title.tsx?show=vertical)

- Use `tag` to render h1 through h6 title levels.

[Semantic Types](./demo/type.tsx?show=vertical)

- Use `type` to express different semantic meanings.

[Text Styles](./demo/style.tsx?show=vertical)

- Show strong, italic, underline, deleted, marked, and inline code styles.

[Ellipsis](./demo/ellipsis.tsx?show=vertical)

- Support multiline ellipsis with expand and collapse.

[Copy and Edit](./demo/interactive.tsx?show=vertical)

- Text can be copied and edited in place.

## API

`Typography`, `TypographyText`, `TypographyParagraph`, and `TypographyTitle` share these properties.

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| value | Controlled text | string | - |
| defaultValue | Initial uncontrolled text | string | - |
| tag | Rendered HTML tag | TypographyTag | span |
| type | Semantic color | TypographyType | - |
| strong | Strong style | boolean | false |
| italic | Italic style | boolean | false |
| underline | Underline style | boolean | false |
| delete | Deleted style | boolean | false |
| mark | Mark style | boolean | false |
| code | Inline code style | boolean | false |
| disabled | Disabled state | boolean | false |
| copyable | Allow copying | boolean\|TypographyCopyableOptions | false |
| editable | Allow editing | boolean\|TypographyEditableOptions | false |
| ellipsis | Ellipsis configuration | boolean\|number\|TypographyEllipsisOptions | false |
| onCopy | Called after copying | (text: string) => void | - |
| onChange | Called after editing | (text: string) => void | - |