import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import { ColorPicker } from "../components";

it.each(["click", "hover"] as const)(
  "keeps the %s color panel open when selecting HEX, RGB or HSL from its portalled mode selector",
  async (triggerMode) => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const onUpdateMode = vi.fn();
    render(
      <ColorPicker trigger={triggerMode} onOpenChange={onOpenChange} onUpdateMode={onUpdateMode} />,
    );
    const trigger = screen.getByRole("combobox");
    await user.click(trigger);
    await waitFor(() =>
      expect(
        document.querySelector<HTMLElement>(".k-color-picker-dropdown")?.style.visibility,
      ).not.toBe("hidden"),
    );
    onOpenChange.mockClear();
    for (const mode of ["HEX", "RGB", "HSL", "HEX"]) {
      await user.click(document.querySelector<HTMLElement>(".k-color-picker-mode .k-select")!);
      const option = await screen.findByText(mode, { selector: ".k-select-item span" });
      await user.click(option);
      expect(onUpdateMode).toHaveBeenLastCalledWith(mode.toLowerCase());
      expect(trigger.getAttribute("aria-expanded")).toBe("true");
      expect(onOpenChange).not.toHaveBeenCalledWith(false);
      await waitFor(() => expect(document.querySelector(".k-select-dropdown")).toBeNull());
    }
    onOpenChange.mockClear();
    await user.click(document.body);
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
  },
);
