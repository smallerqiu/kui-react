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

### 3.1.1

`2026-09-24`

- `Carousel`: Added horizontal and vertical mouse/touch gestures with release settling, controlled by `swipeable`; fixed display and state synchronization issues with dynamic slides and consecutive navigation.
- `Page`: Added container-responsive pagination that reduces page numbers, then switches to Simple while retaining the page-size selector. The full layout returns when space is available; set `responsive` to `false` to opt out.
- `Input` / `InputNumber`: Refactored shared internals to separate styling and controls; removed the previously exposed internal `inputType` and `controls` interfaces.
- AI assistance: Added CLI queries for component APIs, examples, and templates, source validation, and updates to project AI guidance. Added icon-prop misuse checks.

### 3.1.0

`2026-09-23`

- Unify state APIs: replace `defaultOpen`, `defaultChecked`, `defaultCurrent`, `defaultFileList` and `default*Keys` with their unprefixed props; rename Table `defaultExpandAllRows` to `expandAllRows`. State props initialize local state, allow interaction, and synchronize external changes. Update usages when upgrading.
- `Badge` numeric counts now roll upward for increases and downward for decreases, including carry and borrow; corrected vertical alignment of the count.
- `StatNumber` rollup animations now determine direction independently for each digit: increasing digits move upward, decreasing digits move downward, and unchanged digits stay still. Improved transitions across large value changes and respect for reduced-motion preferences.
- Added a dedicated `StatNumber` documentation page with formatting, animation duration, and dynamic-value examples, separate from `StatCard`.
- Fixed `Slider` tooltips disappearing when the pointer leaves the thumb during an active drag.
- Improved light-theme selected-date hover contrast in `DatePicker` and removed unintended interaction borders from fill-style controls.
- Improved scoped theme colors and radii, nested light/dark themes, and explicit CSS variable overrides; added browser-based theme regression checks.
- Completed public API and event documentation, including callback parameters and examples.
- Migrated repository build and validation scripts to TypeScript and added Node-script type checking. Contributor tooling requires Node.js 24 or later; published ESM/CommonJS entry points remain supported.
- Alert and Tag now remove their content after the exit animation and expose `afterClose` (`onAfterClose` in React). Update parent visibility or tag list data in this callback to unmount components without interrupting the animation.

#### Shared popup infrastructure

- Added the public `Popup` component and related types, unifying triggers, placement, arrows, containers, outside-click dismissal, Escape handling, and nested popup management.
- Migrated `Dropdown`, `Tooltip`, `Poptip`, `Popconfirm`, `Select`, `TreeSelect`, `Cascader`, `AutoComplete`, `Mentions`, `DatePicker`, and `ColorPicker` to the shared popup infrastructure.
- Fixed switching HEX / RGB / HSL in `ColorPicker` incorrectly closing the outer panel.
- Fixed internal `Teleport` targets not updating when a target appears later, is replaced, or a container callback returns a different element.

#### Component interactions and styling

- Improved disabled / readonly interactions across components and their items, preventing unintended clicks, hover/active feedback, and incorrect cursors.
- Fixed rapid consecutive `Carousel` navigation, out-of-sync content and outer collapse animations in `Collapse`, and leftover outer height when closing `Notice`.
- Improved `Cascader` dropdown animation and width, and aligned `QRCode` status overlays with the Vue version.
- Fixed `Table` fixed-column/header alignment, inconsistent row hover backgrounds, and insufficient separation from action buttons. Empty content is no longer displayed while loading an empty table.
- Improved `Tree` dragging and checkbox interactions so checking does not toggle expansion. Refined directory-mode checkbox and row hover contrast in light and dark themes.
- Improved `ColorPicker` theme / shape support, `Input` prefix/suffix layout, and `DatePicker` ranges, disabled constraints, and state synchronization. Aligned `VirtualList` examples.

#### Types and maintenance

- Completed component event callback and related public type exports; shared multi-select tag and popup logic to reduce duplication.
- Added regression coverage for nested popups, Teleport lifecycle, disabled interactions, and component behavior.

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

#### New capabilities and layout

- Added `Segmented` for segmented selection, replacing RadioGroup's card-style selection use case.
- Added browser-style `Tabs`; improved clearing, disabled states, and tag limits in `InputTag`.
- Added custom scroll-container support to `BackTop`; improved `Splitter` resizing and accessibility.
- Improved layout props and style forwarding in `Grid`, `Row`, and `Col`; fixed Layout.Sider shrinking inside flex containers and duplicate registration.
- Improved `Form` validation and accessibility associations; expanded keyboard support and semantics for clear buttons, menus, pagination, steps, and breadcrumbs.
- Fixed link-button prop forwarding and added `Input`'s `onInput` event and stronger icon mapping types.

#### AI support and release validation

- Added component metadata, AI development guides, example templates, CLI, and MCP tools for component queries and usage validation.
- Added AI evaluations and asset consistency checks to release validation.
- Improved package export checks and temporary-consumer installation tests covering ESM / CommonJS, declarations, styles, and tool entry points.

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
