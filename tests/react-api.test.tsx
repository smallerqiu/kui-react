import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import {
  Button,
  Calendar,
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
  Kanban,
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

describe("React value synchronization and controlled visibility", () => {
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
    const button = screen.getByRole("switch");
    fireEvent.click(radio);
    fireEvent.click(button);
    expect((radio as HTMLInputElement).checked).toBe(false);
    expect(button.classList.contains("k-switch-checked")).toBe(false);
    expect(radioChange).toHaveBeenCalledOnce();
    expect(switchChange).toHaveBeenCalledWith(true);
  });

  it("updates Input and InputNumber locally and reports changes", () => {
    const onInputChange = vi.fn();
    const onNumberChange = vi.fn();
    render(
      <>
        <Input value="fixed" clearable onChange={onInputChange} />
        <InputNumber value={10} onChange={onNumberChange} />
      </>,
    );
    fireEvent.click(document.querySelector(".k-input-clearable")!);
    expect(screen.queryByDisplayValue("fixed")).toBeNull();
    expect(onInputChange).toHaveBeenCalledWith("");
    fireEvent.change(screen.getByDisplayValue("10"), { target: { value: "25" } });
    expect(onNumberChange).toHaveBeenCalledWith(25);
    expect(screen.getByDisplayValue("25")).not.toBeNull();
  });

  it("updates Form models immutably and validates and resets fields", async () => {
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
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ valid: false }));
    await waitFor(() => expect(screen.getByText("Required")).not.toBeNull());
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Alice" } });
    expect(model.account.name).toBe("");
    expect(onChange).toHaveBeenLastCalledWith({ account: { name: "Alice" } });
    fireEvent.reset(document.querySelector("form")!);
    expect(onChange).toHaveBeenLastCalledWith({ account: { name: null } });
    expect(onReset).toHaveBeenCalledOnce();
  });

  it("keeps prefixes and suffixes inline and uses addons for InputGroup", () => {
    const { unmount } = render(<Input prefix="¥" suffix="CNY" />);
    expect(document.querySelector(".k-input-prefix")?.textContent).toBe("¥");
    expect(document.querySelector(".k-input-suffix")?.textContent).toBe("CNY");
    expect(document.querySelector(".k-input-group")).toBeNull();
    unmount();

    const inline = render(
      <Input prefix={<button>Prefix action</button>} suffix={<button>Suffix action</button>} />,
    );
    expect(document.querySelector(".k-input-prefix button")?.textContent).toBe("Prefix action");
    expect(document.querySelector(".k-input-suffix button")?.textContent).toBe("Suffix action");
    expect(document.querySelector(".k-input-group")).toBeNull();
    inline.unmount();

    render(
      <Input
        addonBefore={<button>Prefix action</button>}
        addonAfter={<button>Suffix action</button>}
      />,
    );
    expect(document.querySelector(".k-input-group-prefix button")?.textContent).toBe(
      "Prefix action",
    );
    expect(document.querySelector(".k-input-group-suffix button")?.textContent).toBe(
      "Suffix action",
    );
  });

  it("keeps affixes inside when addons create an InputGroup", () => {
    render(
      <Input
        prefix={<button>Prefix action</button>}
        suffix={<button>Suffix action</button>}
        addonAfter={<button>Addon action</button>}
      />,
    );

    expect(document.querySelector(".k-input-prefix button")?.textContent).toBe("Prefix action");
    expect(document.querySelector(".k-input-suffix button")?.textContent).toBe("Suffix action");
    expect(document.querySelector(".k-input-group-suffix button")?.textContent).toBe(
      "Addon action",
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

  it("preserves numeric Collapse keys and does not toggle from extra controls", () => {
    const onOpenKeysChange = vi.fn();
    render(
      <Collapse defaultOpenKeys={[1]} onOpenKeysChange={onOpenKeysChange}>
        <CollapsePanel key={1} title="One" extra={<button>Settings</button>}>
          First
        </CollapsePanel>
      </Collapse>,
    );

    const header = screen.getByText("One").closest(".k-collapse-header")!;
    expect(header.getAttribute("aria-expanded")).toBe("true");
    fireEvent.click(header);
    expect(onOpenKeysChange).toHaveBeenLastCalledWith([]);
    fireEvent.click(header);
    expect(onOpenKeysChange).toHaveBeenLastCalledWith([1]);

    fireEvent.keyDown(screen.getByRole("button", { name: "Settings" }), { key: "Enter" });
    expect(onOpenKeysChange).toHaveBeenCalledTimes(2);
  });

  it("closes equivalent numeric and string Collapse keys", () => {
    const onOpenKeysChange = vi.fn();
    render(
      <Collapse defaultOpenKeys={[1]} onOpenKeysChange={onOpenKeysChange}>
        <CollapsePanel panelKey="1" title="One">
          First
        </CollapsePanel>
      </Collapse>,
    );
    fireEvent.click(screen.getByText("One").closest(".k-collapse-header")!);
    expect(onOpenKeysChange).toHaveBeenLastCalledWith([]);
  });

  it("remembers numeric Collapse keys supplied after mount", () => {
    const onOpenKeysChange = vi.fn();
    const panels = (
      <CollapsePanel key={2} title="Two">
        Second
      </CollapsePanel>
    );
    const { rerender } = render(
      <Collapse openKeys={[]} onOpenKeysChange={onOpenKeysChange}>
        {panels}
      </Collapse>,
    );
    rerender(
      <Collapse openKeys={[2]} onOpenKeysChange={onOpenKeysChange}>
        {panels}
      </Collapse>,
    );
    rerender(
      <Collapse openKeys={[]} onOpenKeysChange={onOpenKeysChange}>
        {panels}
      </Collapse>,
    );
    fireEvent.click(screen.getByText("Two").closest(".k-collapse-header")!);
    expect(onOpenKeysChange).toHaveBeenLastCalledWith([2]);
  });

  it("animates Collapse layout height while a panel closes", () => {
    render(
      <Collapse defaultOpenKeys={["one"]}>
        <CollapsePanel key="one" title="One">
          Content
        </CollapsePanel>
      </Collapse>,
    );

    const content = document.querySelector<HTMLElement>(".k-collapse-content")!;
    content.getBoundingClientRect = () =>
      ({ height: 80, width: 100, top: 0, left: 0, right: 100, bottom: 80 }) as DOMRect;

    fireEvent.click(screen.getByText("One"));
    expect(document.body.contains(content)).toBe(true);
    expect(content.style.height).toBe("0px");
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
        value="2025-06-10"
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

    render(<DatePicker mode="time" defaultOpen value="10:20:30" />);
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

  it("localizes Calendar and follows controlled month changes", () => {
    const { rerender } = render(
      <ConfigProvider locale={enUS}>
        <Calendar value="2026-08-23" />
      </ConfigProvider>,
    );
    expect(document.querySelector(".k-calendar-weekdays span")?.textContent).toMatch(/^Sun/i);
    expect(screen.getByRole("button", { name: "Today" })).not.toBeNull();

    rerender(
      <ConfigProvider locale={enUS}>
        <Calendar value="2026-09-15" />
      </ConfigProvider>,
    );
    expect(
      document
        .querySelector('[data-date="2026-09-15"]')
        ?.classList.contains("k-calendar-cell-outside"),
    ).toBe(false);
  });

  it("selects today from another month and separates custom event clicks", () => {
    const onChange = vi.fn();
    const onEventClick = vi.fn();
    const event = { key: 1, date: "2020-01-15", title: "Review" };
    const { unmount } = render(
      <Calendar
        value="2020-01-15"
        events={[event]}
        onChange={onChange}
        onEventClick={onEventClick}
        event={(item) => <span>{item.title}</span>}
      />,
    );
    fireEvent.click(screen.getByText("Review"));
    expect(onEventClick).toHaveBeenCalledWith(event, expect.objectContaining({ date: event.date }));
    expect(onChange).not.toHaveBeenCalled();
    unmount();

    render(<Calendar value="2020-01-15" onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: zhCN.k.datePicker.today }));
    const now = new Date();
    const expected = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    expect(onChange).toHaveBeenLastCalledWith(
      expected,
      expect.objectContaining({ date: expected }),
    );
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

  it("updates Tabs and Slider values while reporting changes", () => {
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
    expect(document.querySelector(".k-tabs-tab-active")?.textContent).toContain("Two");
    fireEvent.keyDown(screen.getByRole("slider"), { key: "ArrowLeft" });
    expect(onSliderChange).toHaveBeenCalledWith(9);
    expect(screen.getByRole("slider").getAttribute("aria-valuenow")).toBe("9");
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
    fireEvent.click(screen.getByRole("button", { name: "More tabs" }));
    fireEvent.click(await screen.findByRole("menuitem", { name: "Tab 2" }));
    await waitFor(() =>
      expect(document.querySelector<HTMLElement>(".k-tabs-nav")?.style.transform).toBe(
        "translate3d(-200px,0,0)",
      ),
    );
    expect(screen.getByRole("tab", { name: "Tab 2" }).getAttribute("aria-selected")).toBe("true");

    // A new external value selects the final tab again before resizing.
    rerender(<Tabs value="tab-4">{panels}</Tabs>);
    rerender(<Tabs value="tab-5">{panels}</Tabs>);
    Object.defineProperty(wrap, "clientWidth", { configurable: true, value: 100 });
    triggerResize();
    await waitFor(() =>
      expect(document.querySelector<HTMLElement>(".k-tabs-nav")?.style.transform).toBe(
        "translate3d(-500px,0,0)",
      ),
    );
    Object.defineProperty(wrap, "clientWidth", { configurable: true, value: 800 });
    triggerResize();
    await waitFor(() =>
      expect(document.querySelector<HTMLElement>(".k-tabs-nav")?.style.transform).toBe(
        "translate3d(0px,0,0)",
      ),
    );
    expect(screen.queryByRole("button", { name: "More tabs" })).toBeNull();
    vi.stubGlobal("ResizeObserver", originalResizeObserver);
  });

  it("updates Carousel position while reporting navigation", () => {
    const onChange = vi.fn();
    render(
      <Carousel value={0} onChange={onChange}>
        <CarouselItem>Slide one</CarouselItem>
        <CarouselItem>Slide two</CarouselItem>
      </Carousel>,
    );
    const dots = document.querySelectorAll(".k-carousel-dots > button");
    fireEvent.click(dots[1]);
    expect(onChange).toHaveBeenCalledWith(1);
    expect(dots[1].classList.contains("k-carousel-dots-active")).toBe(true);
  });

  it("ignores rapid arrow clicks until the current transition ends", () => {
    const onChange = vi.fn();
    render(
      <Carousel onChange={onChange}>
        <CarouselItem>Slide one</CarouselItem>
        <CarouselItem>Slide two</CarouselItem>
        <CarouselItem>Slide three</CarouselItem>
      </Carousel>,
    );

    const next = screen.getByRole("button", { name: "Next slide" });
    fireEvent.click(next);
    fireEvent.click(next);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith(1);

    fireEvent.transitionEnd(document.querySelector(".k-carousel-wrapper")!, {
      propertyName: "transform",
    });
    fireEvent.click(next);
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenLastCalledWith(2);
  });

  it("moves Kanban cards with the keyboard without mutating data", () => {
    const data = [{ id: 1, status: "todo", title: "Task" }];
    const onMove = vi.fn();
    render(
      <Kanban
        columns={[
          { key: "todo", title: "Todo" },
          { key: "done", title: "Done" },
        ]}
        data={data}
        onMove={onMove}
      />,
    );

    fireEvent.keyDown(screen.getByText("Task"), { key: "ArrowRight", altKey: true });
    expect(onMove).toHaveBeenCalledWith({ item: data[0], from: "todo", to: "done" });
    expect(data[0].status).toBe("todo");
  });

  it("uses the ConfigProvider locale for empty Kanban columns", () => {
    render(
      <ConfigProvider locale={enUS}>
        <Kanban columns={[{ key: "todo", title: "Todo" }]} />
      </ConfigProvider>,
    );
    expect(screen.getByText("No Data")).not.toBeNull();
  });

  it("keeps numeric and string Kanban column keys distinct", () => {
    render(
      <Kanban
        columns={[
          { key: 1, title: "Number" },
          { key: "1", title: "String" },
        ]}
        data={[
          { id: 1, status: 1, title: "Numeric task" },
          { id: 2, status: "1", title: "String task" },
        ]}
      />,
    );
    expect(screen.getByRole("region", { name: "Number" }).textContent).toContain("Numeric task");
    expect(screen.getByRole("region", { name: "String" }).textContent).toContain("String task");
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
    const user = userEvent.setup();
    const checkbox = document.querySelector<HTMLInputElement>(
      ".k-table-body tbody input[type=checkbox]",
    )!;
    checkbox.focus();
    await user.keyboard("[Space]");
    expect(onSelectedKeysChange).toHaveBeenCalledWith(["one"]);
    expect((document.querySelector(".k-table-body input") as HTMLInputElement).checked).toBe(false);
    fireEvent.click(document.querySelector(".k-table-sorter-up")!);
    expect(onSort).toHaveBeenCalledWith({ key: "name", order: "asc" });

    rerender(<Table data={[]} columns={columns} emptyText="Nothing here" loading />);
    expect(screen.queryByText("Nothing here")).toBeNull();
    expect(document.querySelector(".k-table-loading-placeholder")).not.toBeNull();
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

  it("supports local Select value and visibility", async () => {
    const onChange = vi.fn();
    render(
      <Select
        defaultOpen
        value="one"
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

  it("filters Select options and clears local multiple values", () => {
    const onChange = vi.fn();
    render(
      <Select
        defaultOpen
        filterable
        multiple
        value={["one", "two"]}
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

  it("renders and clears TreeSelect multiple tags locally", () => {
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
    expect(document.querySelectorAll(".k-tree-select-labels .k-tag")).toHaveLength(0);
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

  it("supports ColorPicker appearance and keyboard interaction", () => {
    const { container, rerender } = render(<ColorPicker theme="fill" shape="circle" />);
    const trigger = screen.getByRole("combobox");
    expect(trigger.classList.contains("k-color-picker-fill")).toBe(true);
    expect(trigger.classList.contains("k-color-picker-circle")).toBe(true);

    fireEvent.keyDown(trigger, { key: "Enter" });
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    fireEvent.keyDown(trigger, { key: "Escape" });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");

    rerender(
      <ConfigProvider theme="plain" shape="square">
        <ColorPicker />
      </ConfigProvider>,
    );
    const inheritedTrigger = container.querySelector(".k-color-picker")!;
    expect(inheritedTrigger.classList.contains("k-color-picker-plain")).toBe(true);
    expect(inheritedTrigger.classList.contains("k-color-picker-square")).toBe(true);
  });

  it("omits the popup arrow in a panel-only ColorPicker", () => {
    const { container } = render(<ColorPicker panelOnly />);
    expect(container.querySelector(".k-color-picker-panel")).not.toBeNull();
    expect(container.querySelector(".k-color-picker-arrow")).toBeNull();
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
