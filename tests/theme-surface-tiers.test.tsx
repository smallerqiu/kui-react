// 3c-丙a: the surface family — `Card`, `FeatureCard` and `StatCard` — resolves its tier through
// `resolvePaintedTheme` and puts it straight on the root class, so unlike Button its own look *is* a
// tier class (`fill`). That makes the contract "an unsupported tier lands on `fill`, the same DOM as a
// card with no `theme` written", not Button's "an unsupported tier emits nothing": `k-card-fill` is the
// component's own appearance, so falling back to it is what keeps the promise. `underlined` is the tier
// none of them paint — "keep only the bottom border" on a box deletes three of its four sides, which is
// not an appearance preset (theme 口径 §五.1), and `StatCard` used to type three tiers while `Card` and
// `FeatureCard` typed all six and shipped `k-card-solid` as a class no rule answered.
// 3c-丙b adds the two panels of the same family, `Collapse` and `FeedbackPanel`. They resolve the same
// way but their own look is `outline`, not `fill`, and `FeedbackPanel` used to spell its tier class
// `k-feedback-panel-theme-<tier>` while also shipping `k-feedback-panel-solid` / `-dashed` as classes no
// rule answered.
// 3c-丙c adds the last card of this family, `CheckCard`, which typed its tier as a private
// `"outline" | "fill"` union while a `ConfigProvider` could still hand it any of the six.
// 3c-丁a adds `Alert`, the one surface whose plate is not a neutral token: the tint comes from `type`,
// so `fill` paints that tint and `solid` paints the same colour at full strength rather than the library
// primary — an error block and a success block have to stay two different blocks. Its stylesheet used to
// answer only `outline` and `plain`, spelled `k-alert-theme-<tier>` behind an infix no other surface has.
// The style half — what each tier actually draws — is in tests/theme-variants.test.ts and the pixels in
// scripts/check-theme.ts.
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  Alert,
  Card,
  CheckCard,
  CheckCardGroup,
  Collapse,
  CollapsePanel,
  ConfigProvider,
  FeatureCard,
  FeedbackPanel,
  StatCard,
} from "react-kui";

// The six values `theme` is typed as, and the five these components paint.
const TIERS = ["fill", "outline", "plain", "solid", "dashed", "underlined"] as const;
const PAINTED = TIERS.filter((tier) => tier !== "underlined");
const UNSUPPORTED = ["underlined"] as const;

const SURFACES = [
  {
    name: "Card",
    prefix: "k-card",
    // Each component's own default tier is the fallback an unsupported tier lands on.
    fallback: "fill",
    render: (props: Record<string, unknown>) => <Card {...props} />,
  },
  {
    name: "FeatureCard",
    prefix: "k-feature-card",
    fallback: "fill",
    render: (props: Record<string, unknown>) => <FeatureCard title="标题" {...props} />,
  },
  {
    name: "StatCard",
    prefix: "k-stat-card",
    fallback: "fill",
    render: (props: Record<string, unknown>) => <StatCard title="统计" {...props} />,
  },
  {
    name: "Collapse",
    prefix: "k-collapse",
    fallback: "outline",
    render: (props: Record<string, unknown>) => (
      <Collapse {...props}>
        <CollapsePanel key="one" title="面板一">
          内容一
        </CollapsePanel>
        <CollapsePanel key="two" title="面板二">
          内容二
        </CollapsePanel>
      </Collapse>
    ),
  },
  {
    name: "FeedbackPanel",
    prefix: "k-feedback-panel",
    fallback: "outline",
    render: (props: Record<string, unknown>) => (
      <FeedbackPanel heading="标题" description="描述" {...props}>
        详情
      </FeedbackPanel>
    ),
  },
  // 3c-丙c: a check card resolves the same way, and its own look is the outlined frame too.
  {
    name: "CheckCard",
    prefix: "k-check-card",
    fallback: "outline",
    render: (props: Record<string, unknown>) => (
      <CheckCard title="选项" description="描述" {...props} />
    ),
  },
  // 3c-丁a: an alert tints its own plate from `type`, and its stylesheet answered only `outline` and
  // `plain` — spelled `k-alert-theme-<tier>`, the one infix left in the library — so the documented
  // default `theme="fill"` shipped a class nothing painted, and `solid` / `dashed` shipped two more.
  {
    name: "Alert",
    prefix: "k-alert",
    fallback: "fill",
    render: (props: Record<string, unknown>) => <Alert type="info" message="提示" {...props} />,
  },
] as const;

const rootClasses = (surface: (typeof SURFACES)[number], props: Record<string, unknown>) =>
  Array.from(
    render(surface.render(props)).container.querySelector(`.${surface.prefix}`)?.classList ?? [],
  );

