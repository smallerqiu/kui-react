import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const root = process.cwd();
const barrelPath = path.join(root, "components/components.ts");
const globalIgnored = new Set(["children", "className", "style"]);
const ignoredByInterface: Record<string, Set<string> | "all"> = {
  CollapsePanelProps: new Set(["active", "panelKey", "onExpand"]),
  LayoutProps: new Set(["suffixCls"]),
  SiderProps: new Set(["suffixCls"]),
  LoadingProps: "all",
  MenuItemProps: new Set(["itemKey", "menuKey"]),
  SubMenuProps: new Set(["itemKey", "menuKey"]),
  OptionProps: new Set(["checked", "active", "onMouseEnter"]),
  TabPanelProps: new Set(["tabKey", "activeKey"]),
};
const docsByInterface: Record<string, string[]> = {
  ConfigProviderProps: ["src/views/language/index.md", "src/views/language/index.en_US.md"],
};

const readSource = (file: string) =>
  ts.createSourceFile(file, fs.readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true);

const publicProps: Array<{ name: string; modulePath: string }> = [];
readSource(barrelPath).forEachChild((node) => {
  if (!ts.isExportDeclaration(node) || !node.isTypeOnly || !node.moduleSpecifier) return;
  const modulePath = (node.moduleSpecifier as ts.StringLiteral).text;
  node.exportClause?.elements.forEach((element) => {
    const name = element.name.text;
    if (name.endsWith("Props")) publicProps.push({ name, modulePath });
  });
});

const sourceFiles = (directory: string): string[] =>
  fs
    .readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      if (entry.name === "demo" || entry.name === "styles") return [];
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) return sourceFiles(file);
      return /\.(ts|tsx)$/.test(entry.name) ? [file] : [];
    });

const failures: string[] = [];
for (const item of publicProps) {
  if (ignoredByInterface[item.name] === "all") continue;
  const directory = path.resolve(path.dirname(barrelPath), item.modulePath);
  const docs = docsByInterface[item.name]?.map((file) => path.join(root, file)) ?? [
    path.join(directory, "index.md"),
    path.join(directory, "index.en_US.md"),
  ];
  const missingDocs = docs.filter((file) => !fs.existsSync(file));
  if (missingDocs.length) {
    failures.push(`${item.name}: missing ${missingDocs.map((file) => path.relative(root, file)).join(", ")}`);
    continue;
  }

  let properties: string[] | undefined;
  for (const file of sourceFiles(directory)) {
    readSource(file).forEachChild((node) => {
      if (ts.isInterfaceDeclaration(node) && node.name.text === item.name) {
        properties = node.members.flatMap((member) =>
          member.name && ts.isIdentifier(member.name) ? [member.name.text] : []
        );
      } else if (
        ts.isTypeAliasDeclaration(node) &&
        node.name.text === item.name &&
        ts.isTypeLiteralNode(node.type)
      ) {
        properties = node.type.members.flatMap((member) =>
          member.name && ts.isIdentifier(member.name) ? [member.name.text] : []
        );
      }
    });
  }
  if (!properties) continue;

  const ignored = ignoredByInterface[item.name];
  const required = properties.filter(
    (property) => !globalIgnored.has(property) && !(ignored instanceof Set && ignored.has(property))
  );
  for (const doc of docs) {
    const documented = new Set(
      [...fs.readFileSync(doc, "utf8").matchAll(/^\|\s*`?([A-Za-z][A-Za-z0-9]*)`?\s*\|/gm)].map(
        (match) => match[1]
      )
    );
    const missing = required.filter((property) => !documented.has(property));
    if (missing.length) {
      failures.push(`${path.relative(root, doc)} (${item.name}): ${missing.join(", ")}`);
    }
  }
}

if (failures.length) {
  console.error("API documentation is missing public props:\n");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log(`API documentation check passed (${publicProps.length} public Props types).`);
}
