import { act, fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { Checkbox, Form, FormItem, Input, type FormExpose, type FormRule } from "react-kui";

describe("Form", () => {
  it("keeps wrapperCol immutable and supports colon overrides", () => {
    const wrapperCol = { span: 12, offset: 6 };
    const { container } = render(
      <Form layout="vertical" wrapperCol={wrapperCol} colon={false}>
        <FormItem label="Name">
          <Input />
        </FormItem>
        <FormItem label="City" colon>
          <Input />
        </FormItem>
      </Form>,
    );

    expect(wrapperCol).toEqual({ span: 12, offset: 6 });
    expect(container.querySelectorAll(".k-form-item-no-colon")).toHaveLength(1);
  });

  it("combines rules and skips them for optional empty values", () => {
    const ref = createRef<FormExpose>();
    const { rerender } = render(
      <Form
        ref={ref}
        model={{ code: "Abc" }}
        rules={{ code: [{ required: true, pattern: /^A/, min: 4 }] }}
      >
        <FormItem prop="code">
          <Input />
        </FormItem>
      </Form>,
    );
    expect(ref.current?.validate()).toBe(false);

    rerender(
      <Form ref={ref} model={{ code: "" }} rules={{ code: [{ pattern: /^A/, min: 4 }] }}>
        <FormItem prop="code">
          <Input />
        </FormItem>
      </Form>,
    );
    expect(ref.current?.validate()).toBe(true);
  });

  it("resets regexp state between validations", () => {
    const ref = createRef<FormExpose>();
    render(
      <Form ref={ref} model={{ code: "AAA" }} rules={{ code: [{ pattern: /^A/g }] }}>
        <FormItem prop="code">
          <Input />
        </FormItem>
      </Form>,
    );
    expect(ref.current?.validate()).toBe(true);
    expect(ref.current?.validate()).toBe(true);
  });

  it("keeps the latest asynchronous validation result", async () => {
    const ref = createRef<FormExpose>();
    const pending: Array<{ resolve: () => void; reject: (error: Error) => void }> = [];
    const validator: FormRule["validator"] = () =>
      new Promise<void>((resolve, reject) => pending.push({ resolve, reject }));
    const rules = { name: [{ validator }] };
    const { rerender } = render(
      <Form ref={ref} model={{ name: "old" }} rules={rules}>
        <FormItem prop="name">
          <Input />
        </FormItem>
      </Form>,
    );

    const first = Promise.resolve(ref.current?.validate());
    rerender(
      <Form ref={ref} model={{ name: "new" }} rules={rules}>
        <FormItem prop="name">
          <Input />
        </FormItem>
      </Form>,
    );
    const second = Promise.resolve(ref.current?.validate());
    await act(async () => pending[1].resolve());
    await second;
    await act(async () => pending[0].reject(new Error("Stale error")));
    await first;
    expect(screen.queryByText("Stale error")).toBeNull();
  });

  it("updates registration when prop changes", () => {
    const ref = createRef<FormExpose>();
    const rules = {
      first: [{ required: true }],
      second: [{ required: true }],
    };
    const { rerender } = render(
      <Form ref={ref} model={{ first: "", second: "ok" }} rules={rules}>
        <FormItem prop="first">
          <Input />
        </FormItem>
      </Form>,
    );
    expect(ref.current?.validate()).toBe(false);

    rerender(
      <Form ref={ref} model={{ first: "", second: "ok" }} rules={rules}>
        <FormItem prop="second">
          <Input />
        </FormItem>
      </Form>,
    );
    expect(ref.current?.validate()).toBe(true);
  });

  it("injects form props into only the first form control", () => {
    const { container, rerender } = render(
      <Form model={{ name: "Ada" }} size="large">
        <FormItem prop="name">
          <div data-testid="hint">Hint</div>
          <Input />
          <Input />
        </FormItem>
      </Form>,
    );
    const inputs = container.querySelectorAll<HTMLInputElement>("input");
    expect(screen.getByTestId("hint").getAttribute("value")).toBeNull();
    expect(inputs[0].value).toBe("Ada");
    expect(inputs[0].closest(".k-input")?.classList.contains("k-input-lg")).toBe(true);
    expect(inputs[1].value).toBe("");

    rerender(
      <Form model={{ name: "Grace" }} size="large">
        <FormItem prop="name">
          <div data-testid="hint">Hint</div>
          <Input />
          <Input />
        </FormItem>
      </Form>,
    );
    expect(container.querySelectorAll<HTMLInputElement>("input")[0].value).toBe("Grace");
  });

  it("renders content and error as siblings", () => {
    const ref = createRef<FormExpose>();
    const { container } = render(
      <Form
        ref={ref}
        model={{ name: "" }}
        rules={{ name: [{ required: true, message: "Required" }] }}
      >
        <FormItem prop="name">
          <Input />
        </FormItem>
      </Form>,
    );
    fireEvent.submit(container.querySelector("form")!);
    const content = container.querySelector(".k-form-item-content")!;
    const error = container.querySelector(".k-form-item-error-tip")!;
    expect(content.parentElement).toBe(error.parentElement);
  });

  it("links labels, controls and errors with accessible attributes", () => {
    const ref = createRef<FormExpose>();
    const { container } = render(
      <Form
        ref={ref}
        model={{ name: "" }}
        rules={{ name: { required: true, message: "Name is required" } }}
      >
        <FormItem label="Name" prop="name">
          <Input />
        </FormItem>
      </Form>,
    );
    const input = container.querySelector("input")!;
    const label = container.querySelector("label")!;
    expect(input.id).toMatch(/^form_.+_name$/);
    expect(label.htmlFor).toBe(input.id);
    expect(input.getAttribute("aria-required")).toBe("true");

    act(() => {
      ref.current?.validate();
    });
    const error = container.querySelector('[role="alert"]')!;
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.getAttribute("aria-describedby")).toBe(error.id);
  });

  it("adapts checkbox events to field values and links the native input", () => {
    const onChange = vi.fn();
    const { container } = render(
      <Form model={{ accepted: true }} onChange={onChange}>
        <FormItem label="Accepted" prop="accepted">
          <Checkbox />
        </FormItem>
      </Form>,
    );
    const input = container.querySelector<HTMLInputElement>('.k-checkbox input[type="checkbox"]')!;
    const label = container.querySelector<HTMLLabelElement>(".k-form-item-label label")!;
    expect(input.checked).toBe(true);
    expect(label.htmlFor).toBe(input.id);
    fireEvent.click(input);
    expect(onChange).toHaveBeenLastCalledWith({ accepted: false });
  });

  it("resets fields to null like the Vue Form", () => {
    const ref = createRef<FormExpose>();
    const onChange = vi.fn();
    const view = (model: Record<string, unknown>) => (
      <Form ref={ref} model={model} onChange={onChange}>
        <FormItem prop="name">
          <Input />
        </FormItem>
      </Form>
    );
    const { container, rerender } = render(view({ name: "Ada" }));
    act(() => ref.current?.reset());
    expect(onChange).toHaveBeenLastCalledWith({ name: null });
    rerender(view({ name: null }));
    expect(container.querySelector<HTMLInputElement>("input")?.value).toBe("");
  });
});
