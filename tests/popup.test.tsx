import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { Popup, type PopupRef } from "../components";

describe("Popup foundation", () => {
  it("initializes from open, allows interaction, and synchronizes later prop changes", () => {
    const popup = (open: boolean) => (
      <Popup open={open} overlay="Content">
        <button>Toggle</button>
      </Popup>
    );
    const { rerender } = render(popup(true));
    const trigger = screen.getByText("Toggle");
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    fireEvent.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    rerender(popup(true));
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    rerender(popup(false));
    rerender(popup(true));
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
  });
  it("cancels a pending hover request when controlled visibility changes", () => {
    vi.useFakeTimers();
    try {
      const onOpenChange = vi.fn();
      const { rerender, unmount } = render(
        <Popup
          open={false}
          trigger="hover"
          openDelay={100}
          onOpenChange={onOpenChange}
          overlay="Content"
        >
          <button>Open</button>
        </Popup>,
      );
      fireEvent.mouseEnter(screen.getByText("Open"));
      rerender(
        <Popup open trigger="hover" openDelay={100} onOpenChange={onOpenChange} overlay="Content">
          <button>Open</button>
        </Popup>,
      );
      act(() => vi.advanceTimersByTime(200));
      expect(onOpenChange).not.toHaveBeenCalled();
      unmount();
    } finally {
      vi.useRealTimers();
    }
  });
  it("closes retained child portals when the controlled parent closes", async () => {
    const onChildChange = vi.fn();
    const overlay = (
      <Popup open onOpenChange={onChildChange} overlay="Child content">
        <button>Child</button>
      </Popup>
    );
    const { rerender } = render(
      <Popup open overlay={overlay}>
        <button>Parent</button>
      </Popup>,
    );
    await screen.findByRole("button", { name: "Child" });
    rerender(
      <Popup open={false} overlay={overlay}>
        <button>Parent</button>
      </Popup>,
    );
    expect(onChildChange).toHaveBeenCalledWith(false, { reason: "host" });
  });
  it("keeps generic overlay controls independent of menu behavior", async () => {
    render(
      <Popup overlay={<input aria-label="Search" />}>
        <button>Open</button>
      </Popup>,
    );
    const trigger = screen.getByText("Open");
    expect(trigger.hasAttribute("aria-haspopup")).toBe(false);
    fireEvent.click(trigger);
    const input = await screen.findByRole("textbox");
    fireEvent.click(input);
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    fireEvent.click(document.body);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  it("updates visibility and reports typed reasons when open is provided", () => {
    const onOpenChange = vi.fn();
    render(
      <Popup open={false} onOpenChange={onOpenChange} overlay="Content">
        <button>Open</button>
      </Popup>,
    );
    fireEvent.click(screen.getByText("Open"));
    expect(onOpenChange).toHaveBeenCalledWith(
      true,
      expect.objectContaining({ reason: "trigger", event: expect.any(Event) }),
    );
    expect(screen.getByText("Open").getAttribute("aria-expanded")).toBe("true");
  });

  it("supports imperative manual triggers and preserves the original ref", async () => {
    const api = createRef<PopupRef>();
    const button = createRef<HTMLButtonElement>();
    render(
      <Popup ref={api} trigger="manual" arrow matchTriggerWidth overlay="Content">
        <button ref={button}>Open</button>
      </Popup>,
    );
    fireEvent.click(button.current!);
    expect(screen.queryByText("Content")).toBeNull();
    act(() => api.current!.open());
    await waitFor(() =>
      expect(api.current!.getPopupElement()?.style.visibility).not.toBe("hidden"),
    );
    expect(api.current!.getTriggerElement()).toBe(button.current);
    expect(document.querySelector(".k-popup-arrow")).not.toBeNull();
  });

  it("keeps parent open on child portal clicks and closes only the top layer on Escape", async () => {
    const outer = vi.fn(),
      inner = vi.fn();
    render(
      <Popup
        onOpenChange={outer}
        overlay={
          <Popup onOpenChange={inner} overlay={<button>Inside</button>}>
            <button>Child</button>
          </Popup>
        }
      >
        <button>Parent</button>
      </Popup>,
    );
    fireEvent.click(screen.getByText("Parent"));
    fireEvent.click(await screen.findByRole("button", { name: "Child" }));
    fireEvent.click(await screen.findByRole("button", { name: "Inside" }));
    expect(outer).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(inner).toHaveBeenLastCalledWith(false, expect.objectContaining({ reason: "escape" }));
    expect(outer).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(outer).toHaveBeenLastCalledWith(false, expect.objectContaining({ reason: "escape" }));
  });

  it("retains input state by default and destroys only after leave when requested", async () => {
    const { rerender } = render(
      <Popup overlay={<input defaultValue="Initial" />}>
        <button>Open</button>
      </Popup>,
    );
    fireEvent.click(screen.getByText("Open"));
    const input = await screen.findByRole("textbox");
    fireEvent.change(input, { target: { value: "Edited" } });
    fireEvent.click(document.body);
    // Closing must animate visibly rather than hiding the node before its leave transition.
    expect((document.querySelector(".k-popup") as HTMLElement).style.visibility).not.toBe("hidden");
    await waitFor(() =>
      expect((document.querySelector(".k-popup") as HTMLElement).style.display).toBe("none"),
    );
    fireEvent.click(screen.getByText("Open"));
    expect(await screen.findByDisplayValue("Edited")).toBe(input);
    rerender(
      <Popup destroyOnClose overlay={<input defaultValue="Initial" />}>
        <button>Open</button>
      </Popup>,
    );
    fireEvent.click(document.body);
    expect(document.querySelector(".k-popup")).not.toBeNull();
    await waitFor(() => expect(document.querySelector(".k-popup")).toBeNull());
  });

  it("cancels delayed opening when disabled", () => {
    vi.useFakeTimers();
    try {
      const onOpenChange = vi.fn();
      const { rerender, unmount } = render(
        <Popup trigger="hover" openDelay={100} onOpenChange={onOpenChange} overlay="Content">
          <button>Open</button>
        </Popup>,
      );
      fireEvent.mouseEnter(screen.getByText("Open"));
      rerender(
        <Popup
          disabled
          trigger="hover"
          openDelay={100}
          onOpenChange={onOpenChange}
          overlay="Content"
        >
          <button>Open</button>
        </Popup>,
      );
      act(() => vi.advanceTimersByTime(200));
      expect(onOpenChange).not.toHaveBeenCalled();
      unmount();
    } finally {
      vi.useRealTimers();
    }
  });

  it("keeps focus inside the overlay and respects a cancelled trigger", async () => {
    render(
      <Popup trigger="focus" overlay={<input aria-label="Editor" />}>
        <button>Open</button>
      </Popup>,
    );
    const trigger = screen.getByText("Open");
    fireEvent.focus(trigger);
    const input = await screen.findByRole("textbox");
    fireEvent.blur(trigger, { relatedTarget: input });
    fireEvent.focus(input);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    render(
      <Popup overlay="Blocked">
        <button onClick={(event) => event.preventDefault()}>Cancelled</button>
      </Popup>,
    );
    fireEvent.click(screen.getByText("Cancelled"));
    expect(screen.queryByText("Blocked")).toBeNull();
  });
});
