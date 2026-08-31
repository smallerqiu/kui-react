import fs from "node:fs";
import path from "node:path";
import process from "node:process";
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
  // 这些类型定义在子目录中，但文档与组件主入口放在一起
  FlameWrapProps: ["components/flame-wrap/index.md", "components/flame-wrap/index.en_US.md"],
  MessagePanelProps: ["components/notice/index.md", "components/notice/index.en_US.md"],
  NoticePanelProps: ["components/notice/index.md", "components/notice/index.en_US.md"],
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

/** `modulePath` 可能指向目录，也可能指向 `types.ts` / `content.tsx` 这类文件 */
const resolveSourceDirectory = (target: string): string | undefined => {
  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) return target;
  for (const extension of [".ts", ".tsx"]) {
    if (fs.existsSync(`${target}${extension}`)) return path.dirname(target);
  }
  return path.extname(target) ? path.dirname(target) : undefined;
};

const sourceFiles = (directory: string): string[] =>
  fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
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
    failures.push(
      `${item.name}: missing ${missingDocs.map((file) => path.relative(root, file)).join(", ")}`,
    );
    continue;
  }

  let properties: string[] | undefined;
  const sourceDirectory = resolveSourceDirectory(directory);
  if (!sourceDirectory) continue;
  for (const file of sourceFiles(sourceDirectory)) {
    readSource(file).forEachChild((node) => {
      if (ts.isInterfaceDeclaration(node) && node.name.text === item.name) {
        properties = node.members.flatMap((member) =>
          member.name && ts.isIdentifier(member.name) ? [member.name.text] : [],
        );
      } else if (
        ts.isTypeAliasDeclaration(node) &&
        node.name.text === item.name &&
        ts.isTypeLiteralNode(node.type)
      ) {
        properties = node.type.members.flatMap((member) =>
          member.name && ts.isIdentifier(member.name) ? [member.name.text] : [],
        );
      }
    });
  }
  if (!properties) continue;

  const ignored = ignoredByInterface[item.name];
  const required = properties.filter(
    (property) =>
      !globalIgnored.has(property) && !(ignored instanceof Set && ignored.has(property)),
  );
  for (const doc of docs) {
    const documented = new Set(
      [...fs.readFileSync(doc, "utf8").matchAll(/^\|\s*`?([A-Za-z][A-Za-z0-9]*)`?\s*\|/gm)].map(
        (match) => match[1],
      ),
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
