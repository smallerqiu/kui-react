import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  Checkbox,
  CheckboxGroup,
  Form,
  FormItem,
  Input,
  InputNumber,
  Select,
  Space,
  Switch,
  TextArea,
} from "react-kui";

function WrappedInput() {
  return <Input aria-label="wrapped" />;
}

describe("Form disabled inheritance", () => {
  it("disables controls without prop bindings, including wrappers and siblings, and re-enables them", async () => {
    const onChange = vi.fn();
    const controls = (
      <>
        <Input aria-label="direct" value="initial" onChange={onChange} />
        <FormItem label="No prop">
          <Input aria-label="unbound" />
        </FormItem>
        <FormItem prop="name">
          <Input aria-label="bound" />
          <Input aria-label="sibling" />
        </FormItem>
        <Space>
          <WrappedInput />
          <InputNumber aria-label="number" />
          <TextArea aria-label="text" />
        </Space>
        <Checkbox>Checkbox</Checkbox>
        <Switch aria-label="switch" />
        <Select options={[{ value: "one", label: "One" }]} />
      </>
    );
    const { container, rerender } = render(
      <Form disabled model={{ name: "bound value" }}>
        {controls}
      </Form>,
    );
    for (const control of container.querySelectorAll("input, textarea")) {
      expect((control as HTMLInputElement).disabled).toBe(true);
    }
    expect((screen.getByRole("switch") as HTMLButtonElement).disabled).toBe(true);
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("direct"), "changed");
    await user.click(screen.getByRole("checkbox"));
    await user.click(screen.getByRole("switch"));
    expect(onChange).not.toHaveBeenCalled();
    expect((screen.getByLabelText("direct") as HTMLInputElement).value).toBe("initial");
    expect((screen.getByLabelText("bound") as HTMLInputElement).value).toBe("bound value");
    rerender(
      <Form disabled={false} model={{ name: "bound value" }}>
        {controls}
      </Form>,
    );
    for (const control of container.querySelectorAll("input, textarea")) {
      expect((control as HTMLInputElement).disabled).toBe(false);
    }
    await user.type(screen.getByLabelText("direct"), "!");
    expect(onChange).toHaveBeenLastCalledWith("initial!");
  });

  it("retains explicit control and composite overrides", () => {
    const { rerender } = render(
      <Form disabled>
        <Input disabled={false} aria-label="enabled" />
        <CheckboxGroup disabled={false}>
          <Checkbox>Enabled group child</Checkbox>
        </CheckboxGroup>
        <Input disabled aria-label="disabled" />
      </Form>,
    );
    expect((screen.getByLabelText("enabled") as HTMLInputElement).disabled).toBe(false);
    expect((screen.getByRole("checkbox") as HTMLInputElement).disabled).toBe(false);
    rerender(
      <Form disabled={false}>
        <Input disabled aria-label="disabled" />
      </Form>,
    );
    expect((screen.getByLabelText("disabled") as HTMLInputElement).disabled).toBe(true);
  });

  it("inherits readOnly without taking over unbound values or handlers", () => {
    const onChange = vi.fn();
    const onBlur = vi.fn();
    const { rerender } = render(
      <Form readOnly>
        <FormItem>
          <Input value="local" aria-label="local" onChange={onChange} onBlur={onBlur} />
        </FormItem>
      </Form>,
    );
    const input = screen.getByLabelText("local") as HTMLInputElement;
    expect(input.readOnly).toBe(true);
    expect(input.value).toBe("local");
    fireEvent.blur(input);
    expect(onBlur).toHaveBeenCalledOnce();
    rerender(
      <Form readOnly={false}>
        <FormItem>
          <Input value="local" aria-label="local" onChange={onChange} onBlur={onBlur} />
        </FormItem>
      </Form>,
    );
    fireEvent.change(input, { target: { value: "edited" } });
    expect(onChange).toHaveBeenLastCalledWith("edited");
  });

  it("applies state to native FormItem controls and honors overrides", () => {
    const { rerender } = render(
      <Form disabled readOnly>
        <FormItem>
          <input aria-label="native" />
          <textarea aria-label="area" />
          <select aria-label="select">
            <option>One</option>
          </select>
          <input disabled={false} readOnly={false} aria-label="override" />
        </FormItem>
      </Form>,
    );
    for (const name of ["native", "area", "select"])
      expect((screen.getByLabelText(name) as HTMLInputElement).disabled).toBe(true);
    expect((screen.getByLabelText("native") as HTMLInputElement).readOnly).toBe(true);
    expect((screen.getByLabelText("override") as HTMLInputElement).disabled).toBe(false);
    rerender(
      <Form>
        <FormItem>
          <input aria-label="native" />
        </FormItem>
      </Form>,
    );
    expect((screen.getByLabelText("native") as HTMLInputElement).disabled).toBe(false);
  });
});
