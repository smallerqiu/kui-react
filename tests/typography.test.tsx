import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TypographyParagraph } from "react-kui";

describe("Typography Vue parity", () => {
  it("keeps edited text in uncontrolled mode", () => {
    const onChange = vi.fn();
    render(<TypographyParagraph defaultValue="Before" editable onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    const editor = screen.getByRole("textbox");
    fireEvent.change(editor, { target: { value: "After" } });
    fireEvent.keyDown(editor, { key: "Enter" });

    expect(screen.getByText("After")).not.toBeNull();
    expect(onChange).toHaveBeenLastCalledWith("After");
  });

  it("renders configured edit, copy, and ellipsis tooltips", async () => {
    render(
      <TypographyParagraph
        editable={{ tooltip: "Edit text" }}
        copyable={{ tooltip: "Copy text", copiedTooltip: "Copied" }}
        ellipsis={{ tooltip: "Full text" }}
      >
        Content
      </TypographyParagraph>,
    );

    fireEvent.mouseEnter(screen.getByRole("button", { name: "Edit" }));
    expect(await screen.findByText("Edit text")).not.toBeNull();
    fireEvent.mouseEnter(screen.getByRole("button", { name: "Copy" }));
    expect(await screen.findByText("Copy text")).not.toBeNull();
    fireEvent.mouseEnter(screen.getByText("Content"));
    expect(await screen.findByText("Full text")).not.toBeNull();
  });

  it("extracts readable text from nested children when copying", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    const onCopy = vi.fn();
    render(
      <TypographyParagraph copyable onCopy={onCopy}>
        Install <strong>react-kui</strong>
      </TypographyParagraph>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Copy" }));
    await vi.waitFor(() => expect(writeText).toHaveBeenCalledWith("Install react-kui"));
    expect(onCopy).toHaveBeenCalledWith("Install react-kui");
  });
});
