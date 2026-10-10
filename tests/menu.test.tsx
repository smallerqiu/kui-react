import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Fragment, useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Menu, MenuDivider, MenuGroup, MenuItem, SubMenu } from "../components/menu";

const items = [
  {
    key: "root",
    title: "Root",
    children: [{ key: "nested", title: "Nested", children: [{ key: "leaf", title: "Leaf" }] }],
  },
];
const popupItems = [{ key: "root", title: "Root", children: [{ key: "leaf", title: "Leaf" }] }];
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("Menu popup state", () => {
  it.each(["vertical", "horizontal"] as const)(
    "honors initial and external openKeys in %s",
    async (mode) => {
      const onOpenChange = vi.fn();
      const { rerender } = render(
        <Menu mode={mode} openKeys={["root"]} items={items} onOpenChange={onOpenChange} />,
      );
      await waitFor(() =>
        expect(document.querySelector<HTMLElement>(".k-menu-submenu-popup")?.style.visibility).toBe(
          "",
        ),
      );
      expect(screen.getByText("Nested")).not.toBeNull();
      rerender(<Menu mode={mode} openKeys={[]} items={items} onOpenChange={onOpenChange} />);
      await waitFor(() => expect(screen.queryByText("Nested")).toBeNull());
      rerender(<Menu mode={mode} openKeys={["root"]} items={items} onOpenChange={onOpenChange} />);
      await waitFor(() => expect(screen.getByText("Nested")).not.toBeNull());
      expect(onOpenChange).not.toHaveBeenCalled();
    },
  );
  it("creates a popup on its first external opening", async () => {
    const { rerender } = render(<Menu openKeys={[]} items={items} />);
    expect(screen.queryByText("Nested")).toBeNull();
    rerender(<Menu openKeys={["root"]} items={items} />);
    await waitFor(() =>
      expect(document.querySelector<HTMLElement>(".k-menu-submenu-popup")?.style.visibility).toBe(
        "",
      ),
    );
    expect(screen.getByText("Nested")).not.toBeNull();
  });
});

describe("Menu item activation", () => {
  it.each(["Enter", " "])("invokes click and select exactly once for %j", (key) => {
    const onClick = vi.fn();
    const onSelect = vi.fn();
    render(
      <Menu onSelect={onSelect}>
        <MenuItem itemKey="leaf" onClick={onClick}>
          Leaf
        </MenuItem>
      </Menu>,
    );
    fireEvent.keyDown(screen.getByRole("menuitem"), { key });
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledExactlyOnceWith({ key: "leaf", keyPath: [] });
  });
  it("blocks mouse and keyboard activation on disabled items", () => {
    const onClick = vi.fn();
    const onSelect = vi.fn();
    const onParentClick = vi.fn();
    render(
      <div onClick={onParentClick}>
        <Menu onSelect={onSelect}>
          <MenuItem itemKey="leaf" disabled onClick={onClick}>
            Leaf
          </MenuItem>
        </Menu>
      </div>,
    );
    const item = screen.getByRole("menuitem");
    fireEvent.click(item);
    fireEvent.keyDown(item, { key: "Enter" });
    fireEvent.keyDown(item, { key: " " });
    expect(onClick).not.toHaveBeenCalled();
    expect(onSelect).not.toHaveBeenCalled();
    expect(onParentClick).not.toHaveBeenCalled();
  });
});

