// Audit ⑪: `theme="plain"` used to be answered with `k-<component>-borderless`, so the components
// had no way to say "no border *and* no surface" apart from "no border", and their own
// `.k-<component>-plain` LESS rules could never be matched. The two are now separate classes.
// The style half of this contract is in tests/theme-variants.test.ts.
import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";
import { Cascader, DatePicker, QRCode, Select, TreeSelect } from "react-kui";
// `QRCode` paints into a canvas the moment it mounts, and jsdom hands back no 2d context; these cases
// only read the class list, so the encoder is stubbed instead of left to throw inside the component's
// own `try`.
vi.mock("qrcode", () => ({ toCanvas: vi.fn(async () => {}) }));

// Each of these controls has its own default tier — the four controls are `fill`, a code is `outline` —
// so the split is guarded against folding the theme class away, not against one library-wide default.
const CASES: {
  name: string;
  fallback: string;
  node: (props: Record<string, unknown>) => ReactElement;
}[] = [
  { name: "k-datepicker", fallback: "fill", node: (props) => <DatePicker {...props} /> },
  {
    name: "k-select",
    fallback: "fill",
    node: (props) => <Select options={[{ label: "Apple", value: "apple" }]} {...props} />,
  },
  {
    name: "k-cascader",
    fallback: "fill",
    node: (props) => <Cascader options={[{ label: "Apple", value: "apple" }]} {...props} />,
  },
  {
    name: "k-tree-select",
    fallback: "fill",
    node: (props) => <TreeSelect treeData={[{ key: "apple", title: "Apple" }]} {...props} />,
  },
  // 3c-丁b: a code carried the same fold — `bordered={false}` and `theme="plain"` both answered with one
  // `.k-qrcode-plain, .k-qrcode-borderless` rule that deleted the border *and* the 12px ring, so asking
  // for a plain surface quietly cropped the box while a cropped box still kept a 1px edge.
  {
    name: "k-qrcode",
    fallback: "outline",
    node: (props) => <QRCode value="https://example.com" {...props} />,
  },
];

const rootClasses = (container: HTMLElement, name: string) =>
  Array.from(container.querySelector("." + name)?.classList ?? []);

describe("theme=plain and bordered=false are separate classes", () => {
  for (const { name, node, fallback } of CASES) {
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

    it(`${name} still emits ${name}-${fallback} for the default theme`, () => {
      // Guards the split against the other fold these components had: the theme class has to stay
      // on its own, and the component's own tier remains the default.
      expect(rootClasses(render(node({})).container, name)).toContain(`${name}-${fallback}`);
    });
  }
});
