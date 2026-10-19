// `Tag` is the opposite case to `Button` (tests/theme-action-tiers) — its own default look *is*
// a tier class, `fill`, so a tag carries exactly one tier whatever it is handed. That is only true
// because the class list is filtered: emitting `k-tag-${theme}` for whatever the prop receives ships
// `theme="outline" / "solid" / "dashed"` as classes no LESS rule answers, which leaves a chip inside
// `<Select multiple theme="solid">` unthemed twice over and gives the tier the control forwards to its
// chips nowhere to land. So the five tiers the stylesheet paints reach the root, and anything it
// cannot paint — `underlined`, which only means something on a box you type into — lands on `fill`.
// The style half is in tests/theme-variants.test.ts and scripts/check-theme.ts.
import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it } from "vitest";
import ConfigProvider from "../components/config";
import type { MarkThemeType, SizeType, SurfaceThemeType, ThemeType } from "react-kui";
import { Checkbox, CheckboxGroup, Radio, RadioButton, RadioGroup, Select, Tag } from "react-kui";

// The six values `theme` is typed as, and the five `tag/styles/index.less` paints.
const TIERS = ["fill", "outline", "plain", "solid", "dashed", "underlined"] as const;
const PAINTED = ["fill", "outline", "plain", "solid", "dashed"] as const;
const UNSUPPORTED = ["underlined"] as const;

// `Tag.theme` is typed as the five tiers a chip paints, so TypeScript stops a caller writing
// `underlined` on one. The guard still answers it — a JavaScript caller or a `ConfigProvider` tier can —
// and this helper is how the cases below reach it.
const writeThroughGuard = (tier: ThemeType): SurfaceThemeType => tier as SurfaceThemeType;

const PRESETS = ["red", "blue"] as const;

const tagClasses = (node: ReactElement) =>
  Array.from(render(node).container.querySelector(".k-tag")?.classList ?? []);

// Only the six tier spellings count: `k-tag-sm`, `k-tag-circle` and `k-tag-compact` are size, shape
// and density, `k-tag-red` is a colour that shares the prefix, and `k-tag-default` is a colour too —
// which is the same collision `Button` had with `type="default"`.
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
      // Unlike Button, a tag has a default tier to answer with, and that answer is `fill`.
      // `k-tag-underlined` has no rule because a chip has no caret, so the guard resolves it to the
      // tier the stylesheet does paint.
      expect(tagClasses(<Tag theme={writeThroughGuard(tier)}>Tag</Tag>)).toEqual(
        tagClasses(<Tag>Tag</Tag>),
      );
      expect(tierClasses(tagClasses(<Tag theme={writeThroughGuard(tier)}>Tag</Tag>))).toEqual([
        "k-tag-fill",
      ]);
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

// the other two marks. A check box and a radio have two looks, not five — a shallow filled box
// and a bordered one — and their default is `fill`, so they take the same guard as `Tag` with a shorter
// painted list (`components/checkbox/checkbox.tsx`, `components/radio/radio.tsx`). The case this half
// locks is the easy one to get wrong: if `theme="outline"` shipped no class at all the box would fall
// back to the base border, with no way for `--kui-theme-outline-border` to reach it. The style half is
// `tests/theme-variants.test.ts` and `scripts/check-theme.ts`.
const MARK_PAINTED = ["fill", "outline"] as const;
const MARK_UNPAINTED = ["plain", "solid", "dashed", "underlined"] as const;

const MARKS: {
  name: string;
  // The element the LESS tier block paints, which is not the root: the root is the `<label>`.
  symbol: string;
  node: (props: Record<string, unknown>) => ReactElement;
}[] = [
  { name: "k-checkbox", symbol: "k-checkbox-symbol", node: (props) => <Checkbox {...props} /> },
  {
    name: "k-radio",
    symbol: "k-radio-symbol",
    node: (props) => (
      <Radio value="apple" {...props}>
        Apple
      </Radio>
    ),
  },
];

const markClasses = (node: ReactElement, name: string) =>
  Array.from(render(node).container.querySelector("." + name)?.classList ?? []);

// Only the tier spellings count: `k-checkbox-sm`, `k-checkbox-checked` and `k-checkbox-disabled` are
// size and state, and `k-checkbox-group` is the wrapper's own class.
const markTiers = (classes: string[], name: string) =>
  classes.filter((cls) => [...MARK_PAINTED, ...MARK_UNPAINTED].some((t) => cls === `${name}-${t}`));

