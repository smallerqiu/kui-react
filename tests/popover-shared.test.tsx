import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Poptip, Popconfirm } from "../components";

describe.each([Poptip, Popconfirm])("shared popover positioning", (Component) => {
  it("repositions on ancestor scroll and removes the listener on unmount", async () => {
    const { unmount } = render(
      <Component open title="Details">
        <button>Open</button>
      </Component>,
    );
    const measure = vi.spyOn(screen.getByRole("button", { name: "Open" }), "getBoundingClientRect");
    fireEvent.scroll(document.body);
    await waitFor(() => expect(measure).toHaveBeenCalled());
    measure.mockClear();
    unmount();
    fireEvent.scroll(document.body);
    expect(measure).not.toHaveBeenCalled();
  });
});
