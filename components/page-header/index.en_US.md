# PageHeader

Displays a page title, description, breadcrumb, and action area.

## Examples

[Basic Usage](./demo/basic.tsx?show=vertical)

- Displays a title, description, and action buttons.

[Simple Mode](./demo/simple.tsx?show=vertical)

- Shows only the page title and description.

[Custom Content](./demo/slots.tsx?show=vertical)

- Use ReactNode values to customize the breadcrumb, back button, title, description, actions, and additional content.

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| title | Title | ReactNode | - |
| description | Description | ReactNode | - |
| breadcrumb | Breadcrumb area | ReactNode | - |
| back | Back button area | ReactNode | - |
| actions | Action area | ReactNode | - |
| children | Additional content | ReactNode | - |