describe("a check box and a radio carry one of the two tiers they paint", () => {
  for (const { name, symbol, node } of MARKS) {
    for (const tier of MARK_PAINTED) {
      it(`${name} emits ${name}-${tier} for theme="${tier}"`, () => {
        expect(markTiers(markClasses(node({ theme: tier }), name), name)).toEqual([
          `${name}-${tier}`,
        ]);
      });
    }

    for (const tier of MARK_UNPAINTED) {
      it(`${name} lands on fill for theme="${tier}"`, () => {
        // A tier the box cannot paint has to land on the look a bare box already has, so both halves
        // are named: two renders that both land on a class no LESS paints would still agree with each
        // other, and only the explicit `-fill` says the guard resolved it.
        const classes = markClasses(node({ theme: tier }), name);
        expect(ordered(classes), `theme="${tier}" is not the look of a bare ${name}`).toEqual(
          ordered(markClasses(node({}), name)),
        );
        expect(markTiers(classes, name), `${name} ships a tier class nothing paints`).toEqual([
          `${name}-fill`,
        ]);
      });
    }

    it(`${name} puts its tier on the label the symbol block expects`, () => {
      const { container } = render(node({ theme: "outline" }));
      const root = container.querySelector("." + name);
      expect(root?.tagName).toBe("LABEL");
      expect(
        root?.querySelector("." + symbol),
        `${symbol} is the element the ${name}-outline rule paints`,
      ).toBeTruthy();
    });

    it(`${name} keeps one tier next to a checked and a disabled state`, () => {
      for (const tier of MARK_PAINTED) {
        expect(
          markTiers(markClasses(node({ theme: tier, checked: true, disabled: true }), name), name),
        ).toEqual([`${name}-${tier}`]);
      }
    });
  }
});

// The tier can also arrive from a group or a provider, and the guard sits after that inheritance: a
// `CheckboxGroup theme="solid"` has to reach the same boxes as one that asks for nothing.
describe("a group hands its tier to the boxes it renders", () => {
  const groups: {
    name: string;
    group: (props: Record<string, unknown>) => ReactElement;
  }[] = [
    {
      name: "k-checkbox",
      group: (props) => (
        <CheckboxGroup {...props}>
          <Checkbox value="a" label="A" />
          <Checkbox value="b" label="B" />
        </CheckboxGroup>
      ),
    },
    {
      name: "k-radio",
      group: (props) => (
        <RadioGroup {...props}>
          <Radio value="a" label="A" />
          <Radio value="b" label="B" />
        </RadioGroup>
      ),
    },
  ];

  for (const { name, group } of groups) {
    const boxes = (props: Record<string, unknown>) =>
      Array.from(render(group(props)).container.querySelectorAll("." + name)).map((node) =>
        Array.from(node.classList),
      );

    for (const tier of MARK_PAINTED) {
      it(`${name} group theme="${tier}" reaches every box`, () => {
        const list = boxes({ theme: tier });
        expect(list.length, "a group must render its boxes").toBeGreaterThan(0);
        for (const classes of list) expect(classes).toContain(`${name}-${tier}`);
      });
    }

    it(`${name} group lands an unpainted tier on fill, the same as a bare group`, () => {
      const bare = boxes({});
      for (const tier of MARK_UNPAINTED) {
        const list = boxes({ theme: tier });
        expect(list.length).toBe(bare.length);
        for (const [index, classes] of list.entries())
          expect(ordered(classes), `box ${index} of a ${tier} ${name} group`).toEqual(
            ordered(bare[index]),
          );
      }
    });
  }
});

