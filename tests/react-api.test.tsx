import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import {
  Button,
  Carousel,
  CarouselItem,
  Checkbox,
  ConfigProvider,
  Collapse,
  CollapsePanel,
  ColorPicker,
  DatePicker,
  Drawer,
  Form,
  FormItem,
  Input,
  InputNumber,
  Menu,
  Modal,
  Poptip,
  Popconfirm,
  Radio,
  Select,
  Slider,
  Switch,
  TabPanel,
  Tabs,
  Table,
  Tooltip,
  TreeSelect,
  Tree,
  Upload,
  modal,
} from "react-kui";
import Transition from "../components/base/transition";
import enUS from "../components/locale/en";
import zhCN from "../components/locale/zh-CN";

describe("React controlled and uncontrolled conventions", () => {
  it("uses defaultChecked only as the initial Checkbox state", () => {
    const onChange = vi.fn();
    render(
      <Checkbox defaultChecked onChange={onChange}>
        Remember
      </Checkbox>,
    );
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
        <Radio checked={false} onChange={radioChange}>
          Radio
        </Radio>
        <Switch checked={false} onChange={switchChange} />
      </>,
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
      </>,
    );
    fireEvent.click(document.querySelector(".k-input-clearable")!);
    expect(screen.getByDisplayValue("fixed")).not.toBeNull();
    fireEvent.change(screen.getByDisplayValue("10"), { target: { value: "25" } });
    expect(onNumberChange).toHaveBeenCalledWith(25);
    expect(screen.getByDisplayValue("10")).not.toBeNull();
  });

  it("updates Form models immutably and validates and resets fields", () => {
    const model = { account: { name: "" } };
    const onChange = vi.fn();
    const onSubmit = vi.fn();
    const onReset = vi.fn();
    render(
      <Form model={model} onChange={onChange} onSubmit={onSubmit} onReset={onReset}>
        <FormItem label="Name" prop="account.name" rules={{ required: true, message: "Required" }}>
          <Input />
        </FormItem>
      </Form>,
    );
    fireEvent.submit(document.querySelector("form")!);
    expect(onSubmit).toHaveBeenCalledWith({ valid: false });
    expect(screen.getByText("Required")).not.toBeNull();
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Alice" } });
    expect(model.account.name).toBe("");
    expect(onChange).toHaveBeenLastCalledWith({ account: { name: "Alice" } });
    fireEvent.reset(document.querySelector("form")!);
    expect(onChange).toHaveBeenLastCalledWith({ account: { name: undefined } });
    expect(onReset).toHaveBeenCalledOnce();
  });

  it("places text affixes inline and React nodes in InputGroup", () => {
    const { unmount } = render(<Input prefix="¥" suffix="CNY" />);
    expect(document.querySelector(".k-input-prefix")?.textContent).toBe("¥");
    expect(document.querySelector(".k-input-suffix")?.textContent).toBe("CNY");
    expect(document.querySelector(".k-input-group")).toBeNull();
    unmount();

    render(
      <Input prefix={<button>Prefix action</button>} suffix={<button>Suffix action</button>} />,
    );
    expect(document.querySelector(".k-input-group-prefix button")?.textContent).toBe(
      "Prefix action",
    );
    expect(document.querySelector(".k-input-group-suffix button")?.textContent).toBe(
      "Suffix action",
    );
  });

  it("supports controlled and uncontrolled Collapse open keys", () => {
    const onOpenKeysChange = vi.fn();
    const { rerender } = render(
      <Collapse defaultOpenKeys={["one"]} onOpenKeysChange={onOpenKeysChange}>
        <CollapsePanel key="one" title="One">
          First
        </CollapsePanel>
        <CollapsePanel key="two" title="Two">
          Second
        </CollapsePanel>
      </Collapse>,
    );
    expect(document.querySelectorAll(".k-collapse-item-active")).toHaveLength(1);
    fireEvent.click(screen.getByText("Two"));
    expect(onOpenKeysChange).toHaveBeenLastCalledWith(["one", "two"]);

    rerender(
      <Collapse openKeys={["one"]} onOpenKeysChange={onOpenKeysChange}>
        <CollapsePanel key="one" title="One">
          First
        </CollapsePanel>
        <CollapsePanel key="two" title="Two">
          Second
        </CollapsePanel>
      </Collapse>,
    );
    fireEvent.click(screen.getByText("Two"));
    expect(onOpenKeysChange).toHaveBeenLastCalledWith(["one", "two"]);
    expect(document.querySelectorAll(".k-collapse-item-active")).toHaveLength(1);
  });

  it("supports keyboard interaction and disabled Collapse panels", () => {
    const onOpenKeysChange = vi.fn();
    render(
      <Collapse onOpenKeysChange={onOpenKeysChange}>
        <CollapsePanel key="one" title="One">
          First
        </CollapsePanel>
        <CollapsePanel key="two" title="Two" disabled>
          Second
        </CollapsePanel>
      </Collapse>,
    );
    const headers = screen.getAllByRole("button");

    fireEvent.keyDown(headers[0], { key: "Enter" });
    expect(onOpenKeysChange).toHaveBeenLastCalledWith(["one"]);
    expect(headers[0].getAttribute("aria-expanded")).toBe("true");

    fireEvent.click(headers[1]);
    fireEvent.keyDown(headers[1], { key: " " });
    expect(onOpenKeysChange).toHaveBeenCalledTimes(1);
    expect(headers[1].getAttribute("aria-disabled")).toBe("true");
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

  it("renders DatePicker mode panels and respects disabled dates", () => {
    const onChange = vi.fn();
    const { unmount } = render(
      <DatePicker
        defaultOpen
        defaultValue="2025-06-10"
        disabledDate={(date) => date.getDate() === 11}
        onChange={onChange}
      />,
    );
    const disabledDay = [...document.querySelectorAll<HTMLElement>(".k-picker-day")].find(
      (node) => !node.classList.contains("k-picker-day-out") && node.textContent === "11",
    );
    expect(disabledDay?.classList.contains("k-picker-day-disabled")).toBe(true);
    fireEvent.click(disabledDay!);
    expect(onChange).not.toHaveBeenCalled();
    unmount();

    render(<DatePicker mode="time" defaultOpen defaultValue="10:20:30" />);
    expect(document.querySelectorAll(".k-picker-time-col")).toHaveLength(3);
  });

  it("emits a complete DatePicker range and uses ConfigProvider locale", () => {
    const onChange = vi.fn();
    const { unmount } = render(<DatePicker mode="dateRange" defaultOpen onChange={onChange} />);
    const days = document.querySelectorAll<HTMLElement>(
      ".k-picker-day:not(.k-picker-day-out):not(.k-picker-day-disabled)",
    );
    fireEvent.click(days[5]);
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.click(days[10]);
    expect(onChange).toHaveBeenCalledWith(
      expect.arrayContaining([expect.any(String), expect.any(String)]),
      expect.arrayContaining([expect.any(String), expect.any(String)]),
    );
    unmount();

    render(
      <ConfigProvider locale={enUS}>
        <DatePicker mode="year" />
      </ConfigProvider>,
    );
    expect(screen.getByPlaceholderText(enUS.k.datePicker.selectYear)).not.toBeNull();
  });

  it("requests Menu expansion without mutating controlled open keys", () => {
    const onOpenChange = vi.fn();
    render(
      <Menu
        mode="inline"
        openKeys={[]}
        onOpenChange={onOpenChange}
        items={[{ key: "parent", title: "Parent", children: [{ key: "child", title: "Child" }] }]}
      />,
    );
    fireEvent.click(screen.getByText("Parent"));
    expect(onOpenChange).toHaveBeenCalledWith(["parent"]);
    expect(document.querySelector(".k-menu-submenu-open")).toBeNull();
  });

  it("keeps inline Menu content mounted through its collapse transition and selects items", async () => {
    const onSelect = vi.fn();
    render(
      <Menu
        mode="inline"
        defaultOpenKeys={["parent"]}
        onSelect={onSelect}
        items={[{ key: "parent", title: "Parent", children: [{ key: "child", title: "Child" }] }]}
      />,
    );
    await waitFor(() => expect(screen.getByText("Child")).not.toBeNull());
    fireEvent.click(screen.getByText("Child"));
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ key: "child" }));
    fireEvent.click(screen.getByText("Parent"));
    expect(screen.getByText("Child")).not.toBeNull();
    await waitFor(() => expect(screen.queryByText("Child")).toBeNull());
  });

  it("animates an expanded inline submenu when inlineCollapsed changes", async () => {
    const items = [
      { key: "parent", title: "Parent", children: [{ key: "child", title: "Child" }] },
    ];
    const { rerender } = render(
      <Menu mode="inline" defaultOpenKeys={["parent"]} items={items} inlineCollapsed={false} />,
    );
    await waitFor(() => expect(screen.getByText("Child")).not.toBeNull());
    rerender(<Menu mode="inline" defaultOpenKeys={["parent"]} items={items} inlineCollapsed />);
    expect(screen.getByText("Child")).not.toBeNull();
    await waitFor(() => expect(screen.queryByText("Child")).toBeNull());
    expect(document.querySelector(".k-menu-inline-collapsed")).not.toBeNull();
  });

  it("keeps controlled Tabs and Slider values stable while requesting changes", () => {
    const onTabChange = vi.fn();
    const onSliderChange = vi.fn();
    render(
      <>
        <Tabs value="one" onChange={onTabChange}>
          <TabPanel key="one" title="One">
            First
          </TabPanel>
          <TabPanel key="two" title="Two">
            Second
          </TabPanel>
        </Tabs>
        <Slider value={10} min={0} max={10} onChange={onSliderChange} />
      </>,
    );
    fireEvent.click(screen.getByText("Two"));
    expect(onTabChange).toHaveBeenCalledWith("two");
    expect(screen.getByText("First")).not.toBeNull();
    fireEvent.keyDown(screen.getByRole("slider"), { key: "ArrowRight" });
    expect(onSliderChange).toHaveBeenCalledWith(10);
    expect(screen.getByRole("slider").getAttribute("aria-valuenow")).toBe("10");
  });

  it("clamps scrollable Tabs navigation and keeps the active tab visible", async () => {
    const originalResizeObserver = globalThis.ResizeObserver;
    let triggerResize = () => {};
    class MockResizeObserver {
      constructor(callback: ResizeObserverCallback) {
        triggerResize = () => callback([], this as unknown as ResizeObserver);
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    vi.stubGlobal("ResizeObserver", MockResizeObserver);
    const panels = Array.from({ length: 6 }, (_, index) => (
      <TabPanel key={`tab-${index}`} title={`Tab ${index}`}>
        Content {index}
      </TabPanel>
    ));
    const { rerender } = render(<Tabs value="tab-0">{panels}</Tabs>);
    const wrap = document.querySelector<HTMLElement>(".k-tabs-nav-wrap")!;
    const inner = document.querySelector<HTMLElement>(".k-tabs-nav-inner")!;
    Object.defineProperty(wrap, "clientWidth", { configurable: true, value: 200 });
    Object.defineProperty(inner, "scrollWidth", { configurable: true, value: 600 });
    Array.from(inner.children).forEach((tab, index) => {
      Object.defineProperty(tab, "offsetLeft", { configurable: true, value: index * 100 });
      Object.defineProperty(tab, "offsetWidth", { configurable: true, value: 100 });
    });

    rerender(<Tabs value="tab-5">{panels}</Tabs>);
    await waitFor(() =>
      expect(document.querySelector<HTMLElement>(".k-tabs-nav")?.style.transform).toBe(
        "translate3d(-400px,0,0)",
      ),
    );
    const previous = document.querySelector<HTMLButtonElement>(".k-tabs-tab-btn-prev")!;
    const next = document.querySelector<HTMLButtonElement>(".k-tabs-tab-btn-next")!;
    expect(previous.disabled).toBe(false);
    expect(next.disabled).toBe(true);

    fireEvent.click(previous);
    expect(document.querySelector<HTMLElement>(".k-tabs-nav")?.style.transform).toBe(
      "translate3d(-200px,0,0)",
    );
    expect(next.disabled).toBe(false);

    Object.defineProperty(wrap, "clientWidth", { configurable: true, value: 100 });
    triggerResize();
    await waitFor(() =>
      expect(document.querySelector<HTMLElement>(".k-tabs-nav")?.style.transform).toBe(
        "translate3d(-500px,0,0)",
      ),
    );
    expect(next.disabled).toBe(true);
    vi.stubGlobal("ResizeObserver", originalResizeObserver);
  });

  it("keeps controlled Carousel position stable while requesting navigation", () => {
    const onChange = vi.fn();
    render(
      <Carousel value={0} onChange={onChange}>
        <CarouselItem>Slide one</CarouselItem>
        <CarouselItem>Slide two</CarouselItem>
      </Carousel>,
    );
    const dots = document.querySelectorAll(".k-carousel-dots li");
    fireEvent.click(dots[1]);
    expect(onChange).toHaveBeenCalledWith(1);
    expect(dots[0].classList.contains("k-carousel-dots-active")).toBe(true);
  });

  it("supports Table selection, sorting, loading, and empty states", async () => {
    const onSelectedKeysChange = vi.fn();
    const onSort = vi.fn();
    const columns = [{ key: "name", title: "Name", sorter: true }];
    const { rerender } = render(
      <Table
        checkable
        selectedKeys={[]}
        data={[{ key: "one", name: "Alice" }]}
        columns={columns}
        onSelectedKeysChange={onSelectedKeysChange}
        onSort={onSort}
      />,
    );
    fireEvent.keyDown(document.querySelector(".k-table-body tbody .k-checkbox")!, {
      key: " ",
      code: "Space",
    });
    expect(onSelectedKeysChange).toHaveBeenCalledWith(["one"]);
    expect((document.querySelector(".k-table-body input") as HTMLInputElement).checked).toBe(false);
    fireEvent.click(document.querySelector(".k-table-sorter-up")!);
    expect(onSort).toHaveBeenCalledWith({ key: "name", order: "asc" });

    rerender(<Table data={[]} columns={columns} emptyText="Nothing here" loading />);
    expect(screen.getByText("Nothing here")).not.toBeNull();
    expect(document.querySelector(".k-spin")).not.toBeNull();
  });

  it("supports controlled Table tree expansion", () => {
    const onExpand = vi.fn();
    const onExpandedKeysChange = vi.fn();
    const data = [
      {
        key: "parent",
        name: "Parent row",
        children: [{ key: "child", name: "Child row" }],
      },
    ];
    const columns = [{ key: "name", title: "Name" }];
    const { rerender } = render(
      <Table
        data={data}
        columns={columns}
        expandedKeys={[]}
        onExpand={onExpand}
        onExpandedKeysChange={onExpandedKeysChange}
      />,
    );

    expect(screen.queryByText("Child row")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Expand row" }));
    expect(onExpand).toHaveBeenCalledWith(true, data[0]);
    expect(onExpandedKeysChange).toHaveBeenCalledWith(["parent"]);
    expect(screen.queryByText("Child row")).toBeNull();

    rerender(
      <Table
        data={data}
        columns={columns}
        expandedKeys={["parent"]}
        onExpand={onExpand}
        onExpandedKeysChange={onExpandedKeysChange}
      />,
    );
    expect(screen.getByText("Child row")).not.toBeNull();
    expect(document.querySelectorAll(".k-table-body tbody tr")).toHaveLength(2);
  });

  it("supports Tree selection, controlled expansion, and async loading", async () => {
    const onSelectedKeysChange = vi.fn();
    const onExpandedKeysChange = vi.fn();
    const loadData = vi.fn().mockResolvedValue(undefined);
    render(
      <Tree
        data={[{ key: "parent", title: "Parent", isLeaf: false }]}
        expandedKeys={[]}
        selectedKeys={[]}
        loadData={loadData}
        onSelectedKeysChange={onSelectedKeysChange}
        onExpandedKeysChange={onExpandedKeysChange}
      />,
    );
    fireEvent.click(screen.getByText("Parent"));
    expect(onSelectedKeysChange).toHaveBeenCalledWith(["parent"]);
    expect(document.querySelector(".k-tree-title-selected")).toBeNull();
    fireEvent.click(document.querySelector(".k-tree-arrow")!);
    await waitFor(() =>
      expect(loadData).toHaveBeenCalledWith(expect.objectContaining({ key: "parent" })),
    );
    await waitFor(() => expect(onExpandedKeysChange).toHaveBeenCalledWith(["parent"]));
    expect(document.querySelector(".k-tree-arrow-open")).toBeNull();
  });

  it("validates Upload file size before creating a request", () => {
    const onSizeError = vi.fn();
    const onChange = vi.fn();
    const xhr = vi.fn();
    vi.stubGlobal("XMLHttpRequest", xhr);
    render(<Upload action="/upload" maxSize={1} onSizeError={onSizeError} onChange={onChange} />);
    const file = new File([new Uint8Array(2048)], "large.txt", { type: "text/plain" });
    fireEvent.change(document.querySelector(".k-upload-file")!, { target: { files: [file] } });
    expect(onSizeError).toHaveBeenCalledWith(
      expect.objectContaining({ file: expect.objectContaining({ status: "error" }) }),
    );
    expect(onChange).toHaveBeenCalled();
    expect(xhr).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  it("transforms Upload files, reports progress, and aborts when removed", async () => {
    class FakeXHR {
      static instances: FakeXHR[] = [];
      upload: {
        onloadstart: (() => void) | null;
        onprogress:
          ((event: { lengthComputable: boolean; loaded: number; total: number }) => void) | null;
      } = { onloadstart: null, onprogress: null };
      readyState = 0;
      status = 0;
      responseText = "";
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
    vi.stubGlobal("XMLHttpRequest", FakeXHR);
    const transformFile = vi.fn(async (file: File) => file);
    const onChange = vi.fn();
    render(<Upload action="/upload" transformFile={transformFile} onChange={onChange} />);
    const file = new File(["content"], "data.txt", { type: "text/plain" });
    fireEvent.change(document.querySelector(".k-upload-file")!, { target: { files: [file] } });
    await waitFor(() => expect(FakeXHR.instances).toHaveLength(1));
    const request = FakeXHR.instances[0];
    expect(transformFile).toHaveBeenCalledWith(file);
    expect(request.send).toHaveBeenCalledWith(expect.any(FormData));
    request.upload.onloadstart?.();
    request.upload.onprogress?.({ lengthComputable: true, loaded: 1, total: 2 });
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ file: expect.objectContaining({ percent: 50 }) }),
    );
    fireEvent.click(document.querySelector(".k-upload-file-item-remove")!);
    expect(request.abort).toHaveBeenCalledOnce();
    vi.unstubAllGlobals();
  });

  it("focuses Modal, handles Escape, restores focus, and renders a ReactNode footer", async () => {
    const onOpenChange = vi.fn();
    render(
      <>
        <button autoFocus>Before modal</button>
        <Modal
          defaultOpen
          title="Dialog title"
          footer={<button>Custom footer</button>}
          onOpenChange={onOpenChange}
        >
          Dialog body
        </Modal>
      </>,
    );
    await waitFor(() =>
      expect(document.activeElement).toBe(document.querySelector(".k-modal-wrap")),
    );
    expect(screen.getByText("Custom footer")).not.toBeNull();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onOpenChange).toHaveBeenCalledWith(false);
    await waitFor(() =>
      expect(document.activeElement).toBe(screen.getByRole("button", { name: "Before modal" })),
    );
  });

  it("supports Drawer mask closing and omits footer markup when disabled", async () => {
    const onOpenChange = vi.fn();
    render(
      <Drawer defaultOpen title="Drawer title" footer={false} onOpenChange={onOpenChange}>
        Drawer body
      </Drawer>,
    );
    await waitFor(() =>
      expect(document.activeElement).toBe(document.querySelector(".k-drawer-wrap")),
    );
    expect(document.querySelector(".k-drawer-footer")).toBeNull();
    fireEvent.click(document.querySelector(".k-drawer-mask")!);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("creates and destroys global modal instances", async () => {
    const instance = modal.info({ title: "Global title", content: "Global content" });
    await waitFor(() => expect(screen.getByText("Global title")).not.toBeNull());
    expect(screen.getByText("Global content")).not.toBeNull();
    instance.destroy();
    await waitFor(() => expect(screen.queryByText("Global title")).toBeNull());
    modal.destroyAll();
  });

  it("destroys global modals after confirming or pressing Escape", async () => {
    modal.success({ title: "Success modal", content: "Saved" });
    await waitFor(() => expect(screen.getByText("Success modal")).not.toBeNull());
    fireEvent.click(screen.getByRole("button", { name: /OK|确定/ }));
    expect(screen.getByText("Success modal")).not.toBeNull();
    await waitFor(() => expect(screen.queryByText("Success modal")).toBeNull());

    modal.info({ title: "Escape modal", content: "Close me" });
    await waitFor(() => expect(screen.getByText("Escape modal")).not.toBeNull());
    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => expect(screen.queryByText("Escape modal")).toBeNull());
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
      />,
    );
    expect(document.querySelector(".k-select-dropdown")).not.toBeNull();
    fireEvent.click(screen.getByText("Two"));
    expect(onChange).toHaveBeenCalledWith("two");
    await waitFor(() => expect(document.querySelector(".k-select-opened")).toBeNull());
  });

  it("closes an uncontrolled Select on outside click", async () => {
    const onOpenChange = vi.fn();
    render(
      <Select defaultOpen options={[{ label: "One", value: "one" }]} onOpenChange={onOpenChange} />,
    );
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
    fireEvent.keyDown(select!, { key: "ArrowDown" });
    fireEvent.keyDown(select!, { key: "Enter" });
    await waitFor(() => expect(onChange).toHaveBeenCalledWith("one"));
  });

  it("filters Select options and clears uncontrolled multiple values", () => {
    const onChange = vi.fn();
    render(
      <Select
        defaultOpen
        filterable
        multiple
        defaultValue={["one", "two"]}
        options={[
          { label: "One", value: "one" },
          { label: "Two", value: "two" },
        ]}
        onChange={onChange}
      />,
    );
    expect(document.querySelectorAll(".k-select-labels .k-tag")).toHaveLength(2);
    fireEvent.change(document.querySelector(".k-select-search")!, { target: { value: "Two" } });
    expect(document.querySelectorAll(".k-select-item")).toHaveLength(1);
    fireEvent.click(document.querySelector(".k-select-clearable")!);
    expect(onChange).toHaveBeenLastCalledWith([]);
    expect(document.querySelectorAll(".k-select-labels .k-tag")).toHaveLength(0);
  });

  it("renders and clears TreeSelect multiple tags without mutating controlled values", () => {
    const onChange = vi.fn();
    const onClear = vi.fn();
    render(
      <TreeSelect
        multiple
        value={["one", "two"]}
        treeData={[
          { key: "one", title: "One" },
          { key: "two", title: "Two" },
        ]}
        onChange={onChange}
        onClear={onClear}
      />,
    );
    expect(document.querySelectorAll(".k-tree-select-labels .k-tag")).toHaveLength(2);
    fireEvent.click(document.querySelector(".k-tree-select-clearable")!);
    expect(onChange).toHaveBeenCalledWith([]);
    expect(onClear).toHaveBeenCalledOnce();
    expect(document.querySelectorAll(".k-tree-select-labels .k-tag")).toHaveLength(2);
  });

  it("requests changes without mutating controlled Poptip visibility", async () => {
    const onOpenChange = vi.fn();
    render(
      <Poptip open={false} trigger="click" content="Details" onOpenChange={onOpenChange}>
        <Button>Open</Button>
      </Poptip>,
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
      </Tooltip>,
    );
    fireEvent.mouseEnter(screen.getByRole("button", { name: "Target" }));
    await waitFor(() => expect(onShowChange).toHaveBeenCalledWith(true));
  });

  it("supports element triggers without replacing their refs or event handlers", async () => {
    const tooltipMouseEnter = vi.fn();
    const poptipClick = vi.fn((event: React.MouseEvent) => event.preventDefault());
    const popconfirmClick = vi.fn((event: React.MouseEvent) => event.preventDefault());
    const tooltipRef = React.createRef<HTMLAnchorElement>();

    render(
      <>
        <Tooltip title="How to behave?">
          <a ref={tooltipRef} href="#tooltip" onMouseEnter={tooltipMouseEnter}>
            Tooltip link
          </a>
        </Tooltip>
        <Poptip trigger="click" content="Poptip content">
          <a href="#poptip" onClick={poptipClick}>
            Poptip link
          </a>
        </Poptip>
        <Popconfirm title="Confirm?">
          <a href="#popconfirm" onClick={popconfirmClick}>
            Popconfirm link
          </a>
        </Popconfirm>
      </>,
    );

    fireEvent.mouseEnter(screen.getByRole("link", { name: "Tooltip link" }));
    expect(tooltipMouseEnter).toHaveBeenCalledOnce();
    expect(tooltipRef.current).toBe(screen.getByRole("link", { name: "Tooltip link" }));
    await waitFor(() => expect(screen.getByText("How to behave?")).not.toBeNull());

    fireEvent.click(screen.getByRole("link", { name: "Poptip link" }));
    expect(poptipClick).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.getByText("Poptip content")).not.toBeNull());

    fireEvent.click(screen.getByRole("link", { name: "Popconfirm link" }));
    expect(popconfirmClick).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.getByText("Confirm?")).not.toBeNull());
  });

  it("renders Poptip placement and arrow and keeps content during its exit transition", async () => {
    const onOpenChange = vi.fn();
    render(
      <Poptip
        defaultOpen
        placement="bottom-left"
        content="Popover body"
        onOpenChange={onOpenChange}
      >
        <button>Popover target</button>
      </Poptip>,
    );
    const poptip = document.querySelector(".k-poptip");
    expect(poptip?.getAttribute("k-placement")).not.toBeNull();
    expect(poptip?.querySelector(".k-poptip-arrow")).not.toBeNull();
    fireEvent.click(document.body);
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.getByText("Popover body")).not.toBeNull();
    await waitFor(() => expect(screen.queryByText("Popover body")).toBeNull());
  });

  it("renders Popconfirm arrow and handles cancellation", async () => {
    const onCancel = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <Popconfirm defaultOpen title="Delete item?" onCancel={onCancel} onOpenChange={onOpenChange}>
        <button>Delete</button>
      </Popconfirm>,
    );
    expect(document.querySelector(".k-popconfirm-arrow")).not.toBeNull();
    fireEvent.click(screen.getByRole("button", { name: zhCN.k.common.cancel }));
    expect(onCancel).toHaveBeenCalledOnce();
    expect(onOpenChange).toHaveBeenCalledWith(false);
    await waitFor(() => expect(screen.queryByText("Delete item?")).toBeNull());
  });

  it("renders ColorPicker arrow and closes on outside pointer input", async () => {
    const onOpenChange = vi.fn();
    render(<ColorPicker defaultOpen placement="top-right" onOpenChange={onOpenChange} />);
    const dropdown = document.querySelector(".k-color-picker-dropdown");
    expect(dropdown?.getAttribute("k-placement")).not.toBeNull();
    expect(dropdown?.querySelector(".k-color-picker-arrow")).not.toBeNull();
    fireEvent.mouseDown(document.body);
    expect(onOpenChange).toHaveBeenCalledWith(false);
    await waitFor(() => expect(document.querySelector(".k-color-picker-dropdown")).toBeNull());
  });
});

describe("Transition", () => {
  it("runs enter and leave lifecycles and unmounts after exit", async () => {
    const onAfterEnter = vi.fn();
    const onAfterLeave = vi.fn();
    const { rerender } = render(
      <Transition show={false} timeout={0} onAfterEnter={onAfterEnter} onAfterLeave={onAfterLeave}>
        <div>Animated content</div>
      </Transition>,
    );
    rerender(
      <Transition show timeout={0} onAfterEnter={onAfterEnter} onAfterLeave={onAfterLeave}>
        <div>Animated content</div>
      </Transition>,
    );
    await waitFor(() => expect(onAfterEnter).toHaveBeenCalledOnce());
    rerender(
      <Transition show={false} timeout={0} onAfterEnter={onAfterEnter} onAfterLeave={onAfterLeave}>
        <div>Animated content</div>
      </Transition>,
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
      </ConfigProvider>,
    );
    expect(screen.getByText("Choose an item")).not.toBeNull();
  });
});
