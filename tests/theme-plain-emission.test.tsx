// Audit ⑪: `theme="plain"` used to be answered with `k-<component>-borderless`, so the components
// had no way to say "no border *and* no surface" apart from "no border", and their own
// `.k-<component>-plain` LESS rules could never be matched. The two are now separate classes.
// The style half of this contract is in tests/theme-variants.test.ts.
import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it } from "vitest";
import { Cascader, DatePicker, Select, TreeSelect } from "react-kui";

const CASES: { name: string; node: (props: Record<string, unknown>) => ReactElement }[] = [
  { name: "k-datepicker", node: (props) => <DatePicker {...props} /> },
  {
    name: "k-select",
    node: (props) => <Select options={[{ label: "Apple", value: "apple" }]} {...props} />,
  },
  {
    name: "k-cascader",
    node: (props) => <Cascader options={[{ label: "Apple", value: "apple" }]} {...props} />,
  },
  {
    name: "k-tree-select",
    node: (props) => <TreeSelect treeData={[{ key: "apple", title: "Apple" }]} {...props} />,
  },
];

const rootClasses = (container: HTMLElement, name: string) =>
  Array.from(container.querySelector("." + name)?.classList ?? []);

describe("theme=plain and bordered=false are separate classes", () => {
  for (const { name, node } of CASES) {
    it(`${name} emits ${name}-plain without borrowing ${name}-borderless`, () => {
      const plain = rootClasses(render(node({ theme: "plain" })).container, name);
      expect(plain).toContain(`${name}-plain`);
      expect(plain, `${name} must not alias plain onto borderless`).not.toContain(
        `${name}-borderless`,
      );
    });

    it(`${name} keeps ${name}-borderless for bordered={false} alone`, () => {
      const borderless = rootClasses(render(node({ bordered: false })).container, name);
      expect(borderless).toContain(`${name}-borderless`);
      expect(borderless, `${name} must not paint plain for a borderless box`).not.toContain(
        `${name}-plain`,
      );
    });

    it(`${name} emits both when the two asks are combined`, () => {
      const both = rootClasses(render(node({ theme: "plain", bordered: false })).container, name);
      expect(both).toEqual(expect.arrayContaining([`${name}-plain`, `${name}-borderless`]));
    });

    it(`${name} still emits ${name}-fill for the default theme`, () => {
      // Guards the split against the other fold these components had: the theme class has to stay
      // on its own, and `fill` remains the control default.
      expect(rootClasses(render(node({})).container, name)).toContain(`${name}-fill`);
    });
  }
});
