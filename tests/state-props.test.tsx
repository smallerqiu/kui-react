import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, expectTypeOf, it, vi } from "vitest";
import type {
  ButtonProps,
  CheckboxProps,
  SwitchProps,
  TableProps,
  UploadProps,
  SelectProps,
  TourProps,
  TreeProps,
  InputProps,
} from "../components";
import {
  AutoComplete,
  Checkbox,
  Radio,
  RadioButton,
  Switch,
  CheckCard,
  Table,
  Tour,
  Collapse,
  CollapsePanel,
} from "../components";

describe("unified state props", () => {
  it("does not expose default-prefixed props through native HTML inheritance", () => {
    type Props = ButtonProps &
      CheckboxProps &
      SwitchProps &
      TableProps &
      UploadProps &
      SelectProps &
      TourProps &
      TreeProps &
      InputProps;
    expectTypeOf<Extract<keyof Props, `default${string}`>>().toEqualTypeOf<never>();
  });
  it("AutoComplete populates options when open changes externally", async () => {
    const options = ["One"];
    const { rerender } = render(<AutoComplete open={false} showOnEmpty options={options} />);
    expect(screen.queryByRole("option")).toBeNull();
    rerender(<AutoComplete open showOnEmpty options={options} />);
    expect((await screen.findByRole("option")).textContent).toContain("One");
  });
  it.each([
    ["Checkbox", Checkbox, ".k-checkbox input"],
    ["Radio", Radio, ".k-radio input"],
    ["RadioButton", RadioButton, '[role="radio"]'],
    ["Switch", Switch, ".k-switch"],
    ["CheckCard", CheckCard, ".k-check-card"],
  ] as const)("%s supports local edits and changed checked props", (_name, Control, selector) => {
    const onChange = vi.fn();
    const { container, rerender } = render(<Control checked={false} onChange={onChange} />);
    const target = () => container.querySelector<HTMLElement>(selector)!;
    const selected = () =>
      target() instanceof HTMLInputElement
        ? (target() as HTMLInputElement).checked
        : target().getAttribute("aria-checked") === "true";
    expect(selected()).toBe(false);
    fireEvent.click(target());
    expect(selected()).toBe(true);
    expect(onChange).toHaveBeenCalledOnce();
    rerender(<Control checked={false} onChange={onChange} />);
    expect(selected()).toBe(true);
    rerender(<Control checked onChange={onChange} />);
    rerender(<Control checked={false} onChange={onChange} />);
    expect(selected()).toBe(false);
    expect(onChange).toHaveBeenCalledOnce();
  });

  it("preserves local Collapse edits until openKeys changes", () => {
    const initial = ["one"];
    const view = (openKeys: string[]) => (
      <Collapse openKeys={openKeys}>
        <CollapsePanel panelKey="one" title="One">
          Body
        </CollapsePanel>
      </Collapse>
    );
    const { container, rerender } = render(view(initial));
    fireEvent.click(screen.getByText("One"));
    expect(container.querySelector(".k-collapse-item-active")).toBeNull();
    rerender(view(initial));
    expect(container.querySelector(".k-collapse-item-active")).toBeNull();
    rerender(view(["one"]));
    expect(container.querySelector(".k-collapse-item-active")).not.toBeNull();
  });

  it("synchronizes expandAllRows and lets explicit expandedKeys take precedence", () => {
    const data = [{ key: "p", name: "Parent", children: [{ key: "c", name: "Child" }] }];
    const columns = [{ key: "name", title: "Name" }];
    const { rerender } = render(<Table data={data} columns={columns} expandAllRows />);
    expect(screen.queryByText("Child")).not.toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Collapse row" }));
    expect(screen.queryByText("Child")).toBeNull();
    rerender(<Table data={data} columns={columns} expandAllRows />);
    expect(screen.queryByText("Child")).toBeNull();
    rerender(<Table data={data} columns={columns} expandAllRows={false} />);
    rerender(<Table data={data} columns={columns} expandAllRows />);
    expect(screen.queryByText("Child")).not.toBeNull();
    rerender(<Table data={data} columns={columns} expandAllRows expandedKeys={[]} />);
    expect(screen.queryByText("Child")).toBeNull();
  });

  it("Tour initializes current and open, allows closing, and synchronizes updates", () => {
    const steps = [{ title: "First" }, { title: "Second" }];
    const { rerender } = render(<Tour open current={1} steps={steps} />);
    expect(screen.getByRole("dialog").textContent).toContain("Second");
    rerender(<Tour open current={0} steps={steps} />);
    expect(screen.getByRole("dialog").textContent).toContain("First");
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    rerender(<Tour open current={0} steps={steps} />);
    expect(screen.queryByRole("dialog")).toBeNull();
    rerender(<Tour open={false} current={0} steps={steps} />);
    rerender(<Tour open current={0} steps={steps} />);
    expect(screen.queryByRole("dialog")).not.toBeNull();
  });
});
