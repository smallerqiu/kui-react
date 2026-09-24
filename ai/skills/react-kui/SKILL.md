---
name: react-kui
description: Build React 19.2+ applications with react-kui. Use when creating, reviewing or troubleshooting interfaces that depend on react-kui.
---

# React KUI

## Read installed-version resources

Run `pnpm exec react-kui-ai paths` to locate the installed Skill and metadata.
`react-kui/metadata` is a package export, not a directory. It resolves with
`node -p "require.resolve('react-kui/metadata')"`. The physical fallback is
`node_modules/react-kui/ai/kui-components.json`.

Without MCP, query `pnpm exec react-kui-ai api Input --section props` and
`api Input --section behavior`. Use `search`, `examples`, and `example`
to fetch only relevant content; run `help` for exact arguments. Older releases
may only support init: use the metadata file or MCP rather than inventing commands.
Read [references/components.md](references/components.md) for resource boundaries;
read [references/mcp.md](references/mcp.md) only when configuring or using MCP.

## Contracts that change implementation

- Import from `react-kui`, icons from `kui-icons`, and `react-kui/style/index.css` once.
- Button.icon takes IconType[] data (for example Search), not JSX, h(Icon), a VNode
  or an icon-name string. Input prefix/suffix are renderable content, unlike icon.
- Use React 19.2+, JSX/TSX, className and React state/callbacks, not Vue bindings.
- Input onChange receives a string and uses synchronized local state; do not
  assume strict native controlled-input semantics. Modal uses open/onOpenChange.
- A controlled Form model is updated through onChange(nextModel). Query callback
  payloads instead of assuming all controls emit DOM events.
- Utilities and type-only exports are not all listed in component metadata.
  Check installed declarations before concluding an export is missing.

## Migration and verification

For React → Vue migration, read [references/react-to-vue.md](references/react-to-vue.md).
The CLI exposes it with `migration react-to-vue`; use `migration vue-to-react`
for the other direction. Follow only the guide matching the requested target.

For Vue → React migration, read [references/vue-to-react.md](references/vue-to-react.md)
before choosing target APIs. Query both installed versions. Preserve business
behavior as well as layout; do not treat a successful typecheck as parity.

Run `pnpm exec react-kui-ai validate <file>`, then application typecheck, lint and
relevant interaction tests. Inspect complete/skipped limitations. This validator
is partial and does not execute expressions. Templates are local mocks, not
production backends; adapt them only within the user's task.
