import fs from "node:fs/promises";
import path from "node:path";
import { render } from "@testing-library/react";
import less from "less";
import { Form, FormItem, Input } from "react-kui";
import { describe, expect, it } from "vitest";

// A vertical form stacks the label column and the control column inside the item's own `Row`, which
// defaults to `k-row-top` — `align-items: flex-start`. In a column-direction flex row that is the
// *cross* axis, so both columns shrink-wrap to their content: `.k-col`'s `flex: 1` only grows the
// main axis, and a `block` control measures 100% of a box that was never given a width. Fields of
// one form then end at different x positions. Stretching the columns is what makes `block` mean
// "fill the row" here; an explicit `span` still wins, because stretch only sizes an `auto` cross size.
const formCss = async () => {
  const filename = path.resolve(import.meta.dirname, "../components/form/styles/index.less");
  const { css } = await less.render(await fs.readFile(filename, "utf8"), { filename });
  // The prose also names these classes, so strip comments before looking for rules.
  return css.replace(/\/\*[\s\S]*?\*\//g, "");
};

const stretchedColumns = (css: string) =>
  [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
    .map(([, selector, body]) => ({
      selector: selector.trim().replace(/\s+/g, " "),
      body: body.replace(/\s+/g, ""),
    }))
    .filter(
      (rule) =>
        /\.k-form-vertical \.k-form-item > \.k-col$/.test(rule.selector) &&
        rule.body.includes("align-self:stretch"),
    );

describe("Vertical form column width", () => {
  it("stretches the columns of a stacked item instead of shrink-wrapping them", async () => {
    expect(stretchedColumns(await formCss())).toHaveLength(1);
  });

  it("keeps the premise the rule answers to", () => {
    const { container } = render(
      <Form layout="vertical">
        <FormItem label="Name">
          <Input />
        </FormItem>
      </Form>,
    );
    const row = container.querySelector(".k-form-item")!;
    // The item is a row that starts its cross axis at `flex-start`; without that, the rule has
    // nothing to override and this file needs re-reading, not re-running.
    expect(row.classList.contains("k-row-top")).toBe(true);
    // The columns the rule targets are direct children of the row: an extra wrapper between the
    // row and the column would silently make the rule dead CSS.
    const columns = row.querySelectorAll(":scope > .k-col");
    expect(columns).toHaveLength(2);
    const content = container.querySelector(".k-form-item-content")!;
    expect(content.closest(".k-col")?.parentElement).toBe(row);
  });
});
