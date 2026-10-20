import fs from "node:fs";
import { syncDocumentation } from "./api-docs.ts";
import { componentDocumentation } from "./component-documentation.ts";
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
const descriptions = JSON.parse(
  fs.readFileSync(path.join(root, "ai/descriptions.json"), "utf8"),
) as Record<string, Record<string, { zh: string; en: string }>>;
const read = (file: string) => (fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "");
const tableDocs = (file: string, component: string) =>
  new Map(
    [
      ...(
        read(file) +
        "\n" +
        componentDocumentation(read(file), component, path.basename(path.dirname(file)))
      ).matchAll(/^\|\s*`?([\w]+)`?\s*\|([^\n]+)/gm),
    ].map((m) => [m[1], m[2].split(/(?<!\\)\|/)[0].trim()]),
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
const nullish = (kind: ts.SyntaxKind) =>
  kind === ts.SyntaxKind.QuestionQuestionToken || kind === ts.SyntaxKind.BarBarToken;
/** The value the whole expression falls back to last, or the expression itself when it is not a chain. */
const chainTail = (node: ts.Expression): ts.Expression => {
  let tail = node;
  while (ts.isBinaryExpression(tail) && nullish(tail.operatorToken.kind)) tail = tail.right;
  return tail;
};
/** The reference a chain starts from, stepping through a leading call only when it already chains. */
const chainStart = (node: ts.Expression): ts.Expression => {
  let head = node;
  for (;;) {
    if (ts.isBinaryExpression(head) && nullish(head.operatorToken.kind)) head = head.left;
    // `resolvePaintedTheme(themeProp ?? inherited.theme, THEMES) ?? "fill"` chains the prop before the
    // helper runs, so the literal after it is the component's own fallback. A call that merely *takes*
    // the prop (`resolveResponsive(columnStart, 0) ?? 0`) keeps its sentinel inside the helper, where the
    // caller's `?? 0` says nothing about what the prop means.
    else if (
      ts.isCallExpression(head) &&
      head.arguments[0] &&
      ts.isBinaryExpression(head.arguments[0]) &&
      nullish(head.arguments[0].operatorToken.kind)
    )
      head = head.arguments[0];
    else return head;
  }
};
const isLiteralValue = (node: ts.Expression) =>
  ts.isStringLiteral(node) ||
  ts.isNoSubstitutionTemplateLiteral(node) ||
  ts.isNumericLiteral(node) ||
  (ts.isPrefixUnaryExpression(node) && node.operator === ts.SyntaxKind.MinusToken
    ? ts.isNumericLiteral(node.operand)
    : node.kind === ts.SyntaxKind.TrueKeyword ||
      node.kind === ts.SyntaxKind.FalseKeyword ||
      node.kind === ts.SyntaxKind.NullKeyword);

/**
 * Bodies to read defaults from. A component exported through a wrapper
 * (`export default createFormFieldComponent(Switch)`) declares its defaults inside the body that was handed
 * over, so step through wrapper arguments. Only wrappers are followed, never a call made from inside a
 * function body, and names are resolved by the checker rather than looked up by text, so a same-file sibling
 * or a helper cannot lend its defaults to this component.
 */
const defaultsRoots = (declaration: ts.Declaration) => {
  const roots: ts.Node[] = [declaration];
  const seen = new Set<ts.Node>();
  const unwrap = (node: ts.Node | undefined) => {
    if (!node || seen.has(node)) return;
    seen.add(node);
    if (ts.isCallExpression(node)) {
      for (const argument of node.arguments)
        if (ts.isIdentifier(argument)) {
          const symbol = checker.getSymbolAtLocation(argument);
          const target = symbol
            ? getDeclaration(resolveSymbol(symbol))
            : undefined;
          if (target) {
            roots.push(target);
            unwrap(target);
          }
        }
      return;
    }
    if (ts.isVariableDeclaration(node)) unwrap(node.initializer);
    else if (ts.isExportAssignment(node)) unwrap(node.expression);
    else if (ts.isParenthesizedExpression(node) || ts.isAsExpression(node)) unwrap(node.expression);
  };
  unwrap(declaration);
  return roots;
};

/**
 * Defaults the source declares for a component's props.
 *
 * The destructuring pattern is the direct case. The other shape the library uses is a chain resolved in
 * the body — `const size = sizeProp ?? inheritedAppearance.size ?? "medium"` and
 * `const theme = resolvePaintedTheme(themeProp ?? inheritedAppearance.theme, THEMES) ?? "fill"` — where
 * the prop arrives renamed precisely so the body can fall back. A chain is recorded only when a literal
 * sits at the end of the *whole* expression, because that is what guarantees the literal is the value the
 * assignment lands on; a value a wrapper can still rewrite
 * (`normalizeSurfaceShape(shapeProp ?? inherited.shape ?? "round")`) and a controlled-state fallback
 * (`useValue(checked, (next) => next ?? false)`, which says nothing about the prop) are left unrecorded
 * instead of guessed at.
 */
const defaultsFor = (declaration: ts.Declaration) => {
  const values = new Map<string, string>();
  // Local name in the body → prop name it was destructured from.
  const locals = new Map<string, string>();
  const roots = defaultsRoots(declaration);
  const collect = (node: ts.Node) => {
    if (
      (ts.isArrowFunction(node) ||
        ts.isFunctionDeclaration(node) ||
        ts.isFunctionExpression(node)) &&
      node.parameters[0] &&
      ts.isObjectBindingPattern(node.parameters[0].name)
    )
      for (const binding of node.parameters[0].name.elements) {
        if (!ts.isIdentifier(binding.name)) continue;
        const prop = binding.propertyName?.getText() ?? binding.name.getText();
        locals.set(binding.name.getText(), prop);
        if (binding.initializer) values.set(prop, binding.initializer.getText());
      }
    ts.forEachChild(node, collect);
  };
  for (const root of roots) collect(root);
  const resolve = (node: ts.Node) => {
    if (
      ts.isVariableDeclaration(node) &&
      node.initializer &&
      ts.isIdentifier(node.name) &&
      isLiteralValue(chainTail(node.initializer))
    ) {
      const head = chainStart(node.initializer);
      const prop = ts.isIdentifier(head) ? locals.get(head.text) : undefined;
      if (prop && !values.has(prop)) values.set(prop, node.initializer.getText());
    }
    ts.forEachChild(node, resolve);
  };
  for (const root of roots) resolve(root);
  return values;
};
const components = exports.flatMap((exported) => {
  const name = exported.name;
  if (!/^[A-Z]/.test(name) || exported.flags & ts.SymbolFlags.TypeAlias) return [];
  const symbol = resolveSymbol(exported);
  const declaration = getDeclaration(symbol);
  if (!declaration || !(symbol.flags & ts.SymbolFlags.Value)) return [];
  const componentType = checker.getTypeOfSymbolAtLocation(symbol, declaration);
  const signature =
    componentType.getCallSignatures()[0] || componentType.getConstructSignatures()[0];
  if (!signature?.parameters[0]) return [];
  const propsType = checker.getTypeOfSymbolAtLocation(signature.parameters[0], declaration);
  const ownFile = declaration.getSourceFile().fileName;
  const relative = path.relative(path.join(root, "components"), ownFile);
  const directory = path.join(
    root,
    "components",
    name === "StatNumber" ? "stat-number" : relative.split(path.sep)[0],
  );
  const markdown = path.join(directory, "index.md");
  const docZh = tableDocs(markdown, name);
  const docEn = tableDocs(path.join(directory, "index.en_US.md"), name);
  const defaults = defaultsFor(declaration);
  // A controlled channel — `value` read back through `onChange`, `open` through `onOpenChange` — is
  // documented as unset: the literal the component falls back to for uncontrolled mode (`open ?? false`)
  // is neither a value the reader passes nor a look they get, so the pairing, not a name list, marks it.
  const propNames = new Set(checker.getPropertiesOfType(propsType).map((prop) => prop.name));
  const controlled = (propName: string) =>
    propNames.has(`on${propName.charAt(0).toUpperCase()}${propName.slice(1)}Change`) ||
    ((propName === "value" || propName === "modelValue") && propNames.has("onChange"));
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
    // Print in the property's declaring scope, not the outer component wrapper.
    // Shared Props files can import aliases that are absent from the wrapper.
    const typeText = checker.typeToString(
      type,
      decls[0] || declaration,
      ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope,
    );
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
        defaultExpression: controlled(prop.name) ? undefined : defaults.get(prop.name),
        descriptionZh: docZh.get(prop.name) || descriptions[name]?.[prop.name]?.zh || comment || "",
        descriptionEn: docEn.get(prop.name) || descriptions[name]?.[prop.name]?.en || comment || "",
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
for (const [component, fields] of Object.entries(descriptions)) {
  const target = components.find((entry) => entry.name === component);
  for (const [field, note] of Object.entries(fields)) {
    if (!target?.props.some((prop) => prop.name === field) || !note.zh?.trim() || !note.en?.trim())
      throw new Error(`Invalid description supplement: ${component}.${field}`);
  }
}
if (process.argv.includes("--docs") || process.argv.includes("--check-docs")) {
  syncDocumentation(root, components, process.argv.includes("--check-docs"));
  process.exit(0);
}
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
