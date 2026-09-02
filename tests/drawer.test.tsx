import { render, waitFor } from "@testing-library/react";
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
  it("renders inside a ref target and restores its positioning style", async () => {
    const { getByTestId, unmount } = render(<DrawerInContainer />);
    const target = getByTestId("drawer-target");

    await waitFor(() => expect(target.querySelector(":scope > .k-drawer")).not.toBeNull());
    expect(target.style.position).toBe("relative");

    unmount();
    expect(target.style.position).toBe("");
  });
});