describe("Menu inline collapse", () => {
  it("restores controlled inline memory after interacting with a collapsed popup", async () => {
    vi.useFakeTimers();
    function Controlled({ collapsed }: { collapsed: boolean }) {
      const [openKeys, setOpenKeys] = useState(["root", "nested"]);
      return (
        <Menu
          mode="inline"
          openKeys={openKeys}
          onOpenChange={setOpenKeys}
          items={items}
          inlineCollapsed={collapsed}
        />
      );
    }
    const { rerender } = render(<Controlled collapsed={false} />);
    rerender(<Controlled collapsed />);
    await act(() => vi.advanceTimersByTimeAsync(250));
    fireEvent.mouseEnter(screen.getByText("Root"));
    await act(() => vi.advanceTimersByTimeAsync(100));
    fireEvent.mouseEnter(screen.getByText("Nested"));
    await act(() => vi.advanceTimersByTimeAsync(100));
    fireEvent.click(screen.getByText("Leaf"));
    rerender(<Controlled collapsed={false} />);
    await act(() => vi.advanceTimersByTimeAsync(400));
    expect(document.querySelectorAll('.k-menu-submenu-title[aria-expanded="true"]')).toHaveLength(
      2,
    );
    expect(screen.getByText("Leaf")).not.toBeNull();
  });

  it("keeps the leaf DOM node stable when toggling tooltips", () => {
    const { rerender } = render(
      <Menu mode="inline">
        <MenuItem itemKey="leaf">Leaf</MenuItem>
      </Menu>,
    );
    const item = screen.getByRole("menuitem");
    rerender(
      <Menu mode="inline" inlineCollapsed>
        <MenuItem itemKey="leaf">Leaf</MenuItem>
      </Menu>,
    );
    expect(screen.getByRole("menuitem")).toBe(item);
    rerender(
      <Menu mode="inline">
        <MenuItem itemKey="leaf">Leaf</MenuItem>
      </Menu>,
    );
    expect(screen.getByRole("menuitem")).toBe(item);
  });
  it("restores nested memory across rapid toggles, but not manually closed menus", async () => {
    vi.useFakeTimers();
    const openKeys = ["root", "nested"];
    const { rerender } = render(<Menu mode="inline" openKeys={openKeys} items={items} />);
    const toggle = (inlineCollapsed: boolean) =>
      rerender(
        <Menu mode="inline" openKeys={openKeys} items={items} inlineCollapsed={inlineCollapsed} />,
      );
    toggle(true);
    await act(() => vi.advanceTimersByTimeAsync(250));
    toggle(false);
    toggle(true);
    await act(() => vi.advanceTimersByTimeAsync(250));
    toggle(false);
    await act(() => vi.advanceTimersByTimeAsync(400));
    expect(document.querySelectorAll('.k-menu-submenu-title[aria-expanded="true"]')).toHaveLength(
      2,
    );
    fireEvent.click(screen.getByText("Nested"));
    fireEvent.click(screen.getByText("Root"));
    await act(() => vi.advanceTimersByTimeAsync(350));
    toggle(true);
    await act(() => vi.advanceTimersByTimeAsync(250));
    toggle(false);
    await act(() => vi.advanceTimersByTimeAsync(400));
    expect(document.querySelectorAll('.k-menu-submenu-title[aria-expanded="true"]')).toHaveLength(
      0,
    );
  });
  it("keeps an external openKeys update made while collapsed as the remembered expansion", async () => {
    vi.useFakeTimers();
    const { rerender } = render(
      <Menu mode="inline" openKeys={["root"]} items={items} inlineCollapsed />,
    );
    await act(() => vi.advanceTimersByTimeAsync(250));
    rerender(<Menu mode="inline" openKeys={["root", "nested"]} items={items} inlineCollapsed />);
    await act(() => vi.advanceTimersByTimeAsync(250));
    // Nothing is expanded while collapsed: the popup path is transient hover state.
    expect(document.querySelectorAll('.k-menu-submenu-title[aria-expanded="true"]')).toHaveLength(
      0,
    );
    rerender(<Menu mode="inline" openKeys={["root", "nested"]} items={items} />);
    await act(() => vi.advanceTimersByTimeAsync(400));
    expect(document.querySelectorAll('.k-menu-submenu-title[aria-expanded="true"]')).toHaveLength(
      2,
    );
  });
});

