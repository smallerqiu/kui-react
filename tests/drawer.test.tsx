import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useRef } from "react";
import { describe, expect, it } from "vitest";
import { Drawer } from "react-kui";

function DrawerInContainer() {
  const target = useRef<HTMLDivElement>(null);
  return (
    <div data-testid="drawer-target" ref={target}>
      <Drawer open target={target} footer={false} mask={false}>
        Drawer content
      </Drawer>
    </div>
  );
}

describe("Drawer target", () => {
  it("waits for target resolution before opening and restores focus after closing", async () => {
    const { unmount } = render(
      <>
        <button autoFocus>Open drawer</button>
        <Drawer open footer={false}>
          Content
        </Drawer>
      </>,
    );
    try {
      expect(document.querySelector(".k-drawer")).toBeNull();
      await waitFor(() => expect(document.querySelector(".k-drawer-wrap")).not.toBeNull());
      const wrap = document.querySelector(".k-drawer-wrap");
      expect(wrap).not.toBeNull();
      await waitFor(() => expect(document.activeElement).toBe(wrap));
      fireEvent.click(document.querySelector(".k-drawer-mask")!);
      await waitFor(() =>
        expect(document.activeElement).toBe(screen.getByRole("button", { name: "Open drawer" })),
      );
    } finally {
      unmount();
    }
  });

  it("renders inside a ref target and restores its positioning style", async () => {
    const { getByTestId, unmount } = render(<DrawerInContainer />);
    const target = getByTestId("drawer-target");

    await waitFor(() => expect(target.querySelector(":scope > .k-drawer")).not.toBeNull());
    expect(target.style.position).toBe("relative");

    unmount();
    expect(target.style.position).toBe("");
  });
});

/**
 * 标题栏的有无是个谓词：不再拿写死的 "Title" 兜底（那是英文常量，也过不了国际化）。
 * Drawer 的右上角关闭按钮住在 header 里，所以只有"既没标题又不 closable"才整条不收。
 * 两个仓库断言同一件事，见 kui-vue/tests/drawer.test.ts。
 */
describe("Drawer header", () => {
  it("shows the title text", async () => {
    render(
      <Drawer open title="标题">
        内容
      </Drawer>,
    );
    await waitFor(() => expect(document.querySelector(".k-drawer-header")).not.toBeNull());
    expect(document.querySelector(".k-drawer-header-inner")?.textContent).toBe("标题");
  });

  it("keeps the bar for the close button when no title is given", async () => {
    render(<Drawer open>内容</Drawer>);
    await waitFor(() => expect(document.querySelector(".k-drawer-header")).not.toBeNull());
    // 以前这里会印出默认的 "Title"；现在标题文本是空的，X 还在。
    expect(document.querySelector(".k-drawer-header-inner")?.textContent).toBe("");
    expect(document.querySelector(".k-drawer-close")).not.toBeNull();
  });

  it("drops the header when there is neither a title nor a close button", async () => {
    render(
      <Drawer open closable={false}>
        内容
      </Drawer>,
    );
    await waitFor(() => expect(document.querySelector(".k-drawer-body")).not.toBeNull());
    expect(document.querySelector(".k-drawer-header")).toBeNull();
  });
});
