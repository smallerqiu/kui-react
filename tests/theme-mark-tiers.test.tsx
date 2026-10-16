// 3c-乙a: `Tag` is the opposite case to `Button` (tests/theme-action-tiers) — its own default look *is*
// a tier class, `fill`, so a tag carries exactly one tier whatever it is handed. The source used to emit
// `k-tag-${theme}` for any value it received, so `theme="default"` shipped `k-tag-default` and
// `theme="outline" / "solid" / "dashed"` shipped classes that no LESS rule answered: a chip inside
// `<Select multiple theme="solid">` was unthemed twice over, and the tier the control forwarded to its
// chips had nowhere to land. Now the five tiers the stylesheet paints all reach the root, and anything
// else — `default`, and `underlined`, which only means something on a box you type into (theme 口径
// §五.1) — lands on `fill`. The style half is in tests/theme-variants.test.ts and scripts/check-theme.ts.
import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it } from "vitest";
import ConfigProvider from "../components/config";
import { Select, Tag } from "react-kui";

// The seven values `theme` is typed as, and the five `tag/styles/index.less` paints.
const TIERS = ["default", "fill", "outline", "plain", "solid", "dashed", "underlined"] as const;
const PAINTED = ["fill", "outline", "plain", "solid", "dashed"] as const;
const UNSUPPORTED = ["default", "underlined"] as const;

const PRESETS = ["red", "blue"] as const;

const tagClasses = (node: ReactElement) =>
  Array.from(render(node).container.querySelector(".k-tag")?.classList ?? []);

// Only the seven tier spellings count: `k-tag-sm`, `k-tag-circle` and `k-tag-compact` are size, shape
// and density, and `k-tag-red` is a colour that shares the prefix.
const tierClasses = (classes: string[]) =>
  classes.filter((cls) => TIERS.some((tier) => cls === `k-tag-${tier}`));

const ordered = (classes: string[]) => [...classes].sort();

describe("a tag always carries exactly one painted tier", () => {
  for (const tier of PAINTED) {
    it(`theme="${tier}" reaches k-tag-${tier}`, () => {
      expect(tierClasses(tagClasses(<Tag theme={tier}>Tag</Tag>))).toEqual([`k-tag-${tier}`]);
    });
  }

  for (const tier of UNSUPPORTED) {
    it(`theme="${tier}" lands on the tier a tag reaches with no theme at all`, () => {
      // Unlike Button, a tag has a default tier to answer with: `default` means "listen to the
      // component", and the component's answer is `fill`. `k-tag-default` was the dead class this
      // guard exists to end, and `k-tag-underlined` has no rule because a chip has no caret.
      expect(tagClasses(<Tag theme={tier}>Tag</Tag>)).toEqual(tagClasses(<Tag>Tag</Tag>));
      expect(tierClasses(tagClasses(<Tag theme={tier}>Tag</Tag>))).toEqual(["k-tag-fill"]);
    });
  }

  it("keeps one tier next to a size, a shape and a density", () => {
    for (const tier of PAINTED)
      expect(
        tierClasses(
          tagClasses(
            <Tag size="large" shape="square" compact theme={tier}>
              Tag
            </Tag>,
          ),
        ),
      ).toEqual([`k-tag-${tier}`]);
  });
});

describe("a colour and a tier reach the root together", () => {
  // The cascade, not the class list, decides the winner: `.k-tag.k-tag-<colour>` and
  // `.k-tag.k-tag-has-color` are declared after the tiers, so `color` keeps its hue and its own edge
  // while `theme` still describes the surface for anything that has no colour. Dropping the tier here
  // would have been the cheap fix and would have broken `theme` on the documented preset palette.
  for (const color of PRESETS)
    for (const tier of PAINTED) {
      it(`color="${color}" with theme="${tier}" keeps both classes`, () => {
        const classes = tagClasses(
          <Tag color={color} theme={tier}>
            Tag
          </Tag>,
        );
        expect(classes).toContain(`k-tag-${color}`);
        expect(tierClasses(classes)).toEqual([`k-tag-${tier}`]);
      });
    }

  it('a custom colour with theme="outline" keeps its own flat edge', () => {
    const classes = tagClasses(
      <Tag color="#123456" theme="outline">
        Tag
      </Tag>,
    );
    expect(classes).toContain("k-tag-has-color");
    expect(tierClasses(classes)).toEqual(["k-tag-outline"]);
  });
});

describe("an inherited tier goes through the same guard", () => {
  // The guard sits after inheritance, not only on the written prop: a `ConfigProvider` that asks for a
  // tier Tag does not paint has to reach the same DOM as a provider that asks for nothing.
  const withProvider = (tier?: (typeof TIERS)[number]) =>
    render(
      <ConfigProvider theme={tier}>
        <Tag className="target">Tag</Tag>
      </ConfigProvider>,
    ).container.querySelector(".target");

  for (const tier of UNSUPPORTED) {
    it(`ConfigProvider theme="${tier}" lands the tag on fill`, () => {
      const without = withProvider();
      expect(Array.from(withProvider(tier)?.classList ?? [])).toEqual(
        Array.from(without?.classList ?? []),
      );
      expect(tierClasses(Array.from(withProvider(tier)?.classList ?? []))).toEqual(["k-tag-fill"]);
    });
  }

  it("a painted tier still comes down from the provider", () => {
    expect(tierClasses(Array.from(withProvider("dashed")?.classList ?? []))).toEqual([
      "k-tag-dashed",
    ]);
  });

  it("an explicit prop still beats the provider", () => {
    expect(
      tierClasses(
        Array.from(
          render(
            <ConfigProvider theme="outline">
              <Tag className="target" theme="plain">
                Tag
              </Tag>
            </ConfigProvider>,
          ).container.querySelector(".target")?.classList ?? [],
        ),
      ),
    ).toEqual(["k-tag-plain"]);
  });
});

// The control side of the hand-off: `Select` / `TreeSelect` pass their tier to the chips they render
// (`components/utils/selection-tags.tsx`), which is what makes a `theme="solid"` select paint its chips
// with the primary it fills with. The pins in `select/styles/index.less` and
// `tree-select/styles/index.less` are what keep that from becoming an invisible chip, and the pixels are
// in scripts/check-theme.ts — this is the half that proves the tier actually reaches the chip at all.
describe("a multiple control hands its tier to the chips it renders", () => {
  const chipClasses = (props: Record<string, unknown>) =>
    Array.from(
      render(
        <Select
          options={[{ label: "Apple", value: "apple" }]}
          multiple
          value={["apple"]}
          {...props}
        />,
      ).container.querySelectorAll(".k-select .k-tag"),
    ).map((node) => Array.from(node.classList));

  for (const tier of PAINTED) {
    it(`theme="${tier}" reaches every chip as k-tag-${tier}`, () => {
      const chips = chipClasses({ theme: tier });
      expect(chips.length, "a multiple select must render chips").toBeGreaterThan(0);
      for (const classes of chips)
        expect(classes, `a chip inside a ${tier} select must carry its tier`).toContain(
          `k-tag-${tier}`,
        );
    });
  }

  it("an unsupported tier reaches the chips as fill, the same as a bare select", () => {
    const bare = chipClasses({});
    for (const tier of UNSUPPORTED) {
      const chips = chipClasses({ theme: tier });
      expect(chips.length, `a ${tier} select must render the same chips`).toBe(bare.length);
      for (const [index, classes] of chips.entries())
        expect(ordered(classes), `chip ${index} of a ${tier} select`).toEqual(ordered(bare[index]));
    }
  });
});
