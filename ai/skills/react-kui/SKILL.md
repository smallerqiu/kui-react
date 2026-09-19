---
name: react-kui
description: Build React 19.2+ applications with react-kui. Use when creating, reviewing or troubleshooting interfaces that depend on react-kui.
---

# React KUI

1. Confirm the application uses React 19.2+. Use named component imports from `react-kui` and icon definitions from `kui-icons`.
2. Import `react-kui/style/index.css` once at the application entry.
3. Read installed-version metadata (`react-kui/metadata`) before choosing props or callback signatures. Prefer it over online documentation for another version.
4. Use JSX/TSX and React state. Never translate Vue v-model, named slots or app.use registration literally. The image export is `KImage`.
5. Input onChange receives a value, not a DOM event. Switch uses checked/onChange; Modal uses open/onOpenChange. A controlled Form model must be updated through onChange(nextModel).
6. Query MCP APIs by section. Read example summaries before fetching source. Use the form/table/modal-editor templates for business flows; their requests are local mocks, not production endpoints.
7. Run validate_kui_usage, read skipped checks, then run application typecheck, lint and relevant interaction tests. Static valid does not mean full type/runtime correctness.

See `references/components.md` for versioned resources and `references/mcp.md` for tools and setup.
