import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Poptip, Popconfirm } from "../components";

describe.each([Poptip, Popconfirm])("shared popover positioning", (Component) => {
  it("repositions on ancestor scroll and removes the listener on unmount", () => {
    const { unmount } = render(
      <Component defaultOpen title="Details">
        <button>Open</button>
      </Component>,
    );
    const measure = vi.spyOn(screen.getByRole("button", { name: "Open" }), "getBoundingClientRect");
    fireEvent.scroll(document.body);
    expect(measure).toHaveBeenCalled();
    measure.mockClear();
    unmount();
    fireEvent.scroll(document.body);
    expect(measure).not.toHaveBeenCalled();
  });
});
