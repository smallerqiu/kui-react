import { parse } from "@babel/parser";

const jsxName = (node) =>
  !node
    ? ""
    : node.type === "JSXIdentifier"
      ? node.name
      : node.type === "JSXMemberExpression"
        ? `${jsxName(node.object)}.${jsxName(node.property)}`
        : `${jsxName(node.namespace)}:${jsxName(node.name)}`;
const literal = (node) => {
  if (!node) return { known: true, value: true };
  if (node.type === "JSXExpressionContainer") return literal(node.expression);
  if (["StringLiteral", "BooleanLiteral", "NumericLiteral"].includes(node.type))
    return { known: true, value: node.value };
  if (node.type === "NullLiteral") return { known: true, value: null };
  if (
    node.type === "UnaryExpression" &&
    node.operator === "-" &&
    node.argument.type === "NumericLiteral"
  )
    return { known: true, value: -node.argument.value };
  return { known: false };
};

export function validateUsage(source, metadata) {
  const issues = [];
  const skipped = new Set();
  const add = (kind, message, node, extra = {}) =>
    issues.push({
      kind,
      message,
      line: (node.loc?.start ?? node.loc)?.line,
      column: ((node.loc?.start ?? node.loc)?.column ?? 0) + 1,
      ...extra,
    });
  let ast;
  try {
    ast = parse(source, {
      sourceType: "module",
      plugins: ["typescript", "jsx"],
      errorRecovery: true,
    });
    for (const error of ast.errors) add("syntax", error.message, error);
  } catch (error) {
    add("syntax", error.message, error);
    return { valid: false, complete: false, scope: "static-jsx", issues, skipped: [] };
  }
  const byName = new Map(metadata.components.map((c) => [c.name, c]));
  const bindings = new Map();
  const namespaces = new Set();
  let hasImports = false;
  for (const node of ast.program.body) {
    if (node.type !== "ImportDeclaration") continue;
    hasImports = true;
    const own = node.source.value === "react-kui";
    for (const spec of node.specifiers) {
      if (!own) continue;
      if (node.importKind === "type" || spec.importKind === "type") continue;
      if (spec.type === "ImportNamespaceSpecifier") namespaces.add(spec.local.name);
      else if (spec.type === "ImportSpecifier") {
        const name = spec.imported.name || spec.imported.value;
        bindings.set(spec.local.name, name);
        if (metadata.exports && !metadata.exports.includes(name))
          add("import", `Unknown react-kui export: ${name}`, spec);
        // Non-component helper exports are allowed; only flag them if used as JSX.
      } else {
        skipped.add("default export is version metadata; use named imports for components");
      }
    }
  }
  const resolve = (name) => {
    if (bindings.has(name)) return { name: bindings.get(name), explicit: true };
    const [namespace, member] = name.split(".");
    if (namespaces.has(namespace) && member) return { name: member, explicit: true };
    // Bare JSX fragments are supported, but other imports must never be mistaken for KUI.
    if (!hasImports && byName.has(name)) return { name, explicit: false };
    return undefined;
  };
  const walk = (node) => {
    if (!node || typeof node !== "object") return;
    if (node.type === "JSXOpeningElement") {
      const tag = jsxName(node.name);
      const resolved = resolve(tag);
      const component = resolved && byName.get(resolved.name);
      if (resolved && !component)
        add("component", `Unknown react-kui component export: ${resolved.name}`, node);
      else if (!component && /^[A-Z]/.test(tag))
        skipped.add(`unresolved or custom component: ${tag}`);
      const props = new Map(component?.props.map((p) => [p.name, p]) || []);
      const native = new Set(component?.nativeProps || []);
      const present = new Set();
      let spread = false;
      for (const attr of node.attributes) {
        if (attr.type === "JSXSpreadAttribute") {
          spread = true;
          skipped.add("spread props and their override order");
          continue;
        }
        const name = jsxName(attr.name);
        if (
          /^(v-|@|:)/.test(name) ||
          name === "class" ||
          name === "for" ||
          name.startsWith("onUpdate:")
        ) {
          add("framework", `Use React JSX props instead of ${name}`, attr);
          continue;
        }
        if (!component) continue;
        present.add(name);
        const nativeType = component.nativeValueTypes?.[name];
        const prop =
          props.get(name) ||
          (nativeType ? { name, type: nativeType, boolean: nativeType === "boolean" } : undefined);
        if (!prop) {
          if (!native.has(name) && !["key", "ref"].includes(name) && !/^(data-|aria-)/.test(name))
            add(
              /^on[A-Z]/.test(name) ? "event" : "prop",
              `Unknown prop ${name} on ${component.name}`,
              attr,
              { component: component.name, prop: name },
            );
          if (native.has(name) && /^on[A-Z]/.test(name) && literal(attr.value).known)
            add("event", `${name} requires a callback`, attr);
          continue;
        }
        const value = literal(attr.value);
        if (!value.known) {
          skipped.add("expression types and callback signatures");
          continue;
        }
        if (prop.enumValues && !prop.enumValues.includes(value.value))
          add(
            "value",
            `Invalid ${name}; expected ${prop.enumValues.map((v) => JSON.stringify(v)).join(" | ")}`,
            attr,
            { component: component.name, prop: name },
          );
        else if (prop.boolean && typeof value.value !== "boolean")
          add("value", `${name} requires a boolean`, attr, {
            component: component.name,
            prop: name,
          });
        else if (
          /^(number|string)( \| undefined)?$/.test(prop.type) &&
          typeof value.value !== prop.type.split(" ")[0]
        )
          add("value", `${name} has an invalid primitive value`, attr, {
            component: component.name,
            prop: name,
          });
        else if (/^on[A-Z]/.test(name) && value.value !== null)
          add("event", `${name} requires a callback`, attr, {
            component: component.name,
            prop: name,
          });
      }
      if (component && !spread)
        for (const prop of props.values()) {
          if (prop.required && prop.name !== "children" && !present.has(prop.name))
            add("required", `Missing required prop ${prop.name} on ${component.name}`, node, {
              component: component.name,
              prop: prop.name,
            });
        }
    }
    for (const [key, value] of Object.entries(node)) {
      if (["loc", "tokens", "comments", "errors"].includes(key)) continue;
      if (Array.isArray(value)) value.forEach(walk);
      else if (value && typeof value === "object") walk(value);
    }
  };
  walk(ast.program);
  return {
    valid: !issues.length,
    complete: false,
    scope: "static-jsx",
    issues,
    skipped: [...skipped],
    nextStep:
      "Run tsc --noEmit and interaction tests. This check does not evaluate expressions, resolve local wrappers or verify callback types/runtime behavior.",
  };
}
