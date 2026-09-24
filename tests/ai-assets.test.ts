import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { validateUsage } from "../ai/validate.mjs";

const root = path.resolve(import.meta.dirname, "..");
const metadata = JSON.parse(fs.readFileSync(path.join(root, "ai/kui-components.json"), "utf8"));
const validate = (source: string) => validateUsage(source, metadata);
const call = (id: number, name: string, args: Record<string, unknown>) => ({
  jsonrpc: "2.0",
  id,
  method: "tools/call",
  params: { name, arguments: args },
});
function rpc(requests: unknown[]) {
  const result = spawnSync(process.execPath, [path.join(root, "ai/mcp.mjs")], {
    input: requests.map((r) => (typeof r === "string" ? r : JSON.stringify(r))).join("\n") + "\n",
    encoding: "utf8",
    timeout: 10000,
  });
  expect(result.status, result.stderr).toBe(0);
  return result.stdout
    .trim()
    .split("\n")
    .map((line) => JSON.parse(line));
}

describe("React AI distribution", () => {
  it("distinguishes icon data from renderable content", () => {
    for (const source of [
      'import { Button, Icon } from "react-kui"; const x = <Button icon={<Icon />} />;',
      'import { Button as Action } from "react-kui"; const x = <Action icon={<span />} />;',
      'import * as K from "react-kui"; const x = <K.Button icon={<></>} />;',
      '<Button icon="Search" />',
    ])
      expect(validate(source).valid, source).toBe(false);
    for (const source of [
      'import { Button } from "react-kui"; import { Search } from "kui-icons"; const x = <Button icon={Search} />;',
      'import { Button, Icon } from "react-kui"; const x = <Button><Icon /></Button>;',
      'import { Input, Icon } from "react-kui"; const x = <Input prefix={<Icon />} />;',
      'import { Button } from "another-library"; const x = <Button icon={<span />} />;',
    ])
      expect(validate(source).valid, source).toBe(true);
    const button = metadata.components.find((c: { name: string }) => c.name === "Button");
    expect(button.behavior.rules.join(" ")).toContain("Never pass a JSX element");
    expect(button.props.find((p: { name: string }) => p.name === "icon").descriptionEn).toContain(
      "not a string",
    );
  });
  it("extracts the real React exports, callback types and enums", () => {
    expect(metadata.library).toBe("react-kui");
    expect(metadata.components.length).toBeGreaterThan(100);
    const button = metadata.components.find((c: { name: string }) => c.name === "Button");
    expect(button.props.find((p: { name: string }) => p.name === "size").enumValues).toEqual([
      "small",
      "medium",
      "large",
    ]);
    const input = metadata.components.find((c: { name: string }) => c.name === "Input");
    expect(input.events.find((p: { name: string }) => p.name === "onChange").type).toContain(
      "value: string",
    );
    expect(input.nativeProps).toContain("placeholder");
    expect(metadata.components.some((c: { name: string }) => c.name === "KImage")).toBe(true);
    expect(metadata.components.some((c: { name: string }) => c.name === "Image")).toBe(false);
  });
  it("rejects Vue APIs, invalid literals, exports, props, events and required omissions", () => {
    for (const source of [
      '<Button size="gigantic" />',
      '<Button type="submit" />',
      '<Button html-type="submit" />',
      "<Button onMadeUp={() => {}} />",
      '<Button onClick="save" />',
      '<Input disabled="false" />',
      '<Input v-model="name" />',
      '<Button class="x" />',
      "<QRCode />",
      'import { Image } from "react-kui"; const x = <Image />;',
    ])
      expect(validate(source).valid, source).toBe(false);
  });
  it("supports named aliases, namespace imports and native attributes", () => {
    expect(
      validate(
        'import { Button as B, Input } from "react-kui"; import * as KUI from "react-kui"; const x=<><B htmlType="submit" onClick={() => {}}/><Input placeholder="Name" disabled={false}/><KUI.Switch checked={true}/></>;',
      ).issues,
    ).toEqual([]);
    expect(
      validate('import { Button } from "another-library"; const x=<Button customProp />').issues,
    ).toEqual([]);
  });
  it("does not execute or claim to typecheck expressions and spread props", () => {
    const result = validate("<Button {...props} size={window.unknownValue} />");
    expect(result.complete).toBe(false);
    expect(result.skipped.length).toBeGreaterThan(0);
    expect(result.nextStep).toContain("tsc");
    expect(validate("<Button><span></Button>").issues[0].kind).toBe("syntax");
  });
  it("ignores comments and strings containing apparent component code", () => {
    expect(
      validate('const text = "<Button fake />"; /* <Button fake /> */ const x = <Button />;')
        .issues,
    ).toEqual([]);
  });
  it("serves APIs, examples and templates on demand", () => {
    const component = metadata.components.find((c: { name: string }) => c.name === "Form");
    const responses = rpc([
      { jsonrpc: "2.0", id: 0, method: "initialize", params: {} },
      call(1, "get_component_api", { name: "Form" }),
      call(2, "list_component_examples", { name: "Form", limit: 1 }),
      call(3, "get_component_example", { name: "Form", id: component.examples[0].id }),
      call(4, "get_template", { id: "modal-editor" }),
      call(5, "get_component_api", { name: "Modal", section: "behavior" }),
      {
        jsonrpc: "2.0",
        id: 6,
        method: "prompts/get",
        params: { name: "build_form", arguments: { fields: "name" } },
      },
    ]);
    expect(responses[0].result.serverInfo.name).toBe("react-kui");
    const values = responses.slice(1, 6).map((r) => r.result.structuredContent.result);
    expect(values[0].examples).toBeUndefined();
    expect(values[0].nativeProps).toBeUndefined();
    expect(JSON.stringify(values[0]).length).toBeLessThan(14000);
    expect(values[1].items).toHaveLength(1);
    expect(values[2].source).toContain("react");
    expect(values[3].source).toContain("onOpenChange");
    expect(values[4].behavior.rules.length).toBeGreaterThan(0);
    expect(responses[6].result.messages[0].content.text).toContain("onChange={setModel}");
  });
  it("keeps running after malformed requests and bounds query input", () => {
    const responses = rpc([
      "{",
      call(1, "search_components", { query: "", limit: 1000 }),
      call(2, "get_template", { id: "../../package.json" }),
      call(3, "search_components", { query: "Button", limit: 1 }),
    ]);
    expect(responses[0].error.code).toBe(-32700);
    expect(responses[1].result.isError).toBe(true);
    expect(responses[2].result.isError).toBe(true);
    expect(responses[3].result.structuredContent.result.items).toHaveLength(1);
  });
  it("resolves published metadata and Skill exports and keeps init idempotent", () => {
    const require = createRequire(import.meta.url);
    expect(require.resolve("react-kui/metadata")).toBe(path.join(root, "ai/kui-components.json"));
    expect(fs.readFileSync(require.resolve("react-kui/skill"), "utf8")).toContain(
      "name: react-kui",
    );
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "react-kui-ai-"));
    try {
      fs.writeFileSync(path.join(dir, "AGENTS.md"), "Existing instructions\n");
      for (let i = 0; i < 2; i++)
        expect(
          spawnSync(process.execPath, [path.join(root, "ai/cli.mjs"), "init"], { cwd: dir }).status,
        ).toBe(0);
      const text = fs.readFileSync(path.join(dir, "AGENTS.md"), "utf8");
      expect(text).toContain("Existing instructions");
      expect(text.match(/## React KUI/g)).toHaveLength(1);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
  it("validates the runnable templates and public AI resources", () => {
    for (const id of ["form", "table", "modal-editor"])
      expect(
        validate(fs.readFileSync(path.join(root, `ai/templates/${id}.tsx`), "utf8")).issues,
        id,
      ).toEqual([]);
    expect(fs.readFileSync(path.join(root, "public/llms.txt"), "utf8")).toContain("react-kui");
    expect(fs.readFileSync(path.join(root, "public/kui-components.json"), "utf8")).toBe(
      fs.readFileSync(path.join(root, "ai/kui-components.json"), "utf8"),
    );
  });
});
