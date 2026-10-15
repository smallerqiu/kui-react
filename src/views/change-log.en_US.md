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

### 3.2.0

`2026-10-12`

- `Menu`: Added arrow-key / Enter / Esc navigation; `Escape` closes only the current level.
- `Menu`: Popup lists are linked to their trigger through `aria-controls` / `aria-labelledby`, and a `horizontal` root declares `role="menubar"`.
- `Menu`: Fixed the vertical sub-menu animation where the outer panel opened first and the content followed.
- `Table`: Fixed missing header borders, sticky-row gaps, incomplete rounded corners and the blank block in the bottom-right corner when grouped headers are combined with fixed columns, `scroll.y` and `bordered`.
- `Table`: Grouped headers are rendered as per-column cells with `aria-labelledby` relations; fixed-column widths and sticky offsets now match the Vue build.
- `Table`: `rowKey` falls back to a stable key when the configured value is missing; `dataIndex` supports `a.b.c` nested paths.
- `Table`: Fixed `expandAllRows` re-expanding parents for asynchronous data and the virtual window start exceeding the row count.
- `Table`: Header sort buttons carry the missing accessibility semantics; built-in empty and filter strings now come from the locale bundle.
- Unified scrollbar styling so horizontal and vertical bars match; the dark-theme hover thumb no longer blends into the background.
- `Ripple`: Fixed wrapped content that could not be clicked and produced no ripple in Chrome 155.
- `Ripple`: Added the Chrome 156 `content="drawable"` attribute while Edge and earlier Chromium keep the previous path.
- `Ripple`: The WebGL overlay now brightens crests and darkens troughs, so it stays visible over light and dark pages.
- `FlameWrap`: Fixed wrapped content that could not be clicked in Chrome 155, and added the Chrome 156 `content="drawable"` attribute.
- `StatCard`: `title` / `desc` / `trend` and the `StatNumber` `prefix` / `suffix` no longer render an empty placeholder when given `false` or an empty string, while `0` still shows.
- `StatCard`: Fixed `items[].key` colliding with an item's array index, which moved a number animation onto the wrong entry.
- `StatNumber`: The `countup` mode now honours the system's reduced-motion preference and jumps straight to the target value.
- `StatCard`: `shape` is narrowed to `square` / `round` to match the Vue build — a card is a clipped surface where `circle` would cut off content, so an inherited `circle` falls back to `round`.
- `Table`: Columns without `width` now use 150 as their sizing baseline and the table takes a minimum width from the total of its columns (50 for the selection column), so a narrowing container scrolls horizontally instead of crushing columns and stacking header text vertically.
- `Table`: Fixed the flicker at a borderline window width where a fixed-column shadow and the horizontal scrollbar kept triggering each other — a shadow is now drawn only while that side can still scroll.
- `Tree`: Asynchronous `loadData` now requests a given node once; virtual scrolling no longer breaks the row height, so hover and selected rows fill it again.
- `Tree`: Nodes without a `key` get a stable fallback key derived from their path in the tree, so expansion and check state no longer cross between nodes.
- `Tree`: The expand-arrow button is removed from the tab order (`tabIndex={-1}`) so the tree keeps a single roving-tabindex `treeitem` and arrow keys no longer strand focus on an arrow.
- `DropdownButton`: Fixed the split button's ellipsis trigger not opening the menu — click, right-click and the arrow keys all drive it now, the trigger carries `aria-haspopup="menu"` and `aria-expanded`, and `trigger` selects `hover` / `click` / `contextmenu`.
- Popup components accept `destroyOnClose` (`Select`, `Cascader`, `TreeSelect`, `AutoComplete`, `Mentions`, `DatePicker`, `ColorPicker`, `Dropdown`, `DropdownButton`, `Tooltip`, `Poptip`, `Popconfirm`), defaulting to `true` so the panel content is discarded once the popup closes. This behaviour used to be fixed and could not be overridden; set it to `false` to keep unsubmitted form state inside the panel, at the cost of one hidden block per opened instance.
- `Modal` now keeps the page from scrolling while it is open and cycles `Tab` inside the dialog instead of jumping to the content behind it; page scrolling is restored as soon as the window closes or is destroyed.
- When `Modal` / `Drawer` windows are stacked, `Escape` closes only the topmost one; a dropdown open above a dialog takes the first `Escape` instead of dismissing the whole window.
- `Modal`, `Drawer` and `ModalPanel` accept `destroyOnClose` (default `true`), which discards the panel content after the window closes so the next opening starts fresh. Set it to `false` to keep a half-filled form, at the cost of one hidden block left in the page. Always-open panels (`panelOnly`) are not affected.
- Closing a `Modal` / `Drawer` now also closes the dropdowns, cascaders and submenus that were left open inside it, so no stray panel stays on the page after the window is gone.
- When the `onOk` of a confirm dialog returns a Promise, the component decides when to close: the window closes on success, while a failure only ends the button's loading state and keeps the dialog open so the user can fix the input and retry.
- Reopening a window before its close animation finishes no longer makes it disappear on its own a moment later.
- `Modal`: fixed `centered` having no effect, unit loss when `width` is passed as a string (same for `Drawer` `width` / `height`), and an empty title bar rendered when no `title` was passed. `ModalPanel` now takes the same arguments as the Vue build (always open, no mask).
- Imperative dialogs (`modal.confirm()` and friends) accept any node for `title` / `content` instead of strings only, every instance exposes `show` / `hide` / `destroy`, and they inherit the theme, locale and popup container of the surrounding `ConfigProvider`.
- Controls placed against the edge of a `Modal` body no longer have half of their focus outline clipped; content width, position and the footer gap are unchanged.
- `Tooltip` bubbles and their arrow indicator got their 1px border back, so the edge stays readable on dark backgrounds.
- `Table`: Added `ellipsis` to clip cell content that overflows the column width. Set it on a column to affect that column only, or on `Table` to cover every column at once (including `render` and slot content); a column keeps its full text with `ellipsis: false`. One line by default, `rows` clips to several. The hover tip is on by default and only appears when the cell really is clipped; `tooltip` replaces its text or turns it off with `false`.
- `Select` no longer crashes when the selected value or an option label is `NaN`. React used to re-render it up to the limit and throw "Too many re-renders", leaving the page to the error boundary; it now displays like any other number.
- `Modal` / `Drawer` close in one consistent callback order: `onOpenChange(false)` settles the open state first, then `onCancel` / `onClose` say which channel closed it. The state read inside those callbacks is already settled, so there is no need to close it again yourself.
- `Drawer`'s `title` no longer defaults to "Title" — omit it and there is no title text. The header still makes room for the close button and only disappears when `closable: false` is set with no title.
- `DatePicker`: Closing the panel with `Escape` after picking only one end of a range no longer leaves the half date in the box; it now falls back to the last committed range, the same as clicking outside.
- `DatePicker`: Typing a date into only the end box no longer shows a value that `onChange` never received. A range with one end missing is not a selection, and closing the panel clears it.
- `DatePicker`: Rejected manual input no longer snaps the box back to the date passed in first; it falls back to the current value, which for uncontrolled pickers is the last committed result.
- `DatePicker`: When a range controls only one end (`startDate` or `endDate`), the next pick no longer overwrites the end the parent provided; the panel keeps it and only fills the empty end.
- `DatePicker`: Picking the already selected date, or submitting the same value again, no longer fires a redundant `onChange`.
- `DatePicker`: Picking a time in the time columns while only one end of the range is chosen no longer emits that half range; the time stays in the box until the other end is filled in.
- `DatePicker`: The year and month panels now honour `disabledDate` — a year or month with no pickable day at all is greyed out, refuses clicks, and is skipped by `Tab`, while one that still has a pickable day remains clickable.
- `DatePicker`: The year and month highlight now follows the current value instead of wherever you happen to be browsing.
- `DatePicker`: Year and month cells can be picked with the keyboard (`Tab` to a cell, then `Enter` or Space), and the year / month labels in the header switch panels with the same keys.
- **Breaking change**: Built-in component text now defaults to English instead of Simplified Chinese. Without a `ConfigProvider`, strings in `DatePicker`, `Select`, `Table`, `Modal`, `Page` and friends render in English; pass a Chinese locale (`import zhCN from "react-kui/locale/zh-CN"`) at the application root to keep Simplified Chinese.
- `DatePicker` / `Select` / `Cascader` / `TreeSelect`: `theme="plain"` and `bordered={false}` now mean separate things — `plain` drops both the border and the surface, `bordered={false}` drops only the border, and the two can be combined; a disabled control under `plain` still reads as disabled.
- `Select` / `Cascader` / `TreeSelect`: a control with its border removed no longer grows a primary-colored border and a glow when the pointer moves over it.
- `Select` / `Cascader` / `TreeSelect` / `DatePicker`: `theme` now supports `outline`, `solid`, `dashed` and `underlined` — a 1px outlined box, a primary-filled block whose text and icons invert, a dashed frame, and a single bottom rule that turns primary on focus.
- `Cascader`: a `theme="fill"` field no longer grows a border when you hover it.
- `Select` / `Cascader` / `TreeSelect` / `DatePicker`: `theme="default"` now looks exactly like omitting `theme` — both land on the control's own default appearance.
- `DatePicker`: focusing a field that has no border no longer draws a focus ring, matching the select-family controls.
- `Input` / `TextArea` / `InputNumber`: `theme` now supports `outline`, `solid`, `dashed` and `underlined` — a 1px outlined box, a primary-filled block whose typed text, placeholder and inline icons invert, a dashed frame, and a single bottom rule that turns primary on hover and focus.
- `Input` / `TextArea` / `InputNumber`: `theme="default"` now looks exactly like omitting `theme` — both land on the component's own default appearance.
- `Input` / `TextArea` / `InputNumber`: a `theme="plain"` field no longer grows a border when you hover it and still reads as disabled; `plain` and `underlined` drop the focus ring, matching the select-family controls.

### 3.1.2

`2026-09-26`

- `Select`: Preserve selected labels when remote search results are empty, loading, or omit selected options; dim the selected text when refocusing single-select remote search, matching local search; update the search input width immediately while typing.

### 3.1.1

`2026-09-25`

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
