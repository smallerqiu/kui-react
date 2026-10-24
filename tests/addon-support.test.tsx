import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { AutoComplete, Form, FormItem, InputNumber, type FormExpose } from "../components";

const boxes = (container: HTMLElement) => ({
  before: container.querySelector(".k-input-group-prefix"),
  after: container.querySelector(".k-input-group-suffix"),
});

describe("InputNumber addons", () => {
  it("renders both addons outside the field and keeps stepping on the inner input", () => {
    const onChange = vi.fn();
    const { container } = render(
      <InputNumber value={2} addonBefore="¥" addonAfter="RMB" onChange={onChange} />,
    );

    const { before, after } = boxes(container);
    expect(before?.textContent).toBe("¥");
    expect(after?.textContent).toBe("RMB");

    const field = container.querySelector(".k-input-number");
    expect(field?.parentElement).toBe(container.querySelector(".k-input-group"));
    expect(field?.contains(before)).toBe(false);
    expect(field?.contains(after)).toBe(false);

    const input = screen.getByRole("spinbutton");
    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(onChange).toHaveBeenCalledWith(3);
    fireEvent.change(input, { target: { value: "8" } });
    expect(onChange).toHaveBeenLastCalledWith(8);
  });

  it("keeps Form validation with the number field behind the addons", async () => {
    const ref = createRef<FormExpose>();
    function Demo() {
      const [model, setModel] = useState<Record<string, unknown>>({ amount: "" });
      return (
        <Form
          ref={ref}
          model={model}
          onChange={setModel}
          rules={{ amount: [{ required: true }] }}
        >
          <FormItem label="Amount" prop="amount">
            <InputNumber addonBefore="¥" addonAfter="RMB" />
          </FormItem>
        </Form>
      );
    }
    const { container } = render(<Demo />);

    expect(await ref.current?.validate()).toEqual({ valid: false });
    await waitFor(() => expect(container.querySelector(".k-form-item-error")).not.toBeNull());

    fireEvent.change(screen.getByRole("spinbutton"), { target: { value: "12" } });
    expect(await ref.current?.validate()).toEqual({ valid: true });
    await waitFor(() => expect(container.querySelector(".k-form-item-error")).toBeNull());
  });
});

describe("AutoComplete addons", () => {
  it("renders addons around the field and still opens the filtered list", async () => {
    const { container } = render(
      <AutoComplete
        addonBefore="https://"
        addonAfter=".com"
        options={["kui", "vue", "react"]}
        placeholder="domain"
      />,
    );

    const { before, after } = boxes(container);
    expect(before?.textContent).toBe("https://");
    expect(after?.textContent).toBe(".com");
    expect(container.querySelector(".k-auto-complete .k-input-group")).not.toBeNull();

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "ku" } });
    const option = await screen.findByRole("option", { name: "kui" });
    expect(screen.getAllByRole("option")).toHaveLength(1);
    fireEvent.click(option);
    expect((screen.getByRole("combobox") as HTMLInputElement).value).toBe("kui");
  });
});