// Only the six tier spellings count here: `-bordered`, `-round` and `-small` are the flags, shape and
// size, and `-default` is the round shape spelling, not a tier.
const tierClasses = (surface: (typeof SURFACES)[number], classes: string[]) =>
  classes.filter((cls) => TIERS.some((tier) => cls === `${surface.prefix}-${tier}`));

for (const surface of SURFACES) {
  describe(`${surface.name} ships only the tiers its own LESS paints`, () => {
    for (const tier of PAINTED) {
      it(`theme="${tier}" reaches ${surface.prefix}-${tier}`, () => {
        expect(tierClasses(surface, rootClasses(surface, { theme: tier }))).toEqual([
          `${surface.prefix}-${tier}`,
        ]);
      });
    }

    // The fallback is the component's own default tier, so the DOM has to be identical to never writing
    // `theme` at all — that is the only spelling left for "listen to the component" now that `default`
    // is gone from `ThemeType`.
    for (const tier of UNSUPPORTED) {
      it(`theme="${tier}" lands on the tier a ${surface.name} with no theme gets`, () => {
        expect(rootClasses(surface, { theme: tier })).toEqual(rootClasses(surface, {}));
        expect(tierClasses(surface, rootClasses(surface, { theme: tier }))).toEqual([
          `${surface.prefix}-${surface.fallback}`,
        ]);
      });
    }

    // Guarded after inheritance, not only on the written prop: a provider that asks for a tier this
    // component does not paint has to reach the same DOM as a provider that asks for nothing.
    const withProvider = (providerProps: Record<string, unknown>) =>
      tierClasses(
        surface,
        Array.from(
          render(
            <ConfigProvider {...providerProps}>
              {surface.render({ className: "target" })}
            </ConfigProvider>,
          ).container.querySelector(".target")?.classList ?? [],
        ),
      );

    for (const tier of UNSUPPORTED)
      it(`ConfigProvider theme="${tier}" lands on ${surface.prefix}-${surface.fallback}`, () => {
        expect(withProvider({ theme: tier })).toEqual(withProvider({}));
        expect(withProvider({ theme: tier })).toEqual([`${surface.prefix}-${surface.fallback}`]);
      });

    it(`a painted tier still comes down from the provider`, () => {
      expect(withProvider({ theme: "solid" })).toEqual([`${surface.prefix}-solid`]);
    });

    // A written prop still wins over the provider, and it goes through the same guard.
    it(`theme="outline" on the component beats ConfigProvider theme="solid"`, () => {
      expect(
        tierClasses(
          surface,
          Array.from(
            render(
              <ConfigProvider theme="solid">
                {surface.render({ className: "target", theme: "outline" })}
              </ConfigProvider>,
            ).container.querySelector(".target")?.classList ?? [],
          ),
        ),
      ).toEqual([`${surface.prefix}-outline`]);
    });
  });
}

// `solid` is the one tier that repaints the whole box, so a tier class alone is not the contract: the
// DOM of a solid surface keeps every part of the card the caller put in it.
describe("a solid surface keeps its content and its other classes", () => {
  it("keeps the head, the extra and the body of a Card", () => {
    const { container } = render(
      <Card theme="solid" title="标题" extra={<span>更多</span>}>
        内容
      </Card>,
    );
    expect(container.querySelector(".k-card-head")).toBeTruthy();
    expect(container.querySelector(".k-card-title")?.textContent).toBe("标题");
    expect(container.querySelector(".k-card-extra")?.textContent).toBe("更多");
    expect(container.querySelector(".k-card-body")?.textContent).toBe("内容");
  });

  it("keeps the icon chip and the description of a FeatureCard", () => {
    const { container } = render(
      <FeatureCard theme="solid" icon="search" title="标题" desc="描述" />,
    );
    expect(container.querySelector(".k-feature-card-icon")).toBeTruthy();
    expect(container.querySelector(".k-feature-card-desc")?.textContent).toBe("描述");
  });

  it("keeps the muted lines of a StatCard, and a trend that carries a semantic colour", () => {
    const { container } = render(
      <StatCard
        theme="solid"
        items={[
          { value: 12, desc: "今日", trend: "+18.2% 较上月", trendStatus: "success" },
          { value: 8, desc: "昨日", trend: "持平", trendStatus: "default" },
        ]}
      />,
    );
    const desc = Array.from(container.querySelectorAll(".k-stat-card-item-desc"));
    expect(desc.map((node) => node.textContent)).toEqual(["今日", "昨日"]);
    expect(container.querySelector(".k-stat-card-item-trend-success")).toBeTruthy();
    // `trendStatus="default"` is the muted trend the solid tier has to invert; a semantic trend keeps
    // its own colour, which is what the `:not()` chain in `.k-stat-card-solid` is for.
    expect(container.querySelector(".k-stat-card-item-trend-default")).toBeTruthy();
  });

  it("keeps every panel of a Collapse", () => {
    const { container } = render(
      <Collapse theme="solid" openKeys={["two"]}>
        <CollapsePanel key="one" title="面板一">
          内容一
        </CollapsePanel>
        <CollapsePanel key="two" title="面板二" extra={<span>更多</span>}>
          内容二
        </CollapsePanel>
      </Collapse>,
    );
    expect(container.querySelectorAll(".k-collapse-item")).toHaveLength(2);
    expect(
      Array.from(container.querySelectorAll(".k-collapse-header .k-collapse-title")).map(
        (node) => node.textContent,
      ),
    ).toEqual(["面板一", "面板二"]);
    expect(container.querySelector(".k-collapse-item-active")).toBeTruthy();
    expect(container.querySelector(".k-collapse-extra")?.textContent).toBe("更多");
    expect(container.querySelector(".k-collapse-content-box")?.textContent).toBe("内容二");
  });

  it("keeps the mark, the heading, the details and the actions of a FeedbackPanel", () => {
    const { container } = render(
      <FeedbackPanel
        kind="caution"
        theme="solid"
        heading="标题"
        description="描述"
        actions={<button type="button">重试</button>}
      >
        详情
      </FeedbackPanel>,
    );
    expect(container.querySelector(".k-feedback-panel-mark-inner")).toBeTruthy();
    expect(container.querySelector(".k-feedback-panel-heading")?.textContent).toBe("标题");
    expect(container.querySelector(".k-feedback-panel-description")?.textContent).toBe("描述");
    expect(container.querySelector(".k-feedback-panel-details")?.textContent).toBe("详情");
    expect(container.querySelector(".k-feedback-panel-actions")?.textContent).toBe("重试");
    // The kind is the panel's message, not its surface, so it survives the tier — it is what the 4px
    // stripe and the mark chip are coloured from.
    expect(container.querySelector(".k-feedback-panel-caution")).toBeTruthy();
  });
});

