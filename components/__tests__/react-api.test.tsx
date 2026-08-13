import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  Button,
  Checkbox,
  ConfigProvider,
  Poptip,
  Radio,
  Select,
  Switch,
  Tooltip,
} from "react-kui";
import zhCN from "../locale/zh-CN";
import Transition from "../base/transition";

describe("React controlled and uncontrolled conventions", () => {
  it("uses defaultChecked only as the initial Checkbox state", () => {
    const onChange = vi.fn();
    render(<Checkbox defaultChecked onChange={onChange}>Remember</Checkbox>);
    const input = screen.getByRole("checkbox");
    expect((input as HTMLInputElement).checked).toBe(true);
    fireEvent.click(input);
    expect((input as HTMLInputElement).checked).toBe(false);
    expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ checked: false }));
  });

  it("does not mutate a controlled Radio or Switch", () => {
    const radioChange = vi.fn();
    const switchChange = vi.fn();
    render(
      <>
        <Radio checked={false} onChange={radioChange}>Radio</Radio>
        <Switch checked={false} onChange={switchChange} />
      </>
    );
    const radio = screen.getByRole("radio");
    const button = screen.getByRole("button");
    fireEvent.click(radio);
    fireEvent.click(button);
    expect((radio as HTMLInputElement).checked).toBe(false);
    expect(button.classList.contains("k-switch-checked")).toBe(false);
    expect(radioChange).toHaveBeenCalledOnce();
    expect(switchChange).toHaveBeenCalledWith(true);
  });

  it("supports uncontrolled Select value and visibility", async () => {
    const onChange = vi.fn();
    render(
      <Select
        defaultOpen
        defaultValue="one"
        options={[
          { label: "One", value: "one" },
          { label: "Two", value: "two" },
        ]}
        onChange={onChange}
      />
    );
    expect(document.querySelector(".k-select-dropdown")).not.toBeNull();
    fireEvent.click(screen.getByText("Two"));
    expect(onChange).toHaveBeenCalledWith("two");
    await waitFor(() => expect(document.querySelector(".k-select-opened")).toBeNull());
  });

  it("closes an uncontrolled Select on outside click", async () => {
    const onOpenChange = vi.fn();
    render(<Select defaultOpen options={[{ label: "One", value: "one" }]} onOpenChange={onOpenChange} />);
    expect(document.querySelector(".k-select-opened")).not.toBeNull();
    fireEvent.click(document.body);
    await waitFor(() => expect(document.querySelector(".k-select-opened")).toBeNull());
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("supports Select keyboard selection", async () => {
    const onChange = vi.fn();
    render(<Select defaultOpen options={[{ label: "One", value: "one" }]} onChange={onChange} />);
    const select = document.querySelector<HTMLElement>(".k-select");
    expect(select).not.toBeNull();
    fireEvent.focus(select!);
    fireEvent.keyDown(document, { key: "ArrowDown" });
    fireEvent.keyDown(document, { key: "Enter" });
    await waitFor(() => expect(onChange).toHaveBeenCalledWith("one"));
  });

  it("requests changes without mutating controlled Poptip visibility", async () => {
    const onOpenChange = vi.fn();
    render(
      <Poptip open={false} trigger="click" content="Details" onOpenChange={onOpenChange}>
        <Button>Open</Button>
      </Poptip>
    );
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(true));
    expect(screen.queryByText("Details")).toBeNull();
  });

  it("keeps the deprecated Tooltip show callbacks compatible", async () => {
    const onShowChange = vi.fn();
    render(
      <Tooltip show={false} title="Help" onShowChange={onShowChange}>
        <button>Target</button>
      </Tooltip>
    );
    fireEvent.mouseEnter(screen.getByRole("button", { name: "Target" }));
    await waitFor(() => expect(onShowChange).toHaveBeenCalledWith(true));
  });
});

describe("Transition", () => {
  it("runs enter and leave lifecycles and unmounts after exit", async () => {
    const onAfterEnter = vi.fn();
    const onAfterLeave = vi.fn();
    const { rerender } = render(
      <Transition show={false} timeout={0} onAfterEnter={onAfterEnter} onAfterLeave={onAfterLeave}>
        <div>Animated content</div>
      </Transition>
    );
    rerender(
      <Transition show timeout={0} onAfterEnter={onAfterEnter} onAfterLeave={onAfterLeave}>
        <div>Animated content</div>
      </Transition>
    );
    await waitFor(() => expect(onAfterEnter).toHaveBeenCalledOnce());
    rerender(
      <Transition show={false} timeout={0} onAfterEnter={onAfterEnter} onAfterLeave={onAfterLeave}>
        <div>Animated content</div>
      </Transition>
    );
    await waitFor(() => expect(onAfterLeave).toHaveBeenCalledOnce());
    expect(screen.queryByText("Animated content")).toBeNull();
  });
});

describe("ConfigProvider", () => {
  it("provides component locale text", () => {
    const locale = {
      ...zhCN,
      k: {
        ...zhCN.k,
        select: { ...zhCN.k.select, placeholder: "Choose an item" },
      },
    };
    render(
      <ConfigProvider locale={locale}>
        <Select />
      </ConfigProvider>
    );
    expect(screen.getByText("Choose an item")).not.toBeNull();
  });
});
