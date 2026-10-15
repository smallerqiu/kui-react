// 3b: these controls have always typed `theme` as seven values, but the source emitted a class for
// two of them (`fill`, `plain`) — `theme="outline"` reached the DOM as nothing at all, and LESS had
// no rule to paint either, so the preset was invisible twice over. Every supported tier now reaches
// the root as `k-<component>-<tier>`, and `theme="default"` lands on the component's own default
// (`fill`) instead of reaching no tier class and rendering the bordered base look.
// The input family is the same contract on the three elements a tier class can land on: the bare
// `<input>`, the wrapper that replaces it once anything decorates the field, and `<textarea>`.
// The style half is in tests/theme-variants.test.ts.
import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it } from "vitest";
import {
  Cascader,
  DatePicker,
  Input,
  InputNumber,
  InputOTP,
  InputTag,
  Select,
  TextArea,
  TreeSelect,
} from "react-kui";

const TIERS = ["fill", "outline", "plain", "solid", "dashed", "underlined"] as const;

const CASES: {
  name: string;
  // Two shapes share a class name, so the test titles need something finer than the name.
  label?: string;
  tag?: string;
  attribute?: string;
  node: (props: Record<string, unknown>) => ReactElement;
}[] = [
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
  {
    // `clearable` defaults to true, so a bare `<Input>` is the wrapper shape and the element that
    // carries only `data-single` needs the chrome switched off.
    name: "k-input",
    label: "k-input[data-single]",
    tag: "INPUT",
    attribute: "data-single",
    node: (props) => <Input clearable={false} {...props} />,
  },
  {
    name: "k-input",
    label: "k-input[data-multiple]",
    tag: "DIV",
    attribute: "data-multiple",
    node: (props) => <Input {...props} />,
  },
  {
    name: "k-textarea",
    tag: "TEXTAREA",
    node: (props) => <TextArea {...props} />,
  },
  {
    name: "k-input-number",
    label: "k-input-number[data-multiple]",
    tag: "DIV",
    attribute: "data-multiple",
    node: (props) => <InputNumber {...props} />,
  },
  // 3b-乙2: these two carry the tier on their own root. A tag box paints it on that wrapper, an OTP
  // group paints it on every cell inside, so the emission contract is the same even though the
  // element the paint lands on is not (`tests/theme-variants.test.ts` reads the compiled rules).
  { name: "k-input-tag", tag: "DIV", node: (props) => <InputTag {...props} /> },
  { name: "k-input-otp", tag: "DIV", node: (props) => <InputOTP {...props} /> },
];

const root = (container: HTMLElement, name: string) => container.querySelector("." + name);

const rootClasses = (container: HTMLElement, name: string) =>
  Array.from(root(container, name)?.classList ?? []);

describe("every theme tier reaches the control root", () => {
  for (const { name, label = name, tag, attribute, node } of CASES) {
    for (const tier of TIERS) {
      it(`${label} emits ${name}-${tier} for theme="${tier}"`, () => {
        expect(rootClasses(render(node({ theme: tier })).container, name)).toContain(
          `${name}-${tier}`,
        );
      });
    }

    it(`${label} lands on its own default tier for theme="default"`, () => {
      // "Listen to the component" for a control means `fill`, so writing `theme="default"` has to
      // reach the same classes as never writing `theme` — not the bordered base a class-less root
      // would have rendered.
      const tiers = (container: HTMLElement) =>
        rootClasses(container, name).filter((cls) => cls.startsWith(`${name}-`));
      expect(tiers(render(node({ theme: "default" })).container)).toEqual(
        tiers(render(node({})).container),
      );
      // Two renders that both land on a dead class agree with each other just as well, so the tier
      // `default` resolves to is named here: the control's own `fill`, never a `k-*-default` no LESS
      // can answer (`.kui-theme-value()` has no `default` arm on purpose).
      const emitted = tiers(render(node({ theme: "default" })).container);
      expect(emitted, `${label} ships a tier class nothing paints`).not.toContain(
        `${name}-default`,
      );
      expect(emitted, `${label} default does not land on its own fill tier`).toContain(
        `${name}-fill`,
      );
    });

    // The tier has to reach the element the LESS block targets, so which of the box shapes is being
    // rendered is part of the contract, not an implementation detail.
    if (tag)
      it(`${label} puts the tier on the ${tag} the style half expects`, () => {
        const element = root(render(node({ theme: "solid" })).container, name);
        expect(element?.tagName).toBe(tag);
        if (attribute) expect(element?.hasAttribute(attribute)).toBe(true);
      });
  }
});
