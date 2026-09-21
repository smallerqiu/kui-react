import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import {
  AutoComplete,
  Cascader,
  ColorPicker,
  ConfigProvider,
  DatePicker,
  Mentions,
  Popup,
  Select,
  TreeSelect,
} from "../components";

const cases: Array<{
  name: string;
  selector: string;
  event: "click" | "mousedown";
  render: (onOpenChange: (open: boolean) => void) => ReactNode;
}> = [
  {
    name: "ColorPicker",
    selector: ".k-color-picker-dropdown",
    event: "mousedown",
    render: (onOpenChange) => <ColorPicker defaultOpen onOpenChange={onOpenChange} />,
  },
  {
    name: "Select",
    selector: ".k-select-dropdown",
    event: "click",
    render: (onOpenChange) => (
      <Select defaultOpen options={[{ label: "One", value: "one" }]} onOpenChange={onOpenChange} />
    ),
  },
  {
    name: "TreeSelect",
    selector: ".k-tree-select-dropdown",
    event: "mousedown",
    render: (onOpenChange) => (
      <TreeSelect
        defaultOpen
        treeData={[{ key: "one", title: "One" }]}
        onOpenChange={onOpenChange}
      />
    ),
  },
  {
    name: "Cascader",
    selector: ".k-cascader-dropdown",
    event: "mousedown",
    render: (onOpenChange) => (
      <Cascader
        defaultOpen
        options={[{ value: "one", label: "One" }]}
        onOpenChange={onOpenChange}
      />
    ),
  },
  {
    name: "AutoComplete",
    selector: ".k-auto-complete-dropdown",
    event: "click",
    render: (onOpenChange) => (
      <AutoComplete defaultOpen showOnEmpty options={["one"]} onOpenChange={onOpenChange} />
    ),
  },
  {
    name: "DatePicker",
    selector: ".k-datepicker-overlay",
    event: "mousedown",
    render: (onOpenChange) => <DatePicker defaultOpen onOpenChange={onOpenChange} />,
  },
];

describe.each(cases)("$name Popup adapter", ({ selector, event, render: renderSelector }) => {
  it("keeps the original overlay root in the configured container and closes exactly once", async () => {
    const container = document.createElement("section");
    document.body.append(container);
    const onOpenChange = vi.fn();
    const view = render(
      <ConfigProvider getPopupContainer={() => container}>
        {renderSelector(onOpenChange)}
      </ConfigProvider>,
    );
    try {
      const panel = container.querySelector<HTMLElement>(selector)!;
      expect(panel).not.toBeNull();
      await waitFor(() => expect(panel.style.visibility).not.toBe("hidden"));
      expect(panel.parentElement).toBe(container);
      expect(panel.querySelector(".k-popup-content")).toBeNull();
      fireEvent(panel, new MouseEvent(event, { bubbles: true }));
      expect(onOpenChange).not.toHaveBeenCalled();
      fireEvent(document.body, new MouseEvent(event, { bubbles: true }));
      expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
      fireEvent(document.body, new MouseEvent(event, { bubbles: true }));
      expect(onOpenChange).toHaveBeenCalledTimes(1);
      await waitFor(() => expect(container.querySelector(selector)).toBeNull());
    } finally {
      view.unmount();
      container.remove();
    }
  });

  it("uses the shared top-layer Escape handler without duplicate notifications", () => {
    const onOpenChange = vi.fn();
    render(renderSelector(onOpenChange));
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
  });
});

describe("nested selector popups", () => {
  it("keeps the parent open while choosing from a portalled selector", async () => {
    const parentChange = vi.fn(),
      selected = vi.fn();
    render(
      <Popup
        open
        onOpenChange={parentChange}
        overlay={
          <Select defaultOpen options={[{ label: "One", value: "one" }]} onChange={selected} />
        }
      >
        <button>Parent</button>
      </Popup>,
    );
    fireEvent.click(await screen.findByText("One"));
    expect(selected).toHaveBeenCalledWith("one");
    expect(parentChange).not.toHaveBeenCalled();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(parentChange).toHaveBeenCalledWith(false, expect.objectContaining({ reason: "escape" }));
  });

  it("positions Mentions through Popup while retaining caret-driven selection", async () => {
    const onSelect = vi.fn();
    render(<Mentions options={["alice"]} onSelect={onSelect} />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "@al", selectionStart: 3 } });
    const option = await screen.findByRole("option", { name: "alice" });
    expect(document.querySelector(".k-mentions-dropdown")?.parentElement).toBe(document.body);
    fireEvent.mouseDown(option);
    fireEvent.click(option);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});
