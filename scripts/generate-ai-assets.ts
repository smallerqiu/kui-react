import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const root = path.resolve(import.meta.dirname, "..");
const entry = path.join(root, "components/components.ts");
const site = "https://react.k-ui.cn";
const checkOnly = process.argv.includes("--check");
const config = ts.readConfigFile(path.join(root, "tsconfig.app.json"), ts.sys.readFile).config;
const options = ts.parseJsonConfigFileContent(config, ts.sys, root).options;
const program = ts.createProgram([entry], { ...options, noEmit: true, incremental: false });
const checker = program.getTypeChecker();
const source = program.getSourceFile(entry)!;
const moduleSymbol = checker.getSymbolAtLocation(source)!;
const exports = checker.getExportsOfModule(moduleSymbol);
const behaviors = JSON.parse(fs.readFileSync(path.join(root, "ai/behaviors.json"), "utf8"));
const read = (file: string) => (fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "");
const tableDocs = (file: string) =>
  new Map(
    [...read(file).matchAll(/^\|\s*`?([\w]+)`?\s*\|([^\n]+)/gm)].map((m) => [
      m[1],
      m[2].split(/(?<!\\)\|/)[0].trim(),
    ]),
  );
const resolveSymbol = (s: ts.Symbol) =>
  s.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(s) : s;
const getDeclaration = (s: ts.Symbol) => s.valueDeclaration || s.declarations?.[0];
const children: Record<string, string[]> = {
  Form: ["FormItem"],
  Menu: ["MenuItem", "SubMenu", "MenuGroup", "MenuDivider"],
  Select: ["Option"],
  Layout: ["Header", "Sider", "Content", "Footer"],
  Tabs: ["TabPanel"],
  Grid: ["GridItem"],
  Row: ["Col"],
  Space: [],
  CheckboxGroup: ["Checkbox"],
  RadioGroup: ["Radio", "RadioButton"],
  Steps: ["Step"],
  Collapse: ["CollapsePanel"],
  Splitter: ["SplitterPanel"],
};
const defaultsFor = (declaration: ts.Declaration) => {
  const values = new Map<string, string>();
  const scan = (node: ts.Node) => {
    if (
      (ts.isArrowFunction(node) ||
        ts.isFunctionDeclaration(node) ||
        ts.isFunctionExpression(node)) &&
      node.parameters[0] &&
      ts.isObjectBindingPattern(node.parameters[0].name)
    ) {
      for (const binding of node.parameters[0].name.elements) {
        if (binding.initializer)
          values.set(
            (binding.propertyName || binding.name).getText(),
            binding.initializer.getText(),
          );
      }
    }
    ts.forEachChild(node, scan);
  };
  scan(declaration);
  return values;
};
const components = exports.flatMap((exported) => {
  const name = exported.name;
  if (!/^[A-Z]/.test(name) || exported.flags & ts.SymbolFlags.TypeAlias) return [];
  const symbol = resolveSymbol(exported);
  const declaration = getDeclaration(symbol);
  if (!declaration || !(symbol.flags & ts.SymbolFlags.Value)) return [];
  const signature = checker.getTypeOfSymbolAtLocation(symbol, declaration).getCallSignatures()[0];
  if (!signature?.parameters[0]) return [];
  const propsType = checker.getTypeOfSymbolAtLocation(signature.parameters[0], declaration);
  const ownFile = declaration.getSourceFile().fileName;
  const relative = path.relative(path.join(root, "components"), ownFile);
  const directory = path.join(
    root,
    "components",
    relative.split(path.sep)[0],
  );
  const markdown = path.join(directory, "index.md");
  const docZh = tableDocs(markdown);
  const docEn = tableDocs(path.join(directory, "index.en_US.md"));
  const defaults = defaultsFor(declaration);
  const nativeProps: string[] = [];
  const nativeValueTypes: Record<string, string> = {};
  const props = checker.getPropertiesOfType(propsType).flatMap((prop) => {
    const decls = prop.declarations || [];
    const own = decls.some((d) =>
      d.getSourceFile().fileName.startsWith(path.join(root, "components") + path.sep),
    );
    if (!own) {
      nativeProps.push(prop.name);
      const t = checker.getTypeOfSymbolAtLocation(prop, declaration);
      const parts = (t.isUnion() ? t.types : [t]).filter(
        (t) => !(t.flags & ts.TypeFlags.Undefined),
      );
      for (const [kind, flags] of [
        ["boolean", ts.TypeFlags.BooleanLike],
        ["number", ts.TypeFlags.NumberLike],
        ["string", ts.TypeFlags.StringLike],
      ] as const) {
        if (parts.length && parts.every((t) => !!(t.flags & flags)))
          nativeValueTypes[prop.name] = kind;
      }
      return [];
    }
    const type = checker.getTypeOfSymbolAtLocation(prop, declaration);
    const union = (type.isUnion() ? type.types : [type]).filter(
      (t) => !(t.flags & ts.TypeFlags.Undefined),
    );
    const literal = (t: ts.Type) =>
      t.flags & ts.TypeFlags.BooleanLiteral
        ? (t as ts.Type & { intrinsicName: string }).intrinsicName === "true"
        : (t as ts.LiteralType).value;
    const enumValues =
      union.length &&
      union.every(
        (t) =>
          t.flags &
          (ts.TypeFlags.StringLiteral | ts.TypeFlags.NumberLiteral | ts.TypeFlags.BooleanLiteral),
      )
        ? union.map(literal)
        : undefined;
    const typeText = checker.typeToString(type, declaration, ts.TypeFormatFlags.NoTruncation);
    const comment = ts.displayPartsToString(prop.getDocumentationComment(checker));
    return [
      {
        name: prop.name,
        type: typeText,
        required: !(prop.flags & ts.SymbolFlags.Optional),
        enumValues,
        boolean:
          union.length > 0 &&
          union.every((t) => !!(t.flags & (ts.TypeFlags.Boolean | ts.TypeFlags.BooleanLiteral))),
        defaultExpression: defaults.get(prop.name),
        descriptionZh: docZh.get(prop.name) || comment || "",
        descriptionEn: docEn.get(prop.name) || comment || "",
      },
    ];
  });
  const examples = [
    ...read(markdown).matchAll(/\[([^\]]+)\]\((\.\/demo\/[^)?]+\.tsx)(?:\?[^)]*)?\)/g),
  ]
    .map((m) => {
      const file = path.resolve(directory, m[2]);
      return { id: path.relative(root, file), title: m[1], source: read(file).trim() };
    })
    .filter((e) => e.source);
  return [
    {
      name,
      import: `import { ${name} } from "react-kui"`,
      documentation: `${site}/components/${path.basename(directory)}`,
      props,
      nativeProps,
      nativeValueTypes,
      events: props.filter((p) => /^on[A-Z]/.test(p.name)),
      renderProps: props
        .filter(
          (p) =>
            !/^on[A-Z]/.test(p.name) &&
            (p.name === "children" || p.type.includes("ReactNode") || /=>/.test(p.type)),
        )
        .map((p) => p.name),
      behavior: behaviors[name] || { rules: [] },
      children: children[name] || [],
      parent: Object.entries(children).find(([, names]) => names.includes(name))?.[0],
      examples,
    },
  ];
});
if (components.length < 80)
  throw new Error(`Only extracted ${components.length} components; check export resolution`);
