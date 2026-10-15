// 3b: these four controls have always typed `theme` as seven values, but the source emitted a class
// for two of them (`fill`, `plain`) — `theme="outline"` reached the DOM as nothing at all, and LESS
// had no rule to paint either, so the preset was invisible twice over. Every supported tier now
// reaches the root as `k-<component>-<tier>`, and `theme="default"` lands on the control's own
// default (`fill`) instead of reaching no tier class and rendering the bordered base look.
// The style half is in tests/theme-variants.test.ts.
import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it } from "vitest";
import { Cascader, DatePicker, Select, TreeSelect } from "react-kui";

const TIERS = ["fill", "outline", "plain", "solid", "dashed", "underlined"] as const;

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

describe("every theme tier reaches the control root", () => {
  for (const { name, node } of CASES) {
    for (const tier of TIERS) {
      it(`${name} emits ${name}-${tier} for theme="${tier}"`, () => {
        expect(rootClasses(render(node({ theme: tier })).container, name)).toContain(
          `${name}-${tier}`,
        );
      });
    }

    it(`${name} lands on its own default tier for theme="default"`, () => {
      // "Listen to the component" for a control means `fill`, so writing `theme="default"` has to
      // reach the same classes as never writing `theme` — not the bordered base a class-less root
      // would have rendered.
      const tiers = (container: HTMLElement) =>
        rootClasses(container, name).filter((cls) => cls.startsWith(`${name}-`));
      expect(tiers(render(node({ theme: "default" })).container)).toEqual(
        tiers(render(node({})).container),
      );
    });
  }
});
