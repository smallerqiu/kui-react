import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Cascader, DatePicker, InputTag, Select, TabPanel, Tabs, Tree, Upload } from "react-kui";
import Option from "../components/select/option";
import Slider from "../components/slider";
import { Dropdown } from "../components/dropdown";
import { MenuItem } from "../components/menu";

describe("disabled interaction guards", () => {
  it("clears MenuItem hover styling while disabled and after leaving", () => {
    const { getByRole, rerender } = render(<MenuItem title="Item" />);
    fireEvent.mouseEnter(getByRole("menuitem"));
    expect(getByRole("menuitem").classList.contains("k-menu-item-active")).toBe(true);
    rerender(<MenuItem title="Item" disabled />);
    expect(getByRole("menuitem").classList.contains("k-menu-item-active")).toBe(false);
    fireEvent.mouseLeave(getByRole("menuitem"));
    rerender(<MenuItem title="Item" />);
    expect(getByRole("menuitem").classList.contains("k-menu-item-active")).toBe(false);
    fireEvent.mouseEnter(getByRole("menuitem"));
    expect(getByRole("menuitem").classList.contains("k-menu-item-active")).toBe(true);
  });

  it.each(["Enter", " ", "ArrowRight"])(
    "does not redirect %s from a disabled Tree node to another node",
    (key) => {
      const onSelect = vi.fn();
      const onCheck = vi.fn();
      const onExpand = vi.fn();
      const data = (disabled: boolean) => [
        { key: "first", title: "First", disabled },
        { key: "second", title: "Second", children: [{ key: "child", title: "Child" }] },
      ];
      const { container, rerender } = render(
        <Tree
          checkable
          data={data(false)}
          onSelect={onSelect}
          onCheck={onCheck}
          onExpand={onExpand}
        />,
      );
      fireEvent.focus(container.querySelector('[data-tree-key="first"]')!);
      rerender(
        <Tree
          checkable
          data={data(true)}
          onSelect={onSelect}
          onCheck={onCheck}
          onExpand={onExpand}
        />,
      );
      const row = container.querySelector<HTMLElement>('[data-tree-key="first"]')!;
      fireEvent.keyDown(row, { key });
      expect(onSelect).not.toHaveBeenCalled();
      expect(onCheck).not.toHaveBeenCalled();
      expect(onExpand).not.toHaveBeenCalled();
      expect(row.tabIndex).toBe(-1);
      const enabled = container.querySelector<HTMLElement>('[data-tree-key="second"]')!;
      expect(enabled.tabIndex).toBe(0);
      fireEvent.focus(enabled);
      fireEvent.keyDown(enabled, { key });
      expect(key === "Enter" ? onSelect : key === " " ? onCheck : onExpand).toHaveBeenCalledTimes(
        1,
      );
    },
  );

  it.each(["ArrowDown", "ArrowUp", "Enter", " "])(
    "does not open a disabled Dropdown with %s",
    (key) => {
      const onOpenChange = vi.fn();
      const { getByRole, rerender } = render(
        <Dropdown disabled trigger="click" overlay={<div>Menu</div>} onOpenChange={onOpenChange}>
          <button>Trigger</button>
        </Dropdown>,
      );
      fireEvent.keyDown(getByRole("button"), { key });
      expect(onOpenChange).not.toHaveBeenCalled();
      expect(getByRole("button").getAttribute("aria-expanded")).toBe("false");
      rerender(
        <Dropdown trigger="click" overlay={<div>Menu</div>} onOpenChange={onOpenChange}>
          <button>Trigger</button>
        </Dropdown>,
      );
      fireEvent.keyDown(getByRole("button"), { key });
      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(getByRole("button").getAttribute("aria-expanded")).toBe("true");
    },
  );

  it("ignores keyboard navigation from a tab that becomes disabled", () => {
    const onChange = vi.fn();
    const view = (disabled: boolean) => (
      <Tabs onChange={onChange}>
        <TabPanel key="one" title="One" disabled={disabled} />
        <TabPanel key="two" title="Two" />
      </Tabs>
    );
    const { getAllByRole, rerender } = render(view(false));
    getAllByRole("tab")[0].focus();
    rerender(view(true));
    fireEvent.keyDown(getAllByRole("tab")[0], { key: "ArrowRight" });
    expect(onChange).not.toHaveBeenCalled();
    rerender(view(false));
    fireEvent.keyDown(getAllByRole("tab")[0], { key: "ArrowRight" });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("guards Option callbacks without replacing selection when enabled", () => {
    const onClick = vi.fn();
    const onMouseEnter = vi.fn();
    const onSelect = vi.fn();
    const { container, rerender } = render(
      <Option
        value="one"
        disabled
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onSelect={onSelect}
      />,
    );
    fireEvent.click(container.querySelector("li")!);
    fireEvent.mouseEnter(container.querySelector("li")!);
    expect(onClick).not.toHaveBeenCalled();
    expect(onMouseEnter).not.toHaveBeenCalled();
    expect(onSelect).not.toHaveBeenCalled();
    rerender(
      <Option value="one" onClick={onClick} onMouseEnter={onMouseEnter} onSelect={onSelect} />,
    );
    fireEvent.click(container.querySelector("li")!);
    fireEvent.mouseEnter(container.querySelector("li")!);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onMouseEnter).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("cancels an ongoing Slider drag when disabled", () => {
    const onChange = vi.fn();
    const { container, rerender } = render(<Slider onChange={onChange} />);
    const rail = container.querySelector<HTMLElement>(".k-slider-rail")!;
    vi.spyOn(rail, "getBoundingClientRect").mockReturnValue({
      left: 0,
      top: 0,
      right: 200,
      bottom: 24,
      width: 200,
      height: 24,
      x: 0,
      y: 0,
      toJSON() {},
    });
    fireEvent.mouseDown(container.querySelector(".k-slider-thumb")!);
    rerender(<Slider disabled onChange={onChange} />);
    fireEvent.mouseMove(document, { clientX: 150 });
    expect(onChange).not.toHaveBeenCalled();
    expect(container.querySelector(".is-dragging")).toBeNull();
    rerender(<Slider onChange={onChange} />);
    fireEvent.mouseMove(document, { clientX: 180 });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("does not activate a disabled Select option on hover", () => {
    const onChange = vi.fn();
    const { container } = render(
      <Select
        disabled
        defaultOpen
        onChange={onChange}
        options={[
          { label: "Disabled", value: "disabled", disabled: true },
          { label: "Enabled", value: "enabled" },
        ]}
      />,
    );
    const disabled = container.ownerDocument.querySelector<HTMLElement>(".k-select-item-disabled")!;

    fireEvent.mouseEnter(disabled);
    fireEvent.click(container.ownerDocument.querySelectorAll(".k-select-item")[1]);

    expect(disabled.classList.contains("k-select-item-active")).toBe(false);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("does not close a disabled closable tab", () => {
    const onRemove = vi.fn();
    const { container } = render(
      <Tabs variant="card" onRemove={onRemove}>
        <TabPanel key="disabled" title="Disabled" disabled closable />
        <TabPanel key="enabled" title="Enabled" />
      </Tabs>,
    );
    const close = container.querySelector<HTMLElement>(".k-tabs-close")!;

    fireEvent.click(close);
    fireEvent.keyDown(close, { key: "Enter" });

    expect(onRemove).not.toHaveBeenCalled();
    expect(close.getAttribute("aria-disabled")).toBe("true");
    expect(close.tabIndex).toBe(-1);
  });

  it("does not enter drag-over state while Upload is disabled", () => {
    const { container } = render(<Upload disabled draggable />);
    const target = container.querySelector<HTMLElement>(".k-upload-add")!;

    fireEvent.dragEnter(target);
    fireEvent.dragOver(target);

    expect(target.classList.contains("k-upload-drag-over")).toBe(false);
  });

  it("disables Upload abort and retry actions", () => {
    const { getByTitle } = render(
      <Upload
        disabled
        fileList={[
          { uid: "uploading", filename: "uploading.txt", status: "uploading" },
          { uid: "error", filename: "error.txt", status: "error" },
        ]}
      />,
    );

    expect((getByTitle("Cancel upload") as HTMLButtonElement).disabled).toBe(true);
    expect((getByTitle("Retry upload") as HTMLButtonElement).disabled).toBe(true);
  });

  it("does not call root click handlers while disabled", () => {
    const cascaderClick = vi.fn();
    const inputTagClick = vi.fn();
    const { container } = render(
      <>
        <Cascader disabled options={[]} onClick={cascaderClick} />
        <InputTag disabled onClick={inputTagClick} />
      </>,
    );

    fireEvent.click(container.querySelector(".k-cascader")!);
    fireEvent.click(container.querySelector(".k-input-tag")!);

    expect(cascaderClick).not.toHaveBeenCalled();
    expect(inputTagClick).not.toHaveBeenCalled();
  });

  it("disables every interaction in a disabled DatePicker panel", () => {
    const onChange = vi.fn();
    const { container } = render(<DatePicker panelOnly disabled onChange={onChange} />);
    const panel = container.querySelector<HTMLElement>(".k-datepicker-overlay")!;
    const label = panel.querySelector(".k-picker-header-label")!.textContent;

    fireEvent.click(panel.querySelector(".k-picker-header button:last-child")!);
    fireEvent.click(panel.querySelector(".k-picker-day:not(.k-picker-day-out)")!);

    expect(panel.classList.contains("k-datepicker-disabled")).toBe(true);
    expect(panel.getAttribute("aria-disabled")).toBe("true");
    expect(panel.querySelector(".k-picker-header-label")!.textContent).toBe(label);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("disables every Tree node through the root disabled prop", () => {
    const onSelect = vi.fn();
    const onExpand = vi.fn();
    const { container } = render(
      <Tree
        disabled
        data={[{ key: "parent", title: "Parent", children: [{ key: "child", title: "Child" }] }]}
        onSelect={onSelect}
        onExpand={onExpand}
      />,
    );
    const row = container.querySelector<HTMLElement>("[data-tree-key='parent']")!;

    fireEvent.click(row.querySelector(".k-tree-title")!);
    fireEvent.click(row.querySelector(".k-tree-arrow")!);

    expect(row.classList.contains("k-tree-item-disabled")).toBe(true);
    expect(row.querySelector<HTMLButtonElement>(".k-tree-arrow button")!.disabled).toBe(true);
    expect(onSelect).not.toHaveBeenCalled();
    expect(onExpand).not.toHaveBeenCalled();
  });
});
