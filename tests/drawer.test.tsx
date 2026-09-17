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
        <Drawer defaultOpen footer={false}>
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
