import { render } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { Popconfirm, Poptip, Tooltip } from "react-kui";

const cases: Array<{
  name: string;
  className: string;
  render: (open: boolean) => ReactNode;
}> = [
  {
    name: "Tooltip",
    className: "k-tooltip-enter-active",
    render: (open) => (
      <Tooltip open={open} title="Tooltip content">
        <button>Tooltip trigger</button>
      </Tooltip>
    ),
  },
  {
    name: "Poptip",
    className: "k-poptip-enter-active",
    render: (open) => (
      <Poptip open={open} title="Poptip title" content="Poptip content">
        <button>Poptip trigger</button>
      </Poptip>
    ),
  },
  {
    name: "Popconfirm",
    className: "k-popconfirm-enter-active",
    render: (open) => (
      <Popconfirm open={open} title="Confirm action">
        <button>Popconfirm trigger</button>
      </Popconfirm>
    ),
  },
];

describe.each(cases)("$name first-open motion", ({ className, render: renderPopup }) => {
  it("runs the enter animation when controlled open becomes true", () => {
    const { rerender } = render(renderPopup(false));

    rerender(renderPopup(true));

    expect(document.querySelector(`.${className}`)).not.toBeNull();
  });
});
