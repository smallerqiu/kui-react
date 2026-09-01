import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Form, FormItem, Input, InputNumber, Upload } from "react-kui";

describe("Form validation parity with kui-vue", () => {
  it("keeps synchronous validation synchronous", () => {
    const onSubmit = vi.fn();
    render(
      <Form model={{ name: "" }} onSubmit={onSubmit}>
        <FormItem label="Name" prop="name" rules={{ required: true, message: "Required" }}>
          <Input />
        </FormItem>
      </Form>,
    );
    fireEvent.submit(document.querySelector("form")!);
    expect(onSubmit).toHaveBeenCalledWith({ valid: false });
    expect(screen.getByText("Required")).not.toBeNull();
  });

  it("supports async validators", async () => {
    const onSubmit = vi.fn();
    render(
      <Form model={{ name: "abc" }} onSubmit={onSubmit}>
        <FormItem
          label="Name"
          prop="name"
          rules={{
            validator: async (_rule, value) => {
              if (value === "abc") throw new Error("Name is taken");
            },
          }}
        >
          <Input />
        </FormItem>
      </Form>,
    );
    fireEvent.submit(document.querySelector("form")!);
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ valid: false }));
    await waitFor(() => expect(screen.getByText("Name is taken")).not.toBeNull());
  });

  it("supports callback validators", async () => {
    const onSubmit = vi.fn();
    render(
      <Form model={{ name: "x" }} onSubmit={onSubmit}>
        <FormItem
          label="Name"
          prop="name"
          rules={{
            validator: (_rule, _value, callback) => callback(new Error("Invalid")),
          }}
        >
          <Input />
        </FormItem>
      </Form>,
    );
    fireEvent.submit(document.querySelector("form")!);
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ valid: false }));
    expect(screen.getByText("Invalid")).not.toBeNull();
  });

  it("honours rule trigger", async () => {
    const onSubmit = vi.fn();
    render(
      <Form model={{ name: "" }} onSubmit={onSubmit}>
        <FormItem
          label="Name"
          prop="name"
          rules={{ required: true, message: "Required", trigger: "blur" }}
        >
          <Input />
        </FormItem>
      </Form>,
    );
    const input = screen.getByRole("textbox");

    // trigger 为 blur 的规则不应在 change 时校验
    fireEvent.change(input, { target: { value: "" } });
    expect(screen.queryByText("Required")).toBeNull();

    // 失焦时才校验
    fireEvent.blur(input);
    await waitFor(() => expect(screen.getByText("Required")).not.toBeNull());
  });
});

describe("Upload error reporting parity with kui-vue", () => {
  class FakeXHR {
    static instances: FakeXHR[] = [];
    upload = { onloadstart: null as null | (() => void), onprogress: null };
    readyState = 0;
    status = 200;
    responseText = "{}";
    onerror: (() => void) | null = null;
    onreadystatechange: (() => void) | null = null;
    abort = vi.fn();
    open = vi.fn();
    setRequestHeader = vi.fn();
    send = vi.fn();
    constructor() {
      FakeXHR.instances.push(this);
    }
  }

  it("surfaces the http status when the request fails", async () => {
    FakeXHR.instances = [];
    vi.stubGlobal("XMLHttpRequest", FakeXHR as unknown as typeof XMLHttpRequest);
    render(<Upload action="/upload" />);

    const input = document.querySelector(".k-upload-file")!;
    Object.defineProperty(input, "files", {
      value: [new File(["content"], "a.txt", { type: "text/plain" })],
      configurable: true,
    });
    fireEvent.change(input);

    const xhr = FakeXHR.instances[0];
    expect(xhr).toBeDefined();
    xhr.status = 500;
    xhr.readyState = 4;
    xhr.onreadystatechange?.();
    await waitFor(() =>
      expect(document.querySelector(".k-upload-file-status-text")?.textContent).toContain("500"),
    );
    vi.unstubAllGlobals();
  });

  it("sets errorText when a network error occurs", async () => {
    FakeXHR.instances = [];
    vi.stubGlobal("XMLHttpRequest", FakeXHR as unknown as typeof XMLHttpRequest);
    const onChange = vi.fn();
    render(<Upload action="/upload" onChange={onChange} />);

    const input = document.querySelector(".k-upload-file")!;
    Object.defineProperty(input, "files", {
      value: [new File(["x"], "x.txt", { type: "text/plain" })],
      configurable: true,
    });
    fireEvent.change(input);

    FakeXHR.instances[0].onerror?.();
    await waitFor(() => expect(onChange).toHaveBeenCalled());
    const last = onChange.mock.calls.at(-1)?.[0];
    expect(last?.file?.status).toBe("error");
    expect(last?.file?.errorText).toBeTruthy();
    vi.unstubAllGlobals();
  });
});

describe("InputNumber keyboard parity with kui-vue", () => {
  it("ignores arrow keys when keyboard is disabled", () => {
    const onChange = vi.fn();
    render(<InputNumber defaultValue={1} keyboard={false} onChange={onChange} />);
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "ArrowUp" });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("steps with arrow keys by default", () => {
    const onChange = vi.fn();
    render(<InputNumber defaultValue={1} onChange={onChange} />);
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "ArrowUp" });
    expect(onChange).toHaveBeenCalledWith(2);
  });
});
