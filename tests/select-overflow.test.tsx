import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Select } from "../components";

describe("Select overflow preview", () => {
  it("uses dark theme tokens and keeps disabled tags non-removable", async () => {
    const onChange = vi.fn();
    render(
      <Select
        multiple
        disabled
        value={["apple", "pear"]}
        maxTagCount={1}
        options={[
          { label: "Apple", value: "apple" },
          { label: "Pear", value: "pear" },
        ]}
        onChange={onChange}
      />,
    );
    fireEvent.mouseEnter(screen.getByText("+1..."));
    await waitFor(() =>
      expect(document.querySelector(".k-tooltip .k-tag")?.textContent).toContain("Pear"),
    );
    const tag = document.querySelector(".k-tooltip .k-tag")!;
    expect(tag.closest('[theme-mode="dark"]')).not.toBeNull();
    expect(tag.querySelector(".k-tag-close")).toBeNull();
    fireEvent.click(tag);
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole("combobox").getAttribute("aria-expanded")).toBe("false");
  });
});
