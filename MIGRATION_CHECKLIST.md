# kui-vue → react-kui migration checklist

This checklist tracks behavioral parity, React API consistency, and release readiness. A checked
item must pass ESLint, TypeScript, the relevant tests, and the documentation build.

## Quality baseline

- [x] React 19 and TypeScript build
- [x] Full `components` and `src` ESLint pass
- [x] Documentation production build
- [x] Remove Vue-only `modelValue` and `v-model` APIs
- [x] Remove React Fast Refresh export warnings
- [x] Library ESM, CJS, CSS, and declaration builds
- [x] Installed-package import/require smoke test

## React API conventions

- [x] Value components use `value`, `defaultValue`, and `onChange`
- [x] Visibility components use `open`, `defaultOpen`, and `onOpenChange`
- [x] Boolean input components use `checked`, `defaultChecked`, and `onChange`
- [x] ReactNode content consistently replaces Vue slots
- [x] Public prop and callback types are exported from `react-kui`
- [x] Controlled and uncontrolled behavior is covered by tests

## High-risk behavioral parity

- [x] DatePicker: modes, ranges, time panels, placeholders, disabled dates, locale
- [x] Select and TreeSelect: search, multiple values, tags, clearing, keyboard behavior
- [x] Menu: inline expansion, collapse animation, selection, controlled open keys
- [x] Form and inputs: validation, reset, prefix/suffix/control content
- [x] Table and Tree: selection, expansion, sorting, loading, empty states
- [x] Upload: selection, validation, transform, progress, cancellation
- [x] Modal and Drawer: controlled visibility, focus, mask, Escape, global API
- [x] Tooltip, Poptip, Popconfirm, ColorPicker: placement, arrows, transitions, outside click
- [x] Carousel, Tabs, Collapse, Slider: controlled state and transition boundaries

## Documentation and demos

- [x] Demo imports use `react-kui`
- [x] Demo source is editable, highlighted, and copyable
- [x] Horizontal and `?show=vertical` demo layouts
- [x] Every public prop in the API tables matches its TypeScript interface
- [x] Every Vue demo has a React equivalent or an intentional migration note
- [x] All demos are included in a production documentation build

## Tests

- [x] Vitest and React Testing Library setup
- [x] Controlled/uncontrolled value tests
- [x] Open/close and outside-click tests
- [x] Keyboard and focus tests
- [x] Transition lifecycle tests
- [x] Locale and ConfigProvider tests
- [x] Public package export smoke test

## Release readiness

- [x] No Vue terminology or runtime dependency remains
- [x] Package `exports`, style entry, and declaration entry verified
- [x] Tree-shaking smoke test
- [x] Bundle size report reviewed
- [x] README installation and usage examples verified against the packed package
