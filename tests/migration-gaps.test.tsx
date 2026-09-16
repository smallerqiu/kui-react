import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createRef, useState, type ElementRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { Checkbox, Form, FormItem, Input, InputNumber, Switch, Upload } from "react-kui";

describe("Form validation parity with kui-vue", () => {
  it("binds marked controls through FormFieldContext", () => {
    function Example() {
      const [model, setModel] = useState({ name: "" });
      return (
        <Form model={model} onChange={(next) => setModel(next as typeof model)}>
          <FormItem label="Name" prop="name">
            <Input />
          </FormItem>
          <output>{model.name}</output>
        </Form>
      );
    }
    render(<Example />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "KUI" } });
    expect(screen.getByText("KUI")).not.toBeNull();
  });

  it("adapts checked controls and isolates their event shape", () => {
    function Example() {
      const [model, setModel] = useState({ agreed: false, enabled: false });
      return (
        <Form model={model} onChange={(next) => setModel(next as typeof model)}>
          <FormItem prop="agreed"><Checkbox label="Agree" /></FormItem>
          <FormItem prop="enabled"><Switch trueText="On" falseText="Off" /></FormItem>
          <output>{JSON.stringify(model)}</output>
        </Form>
      );
    }
    render(<Example />);
    fireEvent.click(screen.getByText("Agree"));
    fireEvent.click(screen.getByRole("switch"));
    expect(screen.getByText('{"agreed":true,"enabled":true}')).not.toBeNull();
  });

  it("preserves control refs through the form-field wrapper", () => {
    const ref = createRef<ElementRef<typeof Input>>();
    render(<Input ref={ref} />);
    expect(typeof ref.current?.focus).toBe("function");
  });

  it("revalidates when the controlled model changes externally", async () => {
    function Example() {
      const [model, setModel] = useState({ name: "valid" });
      return (
        <>
          <button onClick={() => setModel({ name: "" })}>Clear externally</button>
          <Form model={model} onChange={(next) => setModel(next as typeof model)}>
            <FormItem prop="name" rules={{ required: true, message: "Required externally" }}>
              <Input />
            </FormItem>
          </Form>
        </>
      );
    }
    render(<Example />);
    fireEvent.click(screen.getByText("Clear externally"));
    await waitFor(() => expect(screen.getByText("Required externally")).not.toBeNull());
  });
  it("returns the Vue-compatible async validation result", async () => {
    const onSubmit = vi.fn();
    render(
      <Form model={{ name: "" }} onSubmit={onSubmit}>
        <FormItem label="Name" prop="name" rules={{ required: true, message: "Required" }}>
          <Input />
        </FormItem>
      </Form>,
    );
    fireEvent.submit(document.querySelector("form")!);
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ valid: false }));
    await waitFor(() => expect(screen.getByText("Required")).not.toBeNull());
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

  it("waits for asynchronous callback validators", async () => {
    const onSubmit = vi.fn();
    render(
      <Form model={{ name: "x" }} onSubmit={onSubmit}>
        <FormItem
          prop="name"
          rules={{
            validator: (_rule, _value, callback) => {
              setTimeout(() => callback(new Error("Delayed invalid")), 10);
            },
          }}
        >
          <Input />
        </FormItem>
      </Form>,
    );
    fireEvent.submit(document.querySelector("form")!);
    expect(onSubmit).not.toHaveBeenCalled();
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ valid: false }));
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
