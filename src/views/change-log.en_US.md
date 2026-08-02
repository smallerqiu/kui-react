# Changelog

![react-kui](https://img.shields.io/npm/v/react-kui.svg?style=flat-square)

Version 3.x supports `React 19`. If you encounter any issues, please submit an issue on https://github.com/smallerqiu/react-kui/issues.

```bash
npm install react-kui@latest --registry=http://registry.npmjs.org
```

Vite seems to cache builds—you can manually clear it:

```bash
rm -rf node_modules/.vite
```

### 3.0.0

`2026-07-20`

- Complete refactor based on `React 19`, aligned with `kui-vue`

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
