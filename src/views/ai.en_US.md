# React KUI AI integration

For building React 19.2+ applications with `react-kui`.

Install `react-kui` and `kui-icons`, then run `pnpm exec react-kui-ai init`. It appends project guidance to AGENTS.md without overwriting existing content or duplicating its section. Install the optional Skill from `node_modules/react-kui/ai/skills/react-kui` using your client's Skill mechanism.

Configure a stdio MCP service with command `pnpm` and args `["exec", "react-kui-mcp"]`, running from the consuming project's directory. Configuration locations vary by client.

Use named imports and load `react-kui/style/index.css` once. Input onChange receives a value, not a DOM event. Switch uses checked/onChange; Modal uses open/onOpenChange. A Form model supplied by the application must be updated through onChange(nextModel); onSubmit receives { valid }. Button uses htmlType for submit/reset. The image export is KImage.

MCP tools:

- search_components and recommend_components for discovery.
- get_component_api({ name, section? }) for all/props/events/renderProps/behavior, without example source by default.
- list_component_examples followed by get_component_example for one documented example (relative imports use its original directory).
- list_templates and get_template for runnable form/table/modal-editor TSX, setup instructions and local mock requests.
- validate_kui_usage for static JSX/TSX checks. Named aliases and namespace imports are supported. valid is not proof of full correctness: read skipped checks, then run tsc and interaction tests.

Search/example lists accept offset and limit (default 10, max 20). Full resources use react-kui://components/{Name}; prompts embed the corresponding business templates.

Versioned npm resources: react-kui/metadata, react-kui/metadata/schema, react-kui/skill. Site builds publish llms.txt, llms-full.txt, kui-components.json and schema/kui-components.schema.json. Prefer installed-version metadata over the latest website.

Run `pnpm generate:ai`, `pnpm check:ai-assets` and `pnpm check:ai`. AI tasks cap Node heap and use a single test worker. Templates can be saved as App.tsx in an application with library CSS loaded; replace local mocks with production APIs. Metadata is derived from public React exports, TypeScript props and documentation examples. Explicit behavior contracts supplement inferred types; absent defaults do not imply a particular runtime behavior.
