# React KUI MCP

Transport: stdio. Use an absolute Node executable path and the absolute installed
`node_modules/react-kui/ai/mcp.mjs` path as its argument; this avoids depending
on the client's working directory. Keep the full package and dependencies installed.
Get the executable path with `node -p "process.execPath"`.

For configuration examples, prerequisites and troubleshooting, read
[AI.en-US.md](../../../../AI.en-US.md#mcp-server).
The alternative `pnpm exec react-kui-mcp` requires pnpm on the client's PATH
and an explicit working directory set to the consuming project.
Verify initialization, tools/list, and a get_component_api query after connecting.
Silent terminal startup only means the stdio process is waiting for input.

- search_components({ query, offset?, limit? }): paginated component discovery, default 10/max 20.
- recommend_components({ requirement }): candidate components.
- get_component_api({ name, section? }): all, props, events, renderProps or behavior. No example source by default.
- list_component_examples({ name, offset?, limit? }): example titles and IDs.
- get_component_example({ name, id }): one documentation example source. Relative imports refer to its original example directory.
- list_templates({ query? }): summaries of runnable business templates.
- get_template({ id }): complete form/table/modal-editor TSX and setup instructions.
- validate_kui_usage({ source }): static JSX/TSX checks, including named import aliases and namespace imports. Read skipped checks and still run tsc/tests.

Full component resources: react-kui://components/{Name}. Prompts build_form/build_table/build_modal_editor contain runnable templates.
