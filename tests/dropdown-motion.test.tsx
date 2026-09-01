import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Dropdown } from "react-kui";

describe("Dropdown first-open motion", () => {
  it("keeps the popup hidden until it has been positioned", async () => {
    render(
      <Dropdown trigger="click" overlay={<div>Dropdown content</div>}>
        <button>Open dropdown</button>
      </Dropdown>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Open dropdown" }));

    const popup = document.querySelector<HTMLElement>(".k-dropdown");
    expect(popup).not.toBeNull();
    expect(popup?.style.visibility).toBe("hidden");
    expect(popup?.classList.contains("k-dropdown-enter-active")).toBe(true);

    await waitFor(() => expect(popup?.style.visibility).not.toBe("hidden"));
  });
});