// 3c-丙b: `FeedbackPanel` used to spell its tier class `k-feedback-panel-theme-<tier>`. The infix is
// gone so every surface in the library answers `<prefix>-<tier>`, which is the spelling the shared
// style contract and the pixel checks read — a second spelling would let a tier go unpainted again.
describe("a feedback panel names its tier like every other surface", () => {
  const panel = SURFACES.find((surface) => surface.name === "FeedbackPanel")!;
  for (const tier of TIERS)
    it(`theme="${tier}" never emits the -theme- infix`, () => {
      const classes = Array.from(
        render(<FeedbackPanel theme={tier} />).container.querySelector(".k-feedback-panel")!
          .classList,
      );
      expect(classes.some((cls) => cls.includes("-theme-"))).toBe(false);
      expect(tierClasses(panel, classes)).toEqual([
        `k-feedback-panel-${tier === "underlined" ? panel.fallback : tier}`,
      ]);
    });
});

// A tier class shares the root with the component's own flags, and `Collapse` has one that changes the
// whole shape of the box: `sample` is the documented frame-less spelling, so the tier has to land
// beside it without deciding the frame for it.
describe("a tier lands beside the flags of a Collapse", () => {
  it("keeps sample and shape alongside theme", () => {
    const classes = Array.from(
      render(
        <Collapse theme="solid" sample shape="square">
          <CollapsePanel key="one" title="面板">
            内容
          </CollapsePanel>
        </Collapse>,
      ).container.querySelector(".k-collapse")!.classList,
    );
    expect(classes).toContain("k-collapse-solid");
    expect(classes).toContain("k-collapse-sample");
    expect(classes).toContain("k-collapse-square");
  });
});

