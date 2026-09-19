# Changelog

![react-kui](https://img.shields.io/npm/v/react-kui.svg?style=flat-square)

Version 3.x supports `React 19`. If you encounter any issues, please submit an issue on https://github.com/smallerqiu/kui-react/issues.

```bash
npm install react-kui@latest --registry=http://registry.npmjs.org
```

Vite seems to cache builds—you can manually clear it:

```bash
rm -rf node_modules/.vite
```

### 3.0.0

`2026-09-19`

#### Upgrade notes

- Rebuilt for React 19, with component features and APIs aligned with kui-vue where applicable. Requires React and react-dom 19.2 or later in the 19.x series.
- Standardized input-value APIs on `value` and removed the corresponding `defaultValue` props. Synchronize application data through `onChange`. Selection, overlay visibility, and upload lists retain their specific `checked`, `open`, and `fileList` APIs; follow each component's migration requirements.

#### Component improvements and fixes

- `ConfigProvider`: Fixed `size`, `shape`, and `theme` not reaching child components. Supports nested configuration and explicit component overrides.
- `Form`: Improved field synchronization, validation, reset behavior, and inheritance of control size, theme, shape, disabled, and readonly states.
- `Upload`: Improved picture-wall sorting with card borders and rounded corners preserved during dragging, while other images move aside immediately. Fixed forms still reporting missing files after uploads and file-state synchronization after reset.
- `Image`: Improved dragging in image previews.
- `DatePicker`: Fixed the selected time option not being centered when opening the time panel.
- `Menu`: Improved nested collapse/expand animations, state synchronization, and keyboard interactions. Made left/right submenu popup spacing consistent.
- `Switch`: Fixed thumb position jumps during pressing, release, and toggling. Disabled and readonly switches no longer show pressed deformation.
- `Select`: Fixed missing placeholder text when the value is an empty string.
- `Collapse`: Improved numeric key support and made closing behavior consistent for equivalent numeric and string keys.
- Improved component declarations and fixed TypeScript NodeNext type resolution for ESM and CommonJS component imports.

### 2.0.0

`2021-07-10`

- Full refactor
- Fixed multiple bugs and improved overall user experience
- Aligned feature set with `kui-vue`

### 1.0.8

`2018-08-08`

- Upgraded icon library to v4.3.0 for standardized usage, clearly distinguishing iOS and Android line weights
- Fixed stuttering issues when closing `Message` and `Notice` components
- Fixed the `gutter` bug in `Row` and `Col` components
- Improved animation transitions across several components for smoother performance
- Added `iconAlign` prop to the `Input` component to control icon positioning
- Fixed icon display issue in the `TimeLine` component
- Fixed positioning issue in the `Poptip` component
- Fixed positioning issue in the `Tooltip` component
- Fixed scrolling issue in the `Tabs` component
- Added `animated` prop to `Tabs` to control transition animations
- Removed unnecessary event bindings across various components
- Enabled component search in documentation

### 1.0.7

`2018-07-15`

- Resolved custom `style` and `className` handling across all components
- Optimized `Row` and `Col` child components

### 1.0.6

`2018-07-14`

- Fixed component import issues

### 1.0.5

`2018-07-13`

- Fixed build/compilation issues

### 1.0.4

`2018-07-12`

- Refined details and made adjustments to the Menu component

### 1.0.3

`2018-07-11`

- Build optimization

### 1.0.2

`2018-07-11`

- Fixed custom `style` issue in the Breadcrumb component
- Added a full suite of Layout components

### 1.0.1

`2018-07-10`

- Fixed incorrect `ref` propagation in certain components under React 16.x
- Fixed line-wrapping bug in DatePicker under specific conditions

### 1.0.0

`2018-07-01`

- Version 1.0 released; entered public beta

### 0.0.1

`2018-05-27`

👏 🚩 Development initiated
