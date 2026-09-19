# Quick Start

The npm package for KUI React is `react-kui`. Import components directly into your React application and load the stylesheet once at the entry point. Components include TypeScript declarations; the examples below use TSX.

## 1. Prepare a React project

For an existing application, continue to installation. To create a new project, use the Vite React + TypeScript template:

```bash
pnpm create vite my-app --template react-ts
cd my-app
pnpm install
```

The current library targets React 19.2+. For an existing project, update `react` and `react-dom` together to the latest 19.x releases:

```bash
pnpm add react@^19 react-dom@^19
```

For TypeScript, also use the corresponding React types:

```bash
pnpm add -D @types/react@^19 @types/react-dom@^19
```

## 2. Install the library and load its styles

```bash
pnpm add react-kui
```

Import the full stylesheet and mount your application in `src/main.tsx`:

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "react-kui/style.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

The `root` ID refers to `<div id="root"></div>` in the Vite template's `index.html`. Load the stylesheet once; your application's override styles can follow it.

## 3. Use components and events

Save the following example as `src/App.tsx`. Use named imports for components and pass functions through JSX props such as `onClick`. Compatible bundlers can tree-shake component code; the stylesheet imported above contains the full library styles.

[Components and click events](./buttons.tsx?show=vertical)

Start the development server:

```bash
pnpm dev
```

If you use icons, add the icon package as a dependency of your application:

```bash
pnpm add kui-icons
```

```tsx
import { Plus } from "kui-icons";
import { Button } from "react-kui";

export default function AddButton() {
  return <Button icon={Plus}>Add</Button>;
}
```

The image component is exported as `KImage`; you can give it a local import alias. Switch is also used directly as a JSX component without registration:

[Component names and import aliases](./image.tsx?show=vertical)

## 4. Synchronize values with React state

Input components usually pass the value directly to `onChange`. For Input, the argument is a string, so you can pass a state setter without reading `event.target.value`.

[Input values and switch state](./value.tsx?show=vertical)

| Component category                           | Props and callbacks     | Behavior                                                                                                                                                                                        |
| -------------------------------------------- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Value inputs such as Input and Select        | `value` / `onChange`    | `value` initializes the component and synchronizes later external changes. User interactions also update the internal value. Pair these props with React state to keep the parent synchronized. |
| Checked controls such as Switch and Checkbox | `checked` / `onChange`  | Passing `checked` makes the parent control the state. Use `defaultChecked` for an initial state only. Switch reports a value directly; Checkbox reports an object containing `checked`.         |
| Overlays such as Modal and Drawer            | `open` / `onOpenChange` | Passing `open` makes the parent control visibility. Use `defaultOpen` for initial visibility only.                                                                                              |

A fixed `value` does not lock an Input. Use `disabled` or `readOnly` to prevent editing. Create new arrays or objects when updating values rather than mutating them in place. Check each component's API for callback arguments; for example, Checkbox accepts `onChange={({ checked }) => setChecked(checked)}`.

## 5. Bind fields with Form

Form synchronizes a data object through `model` and `onChange`. A FormItem's `prop` identifies its field. Supported input components inside a FormItem receive their value and change binding from the form, so you do not need to supply a separate `value` for each field.

[Form fields and disabled state](./form.tsx?show=vertical)

`Form disabled` is inherited by form controls, including controls without a `prop` binding. A control can override it explicitly with `disabled={false}`. See [Form](/components/form-en) for validation, nested fields, and submission methods.

## 6. Optional global configuration

Use ConfigProvider to configure language, size, and appearance for a component tree. It affects descendant components, supports nesting, and lets explicit component props take priority.

```tsx
import { Button, ConfigProvider } from "react-kui";
import en from "react-kui/locale/en";

export default function App() {
  return (
    <ConfigProvider locale={en} size="small" theme="outline">
      <Button>Default size: small</Button>
      <Button size="large">Override: large</Button>
    </ConfigProvider>
  );
}
```

The `theme` values `fill`, `outline`, and `plain` control component appearance. See [Dark mode](/guide/dark-mode-en) for light and dark page colors. See [ConfigProvider](/components/config-en) for further configuration. Import components and types from `react-kui`, and locale resources from `react-kui/locale/*`.
