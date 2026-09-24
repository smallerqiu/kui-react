# React KUI AI integration

For building React 19.2+ applications with `react-kui`.

Install `react-kui` and `kui-icons`, then run `pnpm exec react-kui-ai init`. It appends project guidance to AGENTS.md without overwriting existing content or duplicating its section. Install the optional Skill from `node_modules/react-kui/ai/skills/react-kui` using your client's Skill mechanism.

Confirm that the project has a version of `react-kui` that includes the MCP server. Find the absolute path to Node:

```bash
node -p "process.execPath"
```

For stdio MCP clients that support the `mcpServers` JSON format:

```json
{
  "mcpServers": {
    "react-kui": {
      "command": "/absolute/path/to/node",
      "args": ["/absolute/path/to/project/node_modules/react-kui/ai/mcp.mjs"]
    }
  }
}
```

Replace `command` with the Node path returned above and the script argument with its absolute path in your project. Keep paths containing spaces as single strings. Windows paths can use forward slashes, such as `C:/Program Files/nodejs/node.exe`. This configuration does not depend on the client's working directory or require pnpm. If the client can find Node, `command` can also be `node`.

Use `"command": "pnpm"` with `"args": ["exec", "react-kui-mcp"]` only when the client can find Node and pnpm and its working directory is explicitly set to the application directory where the package is installed.

Configuration locations and formats vary by client. For clients without `mcpServers` support, enter the same command and arguments in their MCP settings. Reconnect after saving and confirm that `search_components` and `get_component_api` appear in the tool list. The server communicates over standard input/output and does not open a web page; waiting for input when launched in a terminal is normal.

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

## AI evaluations

`pnpm check:ai-evals` runs 26 reference scenarios through component/API checks and strict TypeScript validation (vue-tsc for Vue). It is included in repository verification. Existing AI template tests cover form, table and modal interactions; static success alone does not imply correct behavior.

Model evaluation is opt-in and supports your own model adapter:

```bash
pnpm eval:ai --generator /absolute/path/to/model-adapter --model your-model-version
```

The trusted adapter receives JSON on stdin (prompt, Skill instructions and relevant component APIs, without reference answers) and returns complete source on stdout. It handles model credentials itself. CI never calls a paid model. Generated source is parsed and typechecked, not executed.

You can also export prompts and score saved responses:

```bash
pnpm eval:ai --export-prompts .ai-eval-results/prompts.json
pnpm eval:ai --responses /path/to/responses.json --model your-model-version
```

Responses map case names to source strings. Use `--case primary-action` to select one case and `--out report.json` to preserve separate runs. Reports include model/version, suite/context hashes, per-case errors, skipped checks, source and static pass rate. They do not claim semantic or runtime correctness. See `ai/evals/README.md` in the repository for the adapter protocol and limitations.
