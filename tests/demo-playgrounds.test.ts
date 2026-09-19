import { afterEach, describe, expect, it, vi } from "vitest";
import { openCodePen, openCodeSandbox, openStackBlitz } from "../src/components/demo/utils";

const openProject = vi.hoisted(() => vi.fn());
vi.mock("@stackblitz/sdk", () => ({ default: { openProject } }));

const source = `import { Button } from "react-kui";
export default function App() { return <Button>Demo</Button>; }`;

afterEach(() => {
  vi.restoreAllMocks();
  openProject.mockReset();
});

describe("Demo playground exporters", () => {
  it("creates a runnable StackBlitz React project", async () => {
    await openStackBlitz(source);

    expect(openProject).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "KUI React Demo",
        files: expect.objectContaining({
          "src/App.tsx": source,
          "src/main.tsx": expect.stringContaining("createRoot"),
        }),
      }),
      expect.objectContaining({ openFile: "src/App.tsx" }),
    );
  });

  it.each([
    ["CodeSandbox", openCodeSandbox, "codesandbox.io", "parameters"],
    ["CodePen", openCodePen, "codepen.io", "data"],
  ])("submits the %s project definition", (_name, open, host, field) => {
    const submit = vi
      .spyOn(HTMLFormElement.prototype, "submit")
      .mockImplementation(() => undefined);

    open(source);

    const submittedForm = submit.mock.contexts[0] as HTMLFormElement | undefined;
    expect(submittedForm?.action).toContain(host);
    expect(
      submittedForm?.querySelector<HTMLInputElement>(`input[name="${field}"]`)?.value,
    ).toBeTruthy();
  });
});