it("overflows individual Fragment children and restores them when space returns", async () => {
  vi.useFakeTimers();
  let resize: () => void = () => {};
  vi.stubGlobal(
    "ResizeObserver",
    class {
      constructor(callback: () => void) {
        resize = callback;
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
    this: HTMLElement,
  ) {
    return {
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: 100,
      bottom: 30,
      width: this.classList.contains("k-menu-submenu") ? 30 : 100,
      height: 30,
      toJSON() {},
    };
  });
  let width = 150;
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(() => width);
  const onSelect = vi.fn();
  const { container } = render(
    <Menu mode="horizontal" style={{ padding: 0 }} onSelect={onSelect}>
      <Fragment>
        {["a", "b", "c"].map((key) => (
          <MenuItem key={key} itemKey={key}>
            {key}
          </MenuItem>
        ))}
      </Fragment>
    </Menu>,
  );
  await act(() => vi.advanceTimersByTimeAsync(100));
  const menu = container.querySelector("ul")!;
  expect(menu.querySelectorAll(":scope > .k-menu-item")).toHaveLength(1);
  fireEvent.mouseEnter(screen.getByText("..."));
  await act(() => vi.advanceTimersByTimeAsync(100));
  fireEvent.click(screen.getByText("b"));
  expect(onSelect).toHaveBeenCalledWith({ key: "b", keyPath: [] });
  width = 400;
  act(() => resize());
  expect(menu.querySelectorAll(":scope > .k-menu-item")).toHaveLength(3);
});

describe("Menu overflow measurement", () => {
  it("renders no overflow trigger for a horizontal menu without items", () => {
    const { container } = render(<Menu mode="horizontal" items={[]} />);
    expect(container.querySelector("ul")?.childElementCount).toBe(0);
    expect(container.querySelector(".k-menu-submenu")).toBeNull();
  });
});

describe("Menu mode switching", () => {
  it("never rewrites openKeys and stays silent when the mode changes", async () => {
    const onOpenChange = vi.fn();
    const props = { items: popupItems, openKeys: ["root"], onOpenChange };
    const { rerender } = render(<Menu {...props} mode="inline" />);
    expect(document.querySelectorAll('.k-menu-submenu-title[aria-expanded="true"]')).toHaveLength(
      1,
    );

    rerender(<Menu {...props} mode="horizontal" />);
    await waitFor(() => expect(document.querySelector(".k-menu-submenu-popup")).not.toBeNull());
    expect(screen.queryByText("Leaf")).not.toBeNull();

    rerender(<Menu {...props} mode="inline" />);
    expect(document.querySelectorAll('.k-menu-submenu-title[aria-expanded="true"]')).toHaveLength(
      1,
    );
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("ignores inlineCollapsed outside inline mode", () => {
    const { container } = render(<Menu mode="horizontal" items={items} inlineCollapsed />);
    expect(container.querySelector("ul")?.className).toBe("k-menu k-menu-horizontal");
  });

  it("honors openKeys in vertical mode while inlineCollapsed is set", async () => {
    render(<Menu mode="vertical" items={popupItems} openKeys={["root"]} inlineCollapsed />);
    await waitFor(() => expect(document.querySelector(".k-menu-submenu-popup")).not.toBeNull());
    expect(screen.queryByText("Leaf")).not.toBeNull();
  });
});

describe("Menu selection and openKeys", () => {
  it("does not report closing popups while none are open", () => {
    const onOpenChange = vi.fn();
    render(<Menu mode="vertical" items={[{ key: "a", title: "A" }]} onOpenChange={onOpenChange} />);
    fireEvent.click(screen.getByText("A"));
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("reports closing the open popup when an item is selected", async () => {
    const onOpenChange = vi.fn();
    render(
      <Menu mode="vertical" items={popupItems} openKeys={["root"]} onOpenChange={onOpenChange} />,
    );
    await waitFor(() => expect(screen.queryByText("Leaf")).not.toBeNull());
    fireEvent.click(screen.getByText("Leaf"));
    expect(onOpenChange).toHaveBeenCalledWith([]);
  });
});

describe("Menu popup accessibility", () => {
  it("links an open submenu trigger to its teleported popup", async () => {
    render(<Menu mode="vertical" items={items} openKeys={["root"]} />);
    await waitFor(() => expect(document.querySelector(".k-menu-submenu-popup")).not.toBeNull());
    const title = document.querySelector<HTMLElement>(".k-menu-submenu-title")!;
    const popupList = document.querySelector<HTMLElement>(".k-menu-submenu-popup ul")!;
    expect(title.id).toBeTruthy();
    expect(title.getAttribute("aria-controls")).toBe(popupList.id);
    expect(popupList.getAttribute("aria-labelledby")).toBe(title.id);
  });

  it("leaves no dangling aria-controls on a closed submenu", () => {
    render(<Menu mode="vertical" items={items} />);
    const title = document.querySelector<HTMLElement>(".k-menu-submenu-title")!;
    expect(title.getAttribute("aria-expanded")).toBe("false");
    expect(title.hasAttribute("aria-controls")).toBe(false);
  });

  it("does not claim a plain menu item is expandable", () => {
    render(
      <Menu mode="inline">
        <MenuItem itemKey="a">A</MenuItem>
      </Menu>,
    );
    const item = screen.getByRole("menuitem");
    expect(item.hasAttribute("aria-expanded")).toBe(false);
    expect(item.hasAttribute("aria-haspopup")).toBe(false);
  });

  it("keeps grouped items linked to their parent submenu", () => {
    const onSelect = vi.fn();
    render(
      <Menu mode="inline" openKeys={["root"]} onSelect={onSelect}>
        <SubMenu itemKey="root" title="Root">
          <MenuGroup title="Group">
            <MenuItem itemKey="leaf">Leaf</MenuItem>
            <MenuDivider />
          </MenuGroup>
        </SubMenu>
      </Menu>,
    );
    fireEvent.click(screen.getByText("Leaf"));
    expect(onSelect).toHaveBeenCalledWith({ key: "leaf", keyPath: ["root"] });
    const leaf = screen.getByText("Leaf").closest("li") as HTMLElement;
    expect(leaf.style.paddingLeft).toBe("32px");
    expect(document.querySelector(".k-menu-submenu-selected")).not.toBeNull();
    expect(document.querySelector(".k-menu-item-divider")).not.toBeNull();
  });
});

describe("Menu roles and overflow observing", () => {
  it("declares menubar semantics only for horizontal menus", async () => {
    const { container, rerender } = render(
      <Menu mode="horizontal" openKeys={["root"]} items={items} />,
    );
    await waitFor(() => expect(document.querySelector(".k-menu-submenu-popup ul")).not.toBeNull());

    const root = container.querySelector("ul") as HTMLElement;
    expect(root.getAttribute("role")).toBe("menubar");
    expect(root.getAttribute("aria-orientation")).toBe("horizontal");

    const trigger = document.querySelector(".k-menu-submenu-title") as HTMLElement;
    expect(trigger.getAttribute("aria-haspopup")).toBe("menu");
    // The wrapper <li> is out of the accessibility tree; only the title div is the menu item.
    expect(trigger.parentElement?.getAttribute("role")).toBe("none");
    // A horizontal menu's submenu always stacks vertically, so it must not inherit "horizontal".
    expect(
      document.querySelector(".k-menu-submenu-popup ul")?.getAttribute("aria-orientation"),
    ).toBe("vertical");

    rerender(<Menu mode="inline" openKeys={["root"]} items={items} />);
    await waitFor(() => expect(document.querySelector(".k-menu-inline")).not.toBeNull());
    const inlineRoot = document.querySelector(".k-menu-inline") as HTMLElement;
    expect(inlineRoot.getAttribute("role")).toBe("menu");
    expect(inlineRoot.getAttribute("aria-orientation")).toBe("vertical");
  });

  it("observes the container only while the menu is horizontal", async () => {
    let observed = 0;
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe() {
          observed += 1;
        }
        disconnect() {}
      },
    );

    const { rerender } = render(<Menu mode="inline" openKeys={["root"]} items={items} />);
    await waitFor(() => expect(observed).toBe(0));

    rerender(<Menu mode="horizontal" openKeys={["root"]} items={items} />);
    await waitFor(() => expect(observed).toBe(1));

    rerender(<Menu mode="vertical" openKeys={["root"]} items={items} />);
    await waitFor(() => expect(observed).toBe(1));
  });
});

describe("Menu submenu keyboard", () => {
  it("opens a menubar submenu with ArrowDown and lands focus on its first item", async () => {
    render(<Menu mode="horizontal" items={popupItems} />);
    const trigger = document.querySelector(".k-menu-submenu-title") as HTMLElement;
    trigger.focus();

    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    await waitFor(() => expect(trigger.getAttribute("aria-expanded")).toBe("true"));
    await waitFor(() => expect(document.activeElement?.textContent).toBe("Leaf"));

    fireEvent.keyDown(document.activeElement as HTMLElement, { key: "Escape" });
    await waitFor(() => expect(trigger.getAttribute("aria-expanded")).toBe("false"));
    expect(document.activeElement).toBe(trigger);
  });

  it("expands an inline submenu with ArrowRight and lands focus on its first child", async () => {
    render(<Menu mode="inline" items={items} />);
    const trigger = document.querySelector(".k-menu-submenu-title") as HTMLElement;
    trigger.focus();

    fireEvent.keyDown(trigger, { key: "ArrowRight" });
    await waitFor(() => expect(trigger.getAttribute("aria-expanded")).toBe("true"));
    await waitFor(() => expect(document.activeElement?.textContent).toContain("Nested"));
  });

  it("unwinds only the innermost level when Escape is pressed inside a nested list", async () => {
    render(<Menu mode="inline" openKeys={["root", "nested"]} items={items} />);
    const deepTrigger = document.querySelectorAll(".k-menu-submenu-title")[1] as HTMLElement;
    deepTrigger.focus();

    fireEvent.keyDown(deepTrigger, { key: "Escape" });
    await waitFor(() => expect(deepTrigger.getAttribute("aria-expanded")).toBe("false"));
    expect(
      document.querySelectorAll(".k-menu-submenu-title")[0]?.getAttribute("aria-expanded"),
    ).toBe("true");
  });
});
