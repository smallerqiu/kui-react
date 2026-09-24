# React KUI AI integration

Icon prop contract: Button.icon takes IconType[] data imported from kui-icons: import { Search } from 'kui-icons'; use <Button icon={Search} />. Never pass a JSX element (<Icon type={Search} />), a component function, or an icon-name string to icon. For custom rendered content, put <Icon type={Search} /> in Button children. Input prefix/suffix are renderable nodes and must not be confused with Button.icon.

For building React 19.2+ applications with `react-kui`. This is not a Vue plugin.

Install `react-kui` and `kui-icons`, then run `pnpm exec react-kui-ai init`. It appends project guidance to AGENTS.md without overwriting existing content or duplicating its section. Install the optional Skill from `node_modules/react-kui/ai/skills/react-kui` using your client's Skill mechanism.

## MCP server

Install `react-kui` and its dependencies in the consuming project first.
Confirm that the installed version includes `node_modules/react-kui/ai/mcp.mjs`.
Do not copy the script alone: it needs the package's metadata and dependencies.

Run `node -p "process.execPath"` in the project terminal to obtain the Node
executable's absolute path. For clients using the mcpServers JSON format:

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

Replace both placeholders with real absolute paths. A path containing spaces
remains one string argument. On Windows use forward slashes or escaped
backslashes in JSON, for example `C:/Program Files/nodejs/node.exe`.
Other clients may use another configuration format; enter the same command and
args through their MCP settings instead of copying this JSON unchanged.

This configuration does not depend on the client's working directory or pnpm.
Use `"command": "node"` only if the client can find Node.
The alternative command `pnpm` with args `["exec", "react-kui-mcp"]` requires
pnpm on the client's PATH and an explicit working directory pointing to the
consuming project with the package installed.

### Verify and troubleshoot

1. Launch the absolute Node/script paths in a terminal first. This is a stdio
   service, not a web server. It normally waits silently for input; press Ctrl+C
   to stop. Silence alone does not prove a successful MCP connection.
2. Save the client configuration and reconnect. Check successful initialization
   and a tool list containing search_components and get_component_api.
3. Call `get_component_api({ "name": "Button" })` and confirm an API response.
   This tests connectivity and resources, not all component interactions.

If Node/pnpm cannot be found, check the executable path and client environment.
If the script cannot be found, check the project path, installation and package
version. Missing dependencies/metadata require restoring the complete package
installation with the project's package manager, not copying individual files.
If terminal startup works but the client fails, inspect client startup and
handshake logs. Update configuration after moving the project or Node installation.

## Component usage

Use named imports and load `react-kui/style/index.css` once. Input onChange receives a value, not a DOM event. Switch uses checked/onChange; Modal uses open/onOpenChange. A Form model supplied by the application must be updated through onChange(nextModel); onSubmit receives { valid }. Button uses htmlType for submit/reset. The image export is KImage. Do not use Vue v-model, slots or app.use.

MCP tools:

- search_components and recommend_components for discovery.
- get_component_api({ name, section? }) for all/props/events/renderProps/behavior, without example source by default.
- list_component_examples followed by get_component_example for one documented example (relative imports use its original directory).
- list_templates and get_template for runnable form/table/modal-editor TSX, setup instructions and local mock requests.
- validate_kui_usage for static JSX/TSX checks. Named aliases and namespace imports are supported. valid is not proof of full correctness: read skipped checks, then run tsc and interaction tests.

Search/example lists accept offset and limit (default 10, max 20). Full resources use react-kui://components/{Name}; prompts embed the corresponding business templates.

Versioned npm resources: react-kui/metadata, react-kui/metadata/schema, react-kui/skill. Site builds publish llms.txt, llms-full.txt, kui-components.json and schema/kui-components.schema.json. Prefer installed-version metadata over the latest website.

Run `pnpm generate:ai`, `pnpm check:ai-assets` and `pnpm check:ai`. AI tasks cap Node heap and use a single test worker. Templates can be saved as App.tsx in an application with library CSS loaded; replace local mocks with production APIs. Metadata is derived from public React exports, TypeScript props and documentation examples. Explicit behavior contracts supplement inferred types; absent defaults do not imply a particular runtime behavior.

## Installed resources and command-line queries (without MCP)

`react-kui/metadata` and `react-kui/skill` are package export specifiers, not
directories. Resolve them with `node -p "require.resolve('react-kui/metadata')"`
or run `pnpm exec react-kui-ai paths`. Read the Skill at the returned path before
implementing unfamiliar APIs.

```bash
pnpm exec react-kui-ai paths
pnpm exec react-kui-ai search Input --limit 5
pnpm exec react-kui-ai api Input --section props
pnpm exec react-kui-ai api Input --section behavior
pnpm exec react-kui-ai examples Input
pnpm exec react-kui-ai templates
pnpm exec react-kui-ai migration vue-to-react
pnpm exec react-kui-ai migration react-to-vue
pnpm exec react-kui-ai validate src/App.tsx
```

Use `example Input <id>` with an ID from examples; use `template <id>` to read
one business template. `query <tool-name> '<JSON>'` uses the same engine and
argument validation as MCP. Results are JSON; invalid usage and errors exit
nonzero. Source can be piped into `validate -`. Validation remains partial.

Run `init` again after upgrading. It refreshes a marked managed block and
preserves text outside it. For pre-marker guidance, only exact known generated
lines are migrated; customized wording remains for review. Put project-specific
rules outside managed markers. Malformed markers cause an error without writes.

Metadata describes components, not every package export. For utilities such as
theme, inspect the installed declarations too. Before migrating, read
`migration vue-to-react` or `migration react-to-vue`, then compare callbacks, state synchronization,
slots/render props and interaction behavior—not just typecheck results.