for (const name of Object.keys(behaviors))
  if (!components.some((c) => c.name === name))
    throw new Error(`Unknown behavior component ${name}`);
const runtimeExports = exports
  .filter((s) => !!(resolveSymbol(s).flags & ts.SymbolFlags.Value))
  .map((s) => s.name);
const metadata = {
  exports: [...runtimeExports, "version", "components", "default"],
  library: "react-kui",
  version: JSON.parse(read(path.join(root, "package.json"))).version,
  framework: "react",
  components,
};
const schema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  type: "object",
  required: ["library", "version", "framework", "components"],
  properties: {
    library: { const: "react-kui" },
    framework: { const: "react" },
    version: { type: "string" },
    components: {
      type: "array",
      items: {
        type: "object",
        required: ["name", "props", "events", "nativeProps", "behavior", "examples"],
        properties: {
          name: { type: "string" },
          props: { type: "array", items: { $ref: "#/$defs/prop" } },
          events: { type: "array", items: { $ref: "#/$defs/prop" } },
          nativeProps: { type: "array", items: { type: "string" } },
          renderProps: { type: "array", items: { type: "string" } },
          behavior: {
            type: "object",
            required: ["rules"],
            properties: { rules: { type: "array", items: { type: "string" } } },
          },
          examples: {
            type: "array",
            items: {
              type: "object",
              required: ["id", "title", "source"],
              properties: {
                id: { type: "string" },
                title: { type: "string" },
                source: { type: "string" },
              },
            },
          },
        },
      },
    },
  },
  $defs: {
    prop: {
      type: "object",
      required: ["name", "type", "required"],
      properties: {
        name: { type: "string" },
        type: { type: "string" },
        required: { type: "boolean" },
        boolean: { type: "boolean" },
        enumValues: { type: "array", items: { type: ["string", "number", "boolean"] } },
        defaultExpression: { type: "string" },
        descriptionZh: { type: "string" },
        descriptionEn: { type: "string" },
      },
    },
  },
};
const write = (file: string, content: string) => {
  const target = path.join(root, file);
  if (checkOnly) {
    if (read(target) !== content) throw new Error(`Generated AI asset out of date: ${file}`);
  } else {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content);
  }
};
for (const base of ["ai", "public"])
  write(`${base}/kui-components.json`, JSON.stringify(metadata, null, 2) + "\n");
for (const file of ["ai/kui-components.schema.json", "public/schema/kui-components.schema.json"])
  write(file, JSON.stringify(schema, null, 2) + "\n");
const index = `# React KUI ${metadata.version}\n\nReact 19.2+ library. Package: react-kui. Import CSS once from react-kui/style/index.css. Prefer installed-version metadata. Use JSX/TSX, not Vue templates or v-model.\n\n${components.map((c) => `- [${c.name}](${c.documentation})`).join("\n")}\n`;
write("public/llms.txt", index);
write(
  "public/llms-full.txt",
  index +
    components
      .map(({ examples, ...rest }) => {
        const c = Object.fromEntries(
          Object.entries(rest).filter(
            ([key]) => !["nativeProps", "nativeValueTypes"].includes(key),
          ),
        );
        return `\n# ${c.name}\n\n${JSON.stringify(c, null, 2)}\n\n${examples.map((e) => `## ${e.title}\n\n\`\`\`tsx\n${e.source}\n\`\`\``).join("\n")}`;
      })
      .join("\n"),
);
console.log(
  `${checkOnly ? "Verified" : "Generated"} AI assets for ${components.length} React components.`,
);