// An item that states its own appearance keeps it against the group on both sides, through two different
// shapes: this build resolves the tier inside the item (`props ?? group ?? provider`), while a vue group
// writes its tier onto the child's vnode and has to skip the keys the child already wrote — that build
// decides "explicit" by `hasOwnProperty`, so a group value written there would outrank the author's own.
// Resolving the appearance in the group and handing it to every child without that check is what breaks
// these cases.
describe("an item that wrote its own appearance keeps it against the group", () => {
  // The two builds keep their own shape here: a vue group writes the appearance onto the child's vnode,
  // while this one puts it in the context and lets the item read `props ?? group ?? provider`. Either way
  // what the item states wins, so the same table runs on both sides.
  const written = (props: {
    group: "checkbox" | "radio";
    groupProps?: { theme?: MarkThemeType };
    itemProps: { theme?: MarkThemeType; size?: SizeType };
  }) => {
    const tree =
      props.group === "checkbox" ? (
        <CheckboxGroup theme={props.groupProps?.theme}>
          <Checkbox value="a" label="A" theme={props.itemProps.theme} size={props.itemProps.size} />
        </CheckboxGroup>
      ) : (
        <RadioGroup value="a" theme={props.groupProps?.theme}>
          <Radio value="a" label="A" theme={props.itemProps.theme} size={props.itemProps.size} />
        </RadioGroup>
      );
    return Array.from(render(tree).container.querySelectorAll(".k-" + props.group)).map((node) =>
      Array.from(node.classList),
    );
  };

  for (const group of ["checkbox", "radio"] as const) {
    const name = `k-${group}`;
    for (const groupProps of [{}, { theme: "fill" }] as { theme?: MarkThemeType }[])
      it(`${name} written outline keeps outline against a ${
        groupProps.theme ?? "default"
      } group`, () => {
        for (const classes of written({ group, groupProps, itemProps: { theme: "outline" } })) {
          expect(classes).toContain(`${name}-outline`);
          expect(classes).not.toContain(`${name}-fill`);
        }
      });

    it(`${name} written fill keeps fill against an outlined group`, () => {
      for (const classes of written({
        group,
        groupProps: { theme: "outline" },
        itemProps: { theme: "fill" },
      })) {
        expect(classes).toContain(`${name}-fill`);
        expect(classes).not.toContain(`${name}-outline`);
      }
    });

    it(`${name} keeps the size it wrote when the group says nothing about size`, () => {
      for (const classes of written({ group, itemProps: { size: "small" } }))
        expect(classes).toContain(`${name}-sm`);
    });
  }

  it("a tier inherited from the provider is still beaten by the item's own", () => {
    const boxes = Array.from(
      render(
        <ConfigProvider theme="outline">
          <CheckboxGroup>
            <Checkbox value="a" label="A" theme="fill" />
          </CheckboxGroup>
          <RadioGroup value="a">
            <Radio value="a" label="A" theme="fill" />
          </RadioGroup>
        </ConfigProvider>,
      ).container.querySelectorAll(".k-checkbox, .k-radio"),
    ).map((node) => Array.from(node.classList));
    expect(boxes.length).toBe(2);
    expect(boxes[0]).toContain("k-checkbox-fill");
    expect(boxes[0]).not.toContain("k-checkbox-outline");
    expect(boxes[1]).toContain("k-radio-fill");
    expect(boxes[1]).not.toContain("k-radio-outline");
  });

  it("a radio button keeps the tier and shape it wrote inside a button group", () => {
    // `RadioButton` is a `Button`, so its look lands on the button root: five tiers and four shapes,
    // inherited over the same channel as the boxes above.
    const buttons = Array.from(
      render(
        <RadioGroup value="a" type="button" theme="outline" shape="round">
          <RadioButton value="a" theme="solid" shape="square" />
        </RadioGroup>,
      ).container.querySelectorAll(".k-btn"),
    ).map((node) => Array.from(node.classList));
    expect(buttons.length).toBe(1);
    expect(buttons[0]).toContain("k-btn-solid");
    expect(buttons[0]).not.toContain("k-btn-outline");
    expect(buttons[0]).toContain("k-btn-square");
  });
});
// on the items it makes (`components/radio/radio-group.tsx`, `components/checkbox/checkbox-group.tsx`),
// so the tier has to reach them through the context. It matters because the group is typed wider than
// its items: a `RadioGroup` carries the five surface tiers because its `type="button"` mode renders
// buttons, while its radio mode paints two — so the group cannot resolve the value on the items' behalf
// without quietly rewriting `solid` into `fill`. Each item runs its own guard, and these cases are what a
// pre-resolution in the group would break.
describe("a group built from options hands its tier through the context", () => {
  const OPTIONS = [
    { label: "A", value: "a" },
    { label: "B", value: "b" },
  ];

  const radioBoxes = (props: Record<string, unknown>) =>
    Array.from(
      render(<RadioGroup options={OPTIONS} {...props} />).container.querySelectorAll(".k-radio"),
    ).map((node) => Array.from(node.classList));

  for (const tier of MARK_PAINTED) {
    it(`a radio group theme="${tier}" reaches every option box`, () => {
      const list = radioBoxes({ theme: tier });
      expect(list.length, "options must render a box each").toBe(OPTIONS.length);
      for (const classes of list)
        expect(markTiers(classes, "k-radio")).toEqual([`k-radio-${tier}`]);
    });
  }

  for (const tier of ["plain", "solid", "dashed"] as const) {
    it(`a radio group theme="${tier}" lands every option box on fill`, () => {
      // The tier is legal on the group — the button mode paints it — and still has to be refused by a
      // box that cannot, with no class for it reaching the DOM.
      const bare = radioBoxes({});
      const list = radioBoxes({ theme: tier });
      expect(list.length).toBe(bare.length);
      for (const [index, classes] of list.entries()) {
        expect(ordered(classes), `box ${index} of a ${tier} group`).toEqual(ordered(bare[index]));
        expect(markTiers(classes, "k-radio"), `a ${tier} box ships a class no LESS paints`).toEqual(
          ["k-radio-fill"],
        );
      }
    });
  }

  const checkboxBoxes = (props: Record<string, unknown>) =>
    Array.from(
      render(<CheckboxGroup options={OPTIONS} {...props} />).container.querySelectorAll(
        ".k-checkbox",
      ),
    ).map((node) => Array.from(node.classList));

  for (const tier of MARK_PAINTED) {
    it(`a check box group theme="${tier}" reaches every option box`, () => {
      const list = checkboxBoxes({ theme: tier });
      expect(list.length, "options must render a box each").toBe(OPTIONS.length);
      for (const classes of list)
        expect(markTiers(classes, "k-checkbox")).toEqual([`k-checkbox-${tier}`]);
    });
  }

  it("a button-mode option group keeps the surface tiers its buttons paint", () => {
    // The other half of the same decision: the group must not funnel its items through the two-tier
    // mark list, or `solid` would reach these buttons as `fill`.
    // A `RadioButton` is a `Button`, so the tier lands on the button root rather than on a box.
    const buttons = Array.from(
      render(
        <RadioGroup type="button" options={OPTIONS} theme="solid" />,
      ).container.querySelectorAll(".k-btn"),
    ).map((node) => Array.from(node.classList));
    expect(buttons.length, "options must render a button each").toBe(OPTIONS.length);
    for (const classes of buttons) expect(classes).toContain("k-btn-solid");
  });
});

