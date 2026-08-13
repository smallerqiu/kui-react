import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  Button,
  Carousel,
  CarouselItem,
  Checkbox,
  ConfigProvider,
  Collapse,
  CollapsePanel,
  DatePicker,
  Input,
  InputNumber,
  Menu,
  Poptip,
  Radio,
  Select,
  Slider,
  Switch,
  TabPanel,
  Tabs,
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

  it("does not mutate controlled Input and InputNumber values", () => {
    const onInputChange = vi.fn();
    const onNumberChange = vi.fn();
    render(
      <>
        <Input value="fixed" clearable onChange={onInputChange} />
        <InputNumber value={10} onChange={onNumberChange} />
      </>
    );
    fireEvent.click(document.querySelector(".k-input-clearable")!);
    expect(screen.getByDisplayValue("fixed")).not.toBeNull();
    fireEvent.change(screen.getByDisplayValue("10"), { target: { value: "25" } });
    expect(onNumberChange).toHaveBeenCalledWith(25);
    expect(screen.getByDisplayValue("10")).not.toBeNull();
  });

  it("supports controlled and uncontrolled Collapse open keys", () => {
    const onOpenKeysChange = vi.fn();
    const { rerender } = render(
      <Collapse defaultOpenKeys={["one"]} onOpenKeysChange={onOpenKeysChange}>
        <CollapsePanel key="one" title="One">First</CollapsePanel>
        <CollapsePanel key="two" title="Two">Second</CollapsePanel>
      </Collapse>
    );
    expect(document.querySelectorAll(".k-collapse-item-active")).toHaveLength(1);
    fireEvent.click(screen.getByText("Two"));
    expect(onOpenKeysChange).toHaveBeenLastCalledWith(["one", "two"]);

    rerender(
      <Collapse openKeys={["one"]} onOpenKeysChange={onOpenKeysChange}>
        <CollapsePanel key="one" title="One">First</CollapsePanel>
        <CollapsePanel key="two" title="Two">Second</CollapsePanel>
      </Collapse>
    );
    fireEvent.click(screen.getByText("Two"));
    expect(onOpenKeysChange).toHaveBeenLastCalledWith(["one", "two"]);
    expect(document.querySelectorAll(".k-collapse-item-active")).toHaveLength(1);
  });

  it("uses mode-specific and range DatePicker placeholders", () => {
    const { rerender } = render(<DatePicker mode="year" />);
    expect(screen.getByPlaceholderText(zhCN.k.datePicker.selectYear)).not.toBeNull();
    rerender(<DatePicker mode="time" />);
    expect(screen.getByPlaceholderText(zhCN.k.datePicker.selectTime)).not.toBeNull();
    rerender(<DatePicker mode="dateRange" />);
    expect(screen.getByPlaceholderText(zhCN.k.datePicker.startDate)).not.toBeNull();
    expect(screen.getByPlaceholderText(zhCN.k.datePicker.endDate)).not.toBeNull();
  });

  it("requests Menu expansion without mutating controlled open keys", () => {
    const onOpenChange = vi.fn();
    render(
      <Menu
        mode="inline"
        openKeys={[]}
        onOpenChange={onOpenChange}
        items={[{ key: "parent", title: "Parent", children: [{ key: "child", title: "Child" }] }]}
      />
    );
    fireEvent.click(screen.getByText("Parent"));
    expect(onOpenChange).toHaveBeenCalledWith(["parent"]);
    expect(document.querySelector(".k-menu-submenu-open")).toBeNull();
  });

  it("keeps controlled Tabs and Slider values stable while requesting changes", () => {
    const onTabChange = vi.fn();
    const onSliderChange = vi.fn();
    render(
      <>
        <Tabs value="one" onChange={onTabChange}>
          <TabPanel key="one" title="One">First</TabPanel>
          <TabPanel key="two" title="Two">Second</TabPanel>
        </Tabs>
        <Slider value={10} min={0} max={10} onChange={onSliderChange} />
      </>
    );
    fireEvent.click(screen.getByText("Two"));
    expect(onTabChange).toHaveBeenCalledWith("two");
    expect(screen.getByText("First")).not.toBeNull();
    fireEvent.keyDown(screen.getByRole("slider"), { key: "ArrowRight" });
    expect(onSliderChange).toHaveBeenCalledWith(10);
    expect(screen.getByRole("slider").getAttribute("aria-valuenow")).toBe("10");
  });

  it("keeps controlled Carousel position stable while requesting navigation", () => {
    const onChange = vi.fn();
    render(
      <Carousel value={0} onChange={onChange}>
        <CarouselItem>Slide one</CarouselItem>
        <CarouselItem>Slide two</CarouselItem>
      </Carousel>
    );
    const dots = document.querySelectorAll(".k-carousel-dots li");
    fireEvent.click(dots[1]);
    expect(onChange).toHaveBeenCalledWith(1);
    expect(dots[0].classList.contains("k-carousel-dots-active")).toBe(true);
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
