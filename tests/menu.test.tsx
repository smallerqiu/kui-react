import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Fragment, useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Menu, MenuItem } from "../components/menu";

const items = [
  {
    key: "root",
    title: "Root",
    children: [{ key: "nested", title: "Nested", children: [{ key: "leaf", title: "Leaf" }] }],
  },
];
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
