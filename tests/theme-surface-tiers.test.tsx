// 3c-丙a: the surface family — `Card`, `FeatureCard` and `StatCard` — resolves its tier through
// `resolvePaintedTheme` and puts it straight on the root class, so unlike Button its own look *is* a
// tier class (`fill`). That makes the contract "an unsupported tier lands on `fill`, the same DOM as a
// card with no `theme` written", not Button's "an unsupported tier emits nothing": `k-card-fill` is the
// component's own appearance, so falling back to it is what keeps the promise. `underlined` is the tier
// none of them paint — "keep only the bottom border" on a box deletes three of its four sides, which is
// not an appearance preset (theme 口径 §五.1), and `StatCard` used to type three tiers while `Card` and
// `FeatureCard` typed all six and shipped `k-card-solid` as a class no rule answered.
// The style half — what each tier actually draws — is in tests/theme-variants.test.ts and the pixels in
// scripts/check-theme.ts.
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card, ConfigProvider, FeatureCard, StatCard } from "react-kui";

// The six values `theme` is typed as, and the five these components paint.
const TIERS = ["fill", "outline", "plain", "solid", "dashed", "underlined"] as const;
const PAINTED = TIERS.filter((tier) => tier !== "underlined");
const UNSUPPORTED = ["underlined"] as const;

const SURFACES = [
  {
    name: "Card",
    prefix: "k-card",
    render: (props: Record<string, unknown>) => <Card {...props} />,
  },
  {
    name: "FeatureCard",
    prefix: "k-feature-card",
    render: (props: Record<string, unknown>) => <FeatureCard title="标题" {...props} />,
  },
  {
    name: "StatCard",
    prefix: "k-stat-card",
    render: (props: Record<string, unknown>) => <StatCard title="统计" {...props} />,
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
          `${surface.prefix}-fill`,
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
      it(`ConfigProvider theme="${tier}" lands on ${surface.prefix}-fill`, () => {
        expect(withProvider({ theme: tier })).toEqual(withProvider({}));
        expect(withProvider({ theme: tier })).toEqual([`${surface.prefix}-fill`]);
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
});
