import { act, fireEvent, render, cleanup } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import Menu from "../components/menu/menu";

const items = [
  {
    key: "root",
    title: "Root",
    children: [
      { key: "one", title: "item1" },
      { key: "two", title: "item2", children: [{ key: "leaf", title: "Nested leaf" }] },
      { key: "three", title: "item3" },
    ],
  },
];
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});
const title = (text: string) =>
  [...document.querySelectorAll<HTMLElement>(".k-menu-submenu-title")].find(
    (el) => el.textContent === text,
  )!;
const enter = (el: HTMLElement) =>
  fireEvent.mouseOut(el.parentElement!.previousElementSibling!, { relatedTarget: el });
const leave = (el: HTMLElement) =>
  fireEvent.mouseOut(el, { relatedTarget: el.parentElement!.nextElementSibling });
const wait = async (time: number) => {
  await act(() => vi.advanceTimersByTimeAsync(time));
};
const setup = async (extra = {}) => {
  vi.useFakeTimers();
  const onOpenChange = vi.fn();
  const result = render(
    <Menu
      mode="horizontal"
      items={items}
      openKeys={["root"]}
      onOpenChange={onOpenChange}
      {...extra}
    />,
  );
  await wait(50);
  return { ...result, onOpenChange };
};

it("does not open or emit when crossing item2 to reach item3", async () => {
  const { onOpenChange } = await setup();
  enter(title("item2"));
  await wait(100);
  leave(title("item2"));
  await wait(500);
  expect(title("item2").getAttribute("aria-expanded")).toBe("false");
  expect(document.body.textContent).not.toContain("Nested leaf");
  expect(onOpenChange).not.toHaveBeenCalled();
});
it("opens after the delay and stays open while moving into its popup", async () => {
  await setup();
  const child = title("item2");
  enter(child);
  await wait(199);
  expect(child.getAttribute("aria-expanded")).toBe("false");
  await wait(51);
  expect(child.getAttribute("aria-expanded")).toBe("true");
  leave(child);
  const leaf = [...document.querySelectorAll(".k-menu-item")].find(
    (el) => el.textContent === "Nested leaf",
  )!;
  fireEvent.mouseEnter(leaf.closest<HTMLElement>(".k-menu-submenu-popup")!);
  await wait(300);
  expect(child.getAttribute("aria-expanded")).toBe("true");
});
it("restarts the delay on re-entry and cancels pending open on disable and unmount", async () => {
  const { rerender, onOpenChange, unmount } = await setup();
  const child = title("item2");
  enter(child);
  await wait(150);
  leave(child);
  enter(child);
  await wait(100);
  expect(child.getAttribute("aria-expanded")).toBe("false");
  rerender(
    <Menu
      mode="horizontal"
      items={[{ ...items[0], children: [{ ...items[0].children[1], disabled: true }] }]}
      openKeys={["root"]}
      onOpenChange={onOpenChange}
    />,
  );
  await wait(300);
  expect(onOpenChange).not.toHaveBeenCalled();
  rerender(
    <Menu mode="horizontal" items={items} openKeys={["root"]} onOpenChange={onOpenChange} />,
  );
  enter(title("item2"));
  unmount();
  await wait(300);
  expect(onOpenChange).not.toHaveBeenCalled();
});
it("supports a zero delay and keeps keyboard opening immediate", async () => {
  await setup({ subMenuOpenDelay: 0 });
  enter(title("item2"));
  await wait(30);
  expect(title("item2").getAttribute("aria-expanded")).toBe("true");
  cleanup();
  await setup({ subMenuOpenDelay: 1000 });
  fireEvent.keyDown(title("item2"), { key: "ArrowRight" });
  await wait(30);
  expect(title("item2").getAttribute("aria-expanded")).toBe("true");
});
