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
- **Breaking change**: `theme` no longer accepts `default`. Leave `theme` unset - on `ConfigProvider` too - to get the appearance a component was built to have; the six values are `fill` / `outline` / `plain` / `solid` / `dashed` / `underlined`. On `Button`, `theme="default"` used to be read as the `type="default"` appearance, so a `type="link"` or `type="text"` button picked up a filled background.
- `DatePicker` / `Select` / `Cascader` / `TreeSelect`: `theme="plain"` and `bordered={false}` now mean separate things — `plain` drops both the border and the surface, `bordered={false}` drops only the border, and the two can be combined; a disabled control under `plain` still reads as disabled.
- `Select` / `Cascader` / `TreeSelect`: a control with its border removed no longer grows a primary-colored border and a glow when the pointer moves over it.
- `Select` / `Cascader` / `TreeSelect` / `DatePicker`: `theme` now supports `outline`, `solid`, `dashed` and `underlined` — a 1px outlined box, a primary-filled block whose text and icons invert, a dashed frame, and a single bottom rule that turns primary on focus.
- `Cascader`: a `theme="fill"` field no longer grows a border when you hover it.
- `Select` / `TreeSelect`: a `theme="fill"` field keeps the border an app draws through `--kui-theme-fill-border` under the pointer, matching `Cascader`.
- `Cascader` / `ColorPicker` / `InputTag` / `InputOTP` now turn red inside an invalid form item; previously only the `Input` / `Select` families changed colour. Every `InputOTP` cell turns red together.
- A red border inside an invalid form item survives interaction: hovering, focusing or opening the panel of a `Select` / `TreeSelect` / `Cascader` / `ColorPicker` / `InputTag` / `InputOTP` keeps both the red edge and its red glow, under any of the six `theme` values.
- Inside an invalid form item the focus halo turns red too, so a focused or opened field no longer pairs a red border with a primary-coloured glow; a `theme="solid"` field keeps its inverted white halo, because red would be hard to see on a filled surface.
- `DatePicker`: focusing a field that has no border no longer draws a focus ring, matching the select-family controls.
- `Input` / `TextArea` / `InputNumber`: `theme` now supports `outline`, `solid`, `dashed` and `underlined` — a 1px outlined box, a primary-filled block whose typed text, placeholder and inline icons invert, a dashed frame, and a single bottom rule that turns primary on hover and focus.
- `Input` / `TextArea` / `InputNumber`: a `theme="plain"` field no longer grows a border when you hover it and still reads as disabled; `plain` and `underlined` drop the focus ring, matching the select-family controls.
- `InputTag` / `InputOTP`: `theme` now supports `outline`, `solid`, `dashed` and `underlined` — a 1px outlined box, a primary-filled block, a dashed frame, and a single bottom rule that turns primary on hover and focus.
- `InputTag`: on `theme="solid"` the added tags, the typed text, the placeholder and the clear icon all invert. `InputOTP`: every cell follows `theme`, its character inverts on the solid surface, and a disabled OTP still reads as disabled.
- `InputTag` / `InputOTP`: a `theme="plain"` box no longer grows a border when you hover it; `plain` and `underlined` drop the focus ring, matching the select-family controls.
- `ColorPicker`: `theme` now supports `outline`, `solid`, `dashed` and `underlined` — a 1px outlined box, a primary-filled block, a dashed frame, and a single bottom rule that turns primary on hover and while the panel is open.
- `ColorPicker`: on `theme="solid"` the colour text next to the swatch inverts and the surface deepens on hover and while the panel is open; the swatch itself still shows the picked colour.
- `ColorPicker`: with `theme="fill"` or `theme="plain"`, a disabled picker keeps its disabled background and border.
- `Tag`: `theme` now supports `outline`, `solid` and `dashed` — a 1px outlined chip, a primary-filled chip whose label and close icon invert, and a dashed frame. `theme="underlined"` lands on `fill`, since a chip has nothing to underline.
- `Tag`: setting `color` now wins over `theme` — preset and custom colours keep their own border and label colour instead of being repainted by the theme surface. A preset-colour tag used to pick up the default grey fill and keep only its text colour.
- `Select` / `TreeSelect`: with `theme="solid"` the selected chips take a translucent inverted surface instead of the same primary as the box around them, and with `theme="dashed"` they keep a solid outline instead of inheriting the dashes. This is what `InputTag` already did; the three now match.
- `Checkbox` / `Radio`: a square or a dot has two looks — `fill` (a shallow filled surface) and `outline` (a bordered one). `outline` now really draws its border, and its colour follows `--kui-theme-outline-border` like any other outlined control; `fill` takes its edge from `--kui-theme-fill-border`. Neither variable reached a check box or a radio before.
- `Checkbox` / `Radio`: leaving `theme` unset gives the shallow `fill` surface; writing `default` used to fall back to the bordered base look, so it changed the appearance. `solid`, `plain`, `dashed` and `underlined` mean nothing on a box you cannot type into and also land on `fill`.
- `CheckboxGroup` / `RadioGroup`: `theme` reaches every square and dot in the group, whether it is written on the group or inherited from `ConfigProvider`. In the `type="button"` style only `fill` joins the buttons with one divider; every other tier keeps its own adjacent borders. The checked and disabled states always win over `theme`.
- `Card` / `FeatureCard` / `StatCard`: `theme` gains `solid` and `dashed`. `solid` fills the card with the primary colour and inverts its title, description, icon and head divider, while a `StatCard` trend marked `success` / `danger` / `warning` keeps its own colour; `dashed` draws a dashed border. `StatCard` now accepts the same tiers as the other two cards instead of only `fill`, `outline` and `plain`.
- A card no longer loses both its background and its border when `theme="underlined"` is set, whether written on the card or inherited from `ConfigProvider`: an underline belongs to a control you type into, so a card falls back to its own `fill` look.
- `Collapse` / `FeedbackPanel`: `theme` gains `solid` and `dashed`. `solid` fills the box with the primary colour and inverts its titles, description, detail plate and icon, while a disabled panel inside a `Collapse` still reads as disabled; `dashed` draws a dashed frame and keeps the row dividers solid. The severity stripe beside a `FeedbackPanel` reports its `kind`, so no `theme` repaints it.
- `Collapse`: with `sample` and `theme="solid"`, each panel carries the primary surface itself instead of one plate painted behind them.
- `FeedbackPanel`: `theme="outline"` no longer paints a page-coloured background of its own, so a panel inside a card or a tinted container shows that container's background, like any other outlined surface.
- `CheckCard` / `CheckCardGroup`: `theme` gains `solid` and `dashed`, and a check card no longer accepts only `fill` and `outline`. `solid` fills the card with the primary colour and inverts its title, description, leading icon and corner tick — the selected disc turns light with the mark drawn in the plate colour; `dashed` draws a dashed frame. `theme="underlined"` lands on `outline`, an underline being the spelling of a control you type into.
- `CheckCardGroup`: `theme` reaches every card inside the group, whether it is written on the group or inherited from `ConfigProvider`, and a tier written on the card itself still wins.
- `CheckCard`: a disabled card greys its title, description and icon along with its border and its tick.
- **Breaking change**: `CheckCardTheme` is no longer exported; every `theme` prop uses the library's shared `ThemeType`.
- `Alert`: `theme` gains `solid` and `dashed`. `solid` fills the box with the colour the alert is already reporting (`error` red, `success` green, `warning` orange, `info` primary) and inverts its text, mark and close button, so an error and a success stay two different blocks instead of both turning primary; `dashed` draws a dashed frame. `theme="underlined"` lands on `fill`, an underline being the spelling of a control you type into.
- `Alert`: `theme="outline"` no longer draws its frame in the page's text colour. The border takes the library's border colour like every other outlined surface, so `--kui-theme-outline-border` now recolours it.
- `Image`: `theme` gains `solid` and `dashed`. `solid` fills the plate the picture sits on with the primary colour and inverts the loading spinner, the failed-load placeholder and anything passed as children; `dashed` draws a dashed frame. `theme="underlined"` lands on `plain`, an underline being the spelling of a control you type into.
- `Image`: `theme="outline"` now draws an actual frame. It used to set only a border colour on an element that has no border width, so nothing appeared and `--kui-theme-outline-border` had nothing to recolour.
- `QRCode`: `theme` gains `solid` and `dashed`. `solid` fills the box behind the code with the primary colour and inverts mask text such as the "expired" message; `dashed` draws a dashed frame. `theme="underlined"` lands on `outline`.
- `QRCode`: `theme="plain"` now only removes the surface. It keeps the 12px of padding the frame holds and fades the border instead of deleting it — taking the frame and the padding away together is still `bordered={false}`.
- `Page`: `theme` gains `solid` and `dashed`. `solid` fills the page boxes with the primary colour, inverts the digits and the `…` mark with them, makes the current page a white box with primary digits and lightens its own colour on hover; the total-count line and the prev/next arrows stay on the bar's background. `dashed` draws a dashed frame and leaves the `…` cell unframed. `theme="underlined"` lands on `fill`.
- `Page`: `theme="plain"` does something now. The bar only ever spelled out `fill` and `outline`, so asking for `plain` changed nothing.
- `Page`: the selected page takes its state colour on the cell itself. Under `theme="fill"` only the digits turned primary on a plate that was still the hover grey, and under `theme="outline"` the frame stayed the default border colour.
- `Page`: the tier it hands to its own page-size selector and jump-to input is one the bar can paint, so `theme="underlined"` no longer leaves a flat bar with an underlined input inside it.
- `Kanban`: `theme` gains `plain`, `solid` and `dashed`, and is now inherited from `ConfigProvider`. The tier paints each column — `plain` leaves it without a plate or a frame, `solid` fills it with the primary colour and inverts its title, its count and the cards inside it, `dashed` draws a dashed frame. `theme="underlined"` on a board falls back to `fill`.
- `Kanban`: the hint that marks the column a card is being dragged over now appears. It used to sit under the column's own appearance, so it stayed invisible even on a board's default `fill`.
- `Kanban`: on a `theme="solid"` column the keyboard ring on a card is a pale wash of the plate's own ink instead of primary on primary, and the status dot in a column header keeps the colour `column.color` gives it under every tier.
- `Kanban` columns now read the local appearance variables: `--kui-theme-fill-bg` / `--kui-control-bg-fill` set the `fill` plate and `--kui-theme-outline-border` / `--kui-control-border` set the frame, none of which reached a board before.
- `Transfer`: `theme` gains `plain`, `solid` and `dashed` and is now inherited from `ConfigProvider` / `Form`. The tier paints the two lists — `plain` leaves them without a plate or a frame, `solid` fills both with the primary colour and inverts their titles, item descriptions, header and footer dividers, with hover, selection and the keyboard ring turning into a pale wash of the plate's own ink, and `dashed` draws a dashed frame. `theme` used to accept only `outline` and `fill`. `theme="underlined"` on a transfer lands on `outline`.
- `Transfer`: on `theme="solid"` the two search boxes take a shallow filled surface instead of primary on primary, and a disabled transfer — the whole thing or one row of it — falls back to the library's disabled colour for its list text, item descriptions and footer.
- `ListPanel`: `theme` gains `solid` and `dashed` — it used to accept only `fill`, `outline` and `plain`. `solid` fills the whole panel with the primary colour and `dashed` draws a dashed frame; the tier is painted on the card the panel sits on, so `bordered={false}` only takes the frame away without changing tier.
- `ListPanel`: on `theme="solid"` the result summary now takes the plate's light ink and the bulk-action strip swaps its grey plate for a pale wash over the primary, instead of a line of dark text and a stray grey block on a primary panel. Everything else you put inside the panel follows the panel's own text colour.
- `theme="underlined"` on a list panel — written on it or handed down by `ConfigProvider` — now falls back to the panel's own `outline` instead of the card's `fill`.
- `Form`'s `size` / `shape` / `theme` now apply only to the controls inside it: an appearance written on `Form` no longer reaches the `Card`, `Collapse`, `FeedbackPanel`, `Alert`, `Table`, `Page`, `Tag` or `Button` sitting in the same form, and those keep inheriting from `ConfigProvider`. `<Form size="small">` used to shrink the cards, panels and pagination bar around its fields, and `<Form theme="solid">` used to plate them in the primary colour. To change the look of a whole page, put the appearance on `ConfigProvider` or on the components themselves.
- **Breaking change**: the type of `theme` now lists only the tiers a component can draw. Surface components - `Card` / `FeatureCard` / `StatCard` / `Collapse` / `FeedbackPanel` / `CheckCard` / `Alert` / `Image` / `QRCode` / `Page` / `Kanban` / `Transfer` / `ListPanel` / `Tag` / `Button` / `DropdownButton`, plus `RadioGroup` / `RadioButton` - take the five `fill` / `outline` / `plain` / `solid` / `dashed` (`SurfaceThemeType`); `Checkbox` / `Radio` / `CheckboxGroup` take the two `fill` / `outline` (`MarkThemeType`); `ConfigProvider` and `Form` still accept all six. Writing a tier a component cannot draw - `theme="underlined"` on a card, for example - is now a TypeScript error; nothing changes at runtime and the component still falls back to its own appearance.
- **Breaking change**: the `shape` of surface components - `Card` / `ListPanel` / `FeatureCard` / `FeedbackPanel` / `Table` / `Descriptions` / `Collapse` - now lists only `square` / `round` (`SurfaceShapeType`), matching the Vue build: a surface cuts its corners square or rounds them, and `circle` would clip its own content, so writing `shape="circle"` is now a TypeScript error and a surface that inherits `circle` from `ConfigProvider` draws `round`. `Collapse` and `FeedbackPanel` kept their larger default corner on `circle`; they now round it like every other surface.
- `TreeSelect` no longer grows a halo when its panel opens: a filled, plain, solid or underlined box, and a borderless or disabled one, keep only the focus ring, the way `Select` and `Cascader` already do; `outline` and `dashed` keep the shallow glow.
- `Input` / `Textarea` under `theme="solid"` no longer grow a pale halo when focused - on a primary fill it was never readable, and they now match `InputNumber` / `InputOTP` / `InputTag` / `ColorPicker` by keeping only the focus ring.
- A disabled input no longer glows while it has the caret, and a disabled `ColorPicker` stays flat even when its panel is held open through `open`. Tiers that keep their border (`outline` / `dashed`) still glow on focus and on opening.
- Turning off `Cascader`’s border with `bordered={false}` now removes it for real: `theme="outline"` and `theme="dashed"` no longer leave a frame behind, and `theme="fill"` no longer keeps its tint, the way `Select`, `TreeSelect` and `DatePicker` already behave.
- An input wrapped in an `InputGroup` inside a form item still counts as that item’s control: the form value fills it, clicking the label focuses it, and the validation message and appearance tier follow it.
- In a vertical `Form` (`layout="vertical"`) a `block` control now really fills the row: previously every field shrink-wrapped to its own content width, so the right edges inside one form did not line up.
- `Cascader` now reads its placeholder from the locale when `placeholder` is not set, so an English interface no longer shows 请选择.
- `Badge`: a status dot now needs `status` or `color` to be set, so an empty `<Badge />` or `count={0}` no longer shows a grey dot nobody asked for.

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