describe("an inherited tier goes through the mark guard too", () => {
  const inherited = (tier?: (typeof TIERS)[number]) =>
    Array.from(
      render(
        <ConfigProvider theme={tier}>
          <Checkbox className="target" />
          <Radio className="target" value="apple" />
        </ConfigProvider>,
      ).container.querySelectorAll(".target"),
    ).map((node) => Array.from(node.classList));

  for (const tier of MARK_UNPAINTED) {
    it(`ConfigProvider theme="${tier}" leaves both boxes on fill`, () => {
      expect(inherited(tier)).toEqual(inherited());
      for (const classes of inherited(tier))
        expect(classes.some((cls) => /-(checkbox|radio)-fill$/.test(cls))).toBe(true);
    });
  }

  it('ConfigProvider theme="outline" reaches both boxes', () => {
    for (const classes of inherited("outline"))
      expect(classes.some((cls) => /-(checkbox|radio)-outline$/.test(cls))).toBe(true);
  });

  it("an explicit prop still beats the provider", () => {
    const classes = markClasses(
      <ConfigProvider theme="outline">
        <Checkbox className="target" theme="fill" />
      </ConfigProvider>,
      "target",
    );
    expect(classes).toContain("k-checkbox-fill");
    expect(classes).not.toContain("k-checkbox-outline");
  });
});

// The button-style radio group's own layout class is the one place a tier reaches something other than a
// box: the joined-button spacing only exists for the filled look, and it has to follow the value the
// buttons are actually painted with. A button written with no `theme` is not that value — its own look
// is the bordered one, which is what the base spacing already draws — so this condition stays a literal
// `fill` comparison while still reading the inherited value.
describe("the button-style radio group joins its buttons for the filled tier only", () => {
  const buttonGroup = (props: Record<string, unknown>) =>
    Array.from(
      render(
        <RadioGroup type="button" {...props}>
          <RadioButton value="a">A</RadioButton>
          <RadioButton value="b">B</RadioButton>
        </RadioGroup>,
      ).container.querySelector(".k-radio-group")?.classList ?? [],
    );

  it('theme="fill" draws the joined layout', () => {
    expect(buttonGroup({ theme: "fill" })).toContain("k-radio-group-fill");
  });

  it("a group written with no theme keeps the base spacing", () => {
    expect(buttonGroup({})).not.toContain("k-radio-group-fill");
  });

  it('theme="outline" keeps the base spacing', () => {
    expect(buttonGroup({ theme: "outline" })).not.toContain("k-radio-group-fill");
  });

  it('a provider that asks for "fill" still joins them', () => {
    expect(
      Array.from(
        render(
          <ConfigProvider theme="fill">
            <RadioGroup type="button">
              <RadioButton value="a">A</RadioButton>
            </RadioGroup>
          </ConfigProvider>,
        ).container.querySelector(".k-radio-group")?.classList ?? [],
      ),
    ).toContain("k-radio-group-fill");
  });
});
