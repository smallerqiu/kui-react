import { fireEvent, render, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DropdownButton } from "react-kui";

const overlay = <div>菜单内容</div>;

const getTrigger = () => document.querySelector<HTMLElement>(".k-dropdown-trigger");
const getBody = () => document.querySelector<HTMLElement>(".k-dropdown-body");
const getPanel = () => document.querySelector<HTMLElement>(".k-dropdown");

describe("DropdownButton split-button trigger", () => {
  it("opens the menu when hovering the trigger button", async () => {
    render(
      <DropdownButton overlay={overlay}>
        <span>主操作</span>
      </DropdownButton>,
    );

    expect(getBody()).toBeNull();
    fireEvent.mouseEnter(getTrigger()!);

    expect(getBody()).not.toBeNull();
    expect(getTrigger()?.getAttribute("aria-haspopup")).toBe("menu");
    expect(getTrigger()?.getAttribute("aria-expanded")).toBe("true");
    // target 锚点也要走完成定位再显形，否则用户看到的还是"点不出来"
    await waitFor(() => expect(getPanel()?.style.visibility).not.toBe("hidden"));
  });

  it("toggles the menu on click when trigger is click", () => {
    render(
      <DropdownButton trigger="click" overlay={overlay}>
        <span>主操作</span>
      </DropdownButton>,
    );

    fireEvent.click(getTrigger()!);
    expect(getBody()).not.toBeNull();
    expect(getTrigger()?.getAttribute("aria-expanded")).toBe("true");

    fireEvent.click(getTrigger()!);
    expect(getTrigger()?.getAttribute("aria-expanded")).toBe("false");
  });

  it("keeps the primary button click independent from the menu", () => {
    const onClick = vi.fn();
    render(
      <DropdownButton onClick={onClick} overlay={overlay}>
        <span>主操作</span>
      </DropdownButton>,
    );

    fireEvent.click(document.querySelectorAll("button.k-btn")[0]);

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(getBody()).toBeNull();
    expect(getTrigger()?.getAttribute("aria-expanded")).toBe("false");
  });

  it("opens with the arrow keys", () => {
    render(
      <DropdownButton overlay={overlay}>
        <span>主操作</span>
      </DropdownButton>,
    );
    fireEvent.keyDown(getTrigger()!, { key: "ArrowDown" });
    expect(getBody()).not.toBeNull();
  });

  it("does not open a disabled split button", () => {
    render(
      <DropdownButton disabled overlay={overlay}>
        <span>主操作</span>
      </DropdownButton>,
    );

    fireEvent.mouseEnter(getTrigger()!);
    fireEvent.click(getTrigger()!);

    expect(getBody()).toBeNull();
    expect(getTrigger()?.getAttribute("aria-expanded")).toBe("false");
  });
});