// 3c-丙c: a check card can be handed its tier three ways — written on the card, forwarded by the group
// that owns the choice, or inherited from the provider — and only the card paints a surface. The group
// therefore passes what it was given straight through the card's guard instead of resolving a tier of
// its own: `k-check-card-group` has no LESS block to fall back to.
describe("a check card takes its tier from whoever asks for it", () => {
  const card = SURFACES.find((surface) => surface.name === "CheckCard")!;
  const options = [
    { value: "a", title: "选项一" },
    { value: "b", title: "选项二" },
  ];

  const tiersInside = (node: React.ReactElement) =>
    [...render(node).container.querySelectorAll<HTMLElement>(".k-check-card")].map((element) =>
      tierClasses(card, Array.from(element.classList)),
    );

  it("a group forwards its tier to every card it renders", () => {
    expect(tiersInside(<CheckCardGroup theme="solid" options={options} />)).toEqual([
      [`${card.prefix}-solid`],
      [`${card.prefix}-solid`],
    ]);
  });

  // The group paints nothing, so an unsupported tier has to be answered by the card's own fallback —
  // and the group root must not grow a tier class of its own on the way.
  it("a group hands an unpainted tier down to the card's fallback", () => {
    const { container } = render(<CheckCardGroup theme="underlined" options={options} />);
    expect(
      [...container.querySelectorAll<HTMLElement>(".k-check-card")].map((element) =>
        tierClasses(card, Array.from(element.classList)),
      ),
    ).toEqual([[`${card.prefix}-outline`], [`${card.prefix}-outline`]]);
    expect(
      tierClasses(card, Array.from(container.querySelector(".k-check-card-group")!.classList)),
    ).toEqual([]);
  });

  // Written on the card is the stronger spelling: the group's value only fills in what the card left out.
  it("a theme written on the card beats the group", () => {
    expect(
      tiersInside(
        <CheckCardGroup theme="fill" value="a">
          <CheckCard value="a" theme="solid" title="选项一" />
        </CheckCardGroup>,
      ),
    ).toEqual([[`${card.prefix}-solid`]]);
  });

  // The checked marks are the state this component exists to show, so `solid` has to keep them legible
  // instead of painting them the plate's own colour; both classes share the root to do it.
  it("keeps the checked state beside a solid tier", () => {
    const { container } = render(
      <CheckCard theme="solid" checked title="选项" description="描述" />,
    );
    const classes = Array.from(container.querySelector(".k-check-card")!.classList);
    expect(classes).toContain(`${card.prefix}-solid`);
    expect(classes).toContain("is-checked");
    expect(container.querySelector(".k-check-card-indicator")).toBeTruthy();
    expect(container.querySelector(".k-check-card-title")?.textContent).toBe("选项");
    expect(container.querySelector(".k-check-card-description")?.textContent).toBe("描述");
  });

  it("lands beside the size and shape flags of a card", () => {
    const classes = Array.from(
      render(
        <CheckCard theme="dashed" size="small" shape="square" title="选项" />,
      ).container.querySelector(".k-check-card")!.classList,
    );
    expect(classes).toContain(`${card.prefix}-dashed`);
    expect(classes).toContain(`${card.prefix}-small`);
    expect(classes).toContain(`${card.prefix}-square`);
  });
});

// 3c-丁a: `Alert` spelled its tier class `k-alert-theme-<tier>` while every other surface answered
// `<prefix>-<tier>`, which is how `solid` and `dashed` went unpainted for as long as the shared style
// contract and the pixel checks only read the one spelling. The infix is gone, so an alert now resolves
// like the rest of the family: five painted tiers, and `underlined` landing on `fill` — the tinted plate
// the component ships with.
const alert = SURFACES.find((surface) => surface.name === "Alert")!;
const alertClasses = (props: Record<string, unknown>) =>
  Array.from(
    render(<Alert type="info" message="提示" {...props} />).container.querySelector(".k-alert")!
      .classList,
  );

describe("an alert names its tier like every other surface", () => {
  for (const tier of TIERS)
    it(`theme="${tier}" never emits the -theme- infix`, () => {
      const classes = alertClasses({ theme: tier });
      expect(classes.some((cls) => cls.includes("-theme-"))).toBe(false);
      expect(tierClasses(alert, classes)).toEqual([
        `k-alert-${tier === "underlined" ? alert.fallback : tier}`,
      ]);
    });

  // `bordered` is the frame flag and `shape` is the corner, so both keep their own class beside the tier.
  it("lands beside the bordered flag and the shape", () => {
    const classes = alertClasses({ theme: "outline", bordered: true, shape: "square" });
    expect(classes).toContain("k-alert-outline");
    expect(classes).toContain("k-alert-bordered");
    expect(classes).toContain("k-alert-shape-square");
  });
});

// `type` is the alert's message and the plate is drawn from it, so no tier may drop the type class — and
// `solid` in particular has to keep four parts of its own legible on a saturated plate.
describe("a solid alert keeps its type and everything it paints", () => {
  for (const type of ["info", "success", "warning", "error"] as const)
    it(`theme="solid" keeps type="${type}"`, () => {
      const classes = Array.from(
        render(<Alert type={type} message="提示" theme="solid" />).container.querySelector(
          ".k-alert",
        )!.classList,
      );
      expect(classes).toContain(`k-alert-${type}`);
      expect(tierClasses(alert, classes)).toEqual(["k-alert-solid"]);
    });

  it("keeps the mark, the message, the description and the close button", () => {
    const { container } = render(
      <Alert type="warning" theme="solid" message="标题" description="描述" closable showIcon />,
    );
    expect(container.querySelector(".k-alert-message")?.textContent).toBe("标题");
    expect(container.querySelector(".k-alert-description")?.textContent).toBe("描述");
    expect(container.querySelector(".k-alert-icon")).toBeTruthy();
    expect(container.querySelector(".k-alert-close")).toBeTruthy();
    expect(Array.from(container.querySelector(".k-alert")!.classList)).toContain(
      "k-alert-has-description",
    );
  });
});
