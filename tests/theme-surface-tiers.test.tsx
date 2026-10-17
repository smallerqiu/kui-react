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
// 3c-丁c adds `Page`, which types six tiers, emits its own default `fill`, and paints the tier on the
// cells the numbers sit on rather than on the root.
// 3c-丁d adds `Kanban`, the board whose columns are the surfaces: it typed two tiers and painted those
// two, so a tier outside its own two could still arrive from `ConfigProvider` as a class no rule answered,
// and the drop hint — the one state a column has — sat below the tier plates and never drew.
// 3c-丁d also adds `Transfer`, the pair of panels: it typed two tiers, react read no provider or form
// value at all, and vue threw one away behind a hand-written gate, so three tiers were unreachable and a
// fourth was invisible twice over. Its own look is the outlined frame, so an unsupported tier lands there.
// The style half — what each tier actually draws — is in tests/theme-variants.test.ts and the pixels in
// scripts/check-theme.ts.
import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
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
  // React spells the image component `KImage`; the label it carries below stays `Image`.
  KImage,
  Kanban,
  Page,
  QRCode,
  StatCard,
  Transfer,
} from "react-kui";

// `QRCode` paints into a canvas the moment it mounts, and jsdom hands back no 2d context; these cases
// only read the class list, so the encoder is stubbed instead of left to throw inside the component's
// own `try`.
vi.mock("qrcode", () => ({ toCanvas: vi.fn(async () => {}) }));

// The six values `theme` is typed as, and the five these components paint.
const TIERS = ["fill", "outline", "plain", "solid", "dashed", "underlined"] as const;
const PAINTED = TIERS.filter((tier) => tier !== "underlined");
const UNSUPPORTED = ["underlined"] as const;

// A board renders one column per entry, so the cases hand it the smallest one that has a header, a card
// and an empty column at the same time.
const BOARD_COLUMNS = [
  { key: "todo", title: "Todo", color: "#87909c" },
  { key: "doing", title: "Doing", color: "#3a95ff" },
];
const BOARD_TASKS = [{ id: 1, status: "todo", title: "Define requirements" }];

// A transfer renders one panel per side of the split, so the cases hand it the smallest data set that puts
// a row on both sides at once — the tier plates the two panels, so an empty one would hide half of it.
const TRANSFER_DATA = [
  { key: "a", title: "选项一", description: "描述一" },
  { key: "b", title: "选项二", description: "描述二" },
];
const TRANSFER_SPLIT = ["b"];

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
  // 3c-丁b: an image is a frame around a picture and a code is a frame around a canvas, so both paint
  // the whole ring — and both used to type six tiers while their stylesheets drew three. `outline` on an
  // image set a colour on an edge that `base.less` gives no width, so it painted nothing, and `plain` on
  // a code deleted the 12px ring the caller never asked to lose. An image's own look is `plain`, a code's
  // is the outlined frame.
  {
    name: "Image",
    prefix: "k-image",
    fallback: "plain",
    render: (props: Record<string, unknown>) => <KImage src="pic.png" {...props} />,
  },
  {
    name: "QRCode",
    prefix: "k-qrcode",
    fallback: "outline",
    render: (props: Record<string, unknown>) => <QRCode value="https://example.com" {...props} />,
  },
  // 3c-丁c: a pagination bar names its tier on the root and paints it on the cells the numbers sit on.
  // It typed six tiers, emitted two and had a rule for a third — `k-page-plain` was reachable only from
  // the other repository — while `solid` and `dashed` had neither class nor rule. Its own look is `fill`.
  {
    name: "Page",
    prefix: "k-page",
    fallback: "fill",
    render: (props: Record<string, unknown>) => <Page total={100} {...props} />,
  },
  // 3c-丁d: a board has no plate of its own — its columns are the surfaces — so the tier names the root
  // and draws on every `.k-kanban-column`. It typed two tiers and painted those two, which left
  // `plain` / `solid` / `dashed` unreachable while `ConfigProvider` could still hand them out. Its own
  // look is `fill`.
  {
    name: "Kanban",
    prefix: "k-kanban",
    fallback: "fill",
    render: (props: Record<string, unknown>) => <Kanban columns={BOARD_COLUMNS} {...props} />,
  },
  // 3c-丁d: a transfer is the two panels you move rows between. It typed `"outline" | "fill"` privately,
  // react never read a provider or a form at all, and vue dropped any other tier behind a hand-written
  // gate — so `plain` / `solid` / `dashed` were unreachable while the stylesheet painted the two it could
  // reach by hand-copying their chains. Its own look is the outlined frame, so the guard falls back there.
  {
    name: "Transfer",
    prefix: "k-transfer",
    fallback: "outline",
    render: (props: Record<string, unknown>) => (
      <Transfer dataSource={TRANSFER_DATA} targetKeys={TRANSFER_SPLIT} {...props} />
    ),
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

// 3c-丁c: a pagination bar names its tier on the root — that is where `shape` and `size` live too — and
// paints it on the cells, so the DOM contract here is one tier class and no dead one. The bar also hands
// the tier it *resolved* to the controls inside it, guard included: `theme="underlined"` used to put an
// underlined sizer in a bar whose own cells fell back to `fill`.
const page = SURFACES.find((surface) => surface.name === "Page")!;
const pageClasses = (props: Record<string, unknown>) =>
  Array.from(
    render(<Page total={100} {...props} />).container.querySelector(".k-page")!.classList,
  );

describe("a pager names its tier once and hands the same tier down", () => {
  for (const tier of TIERS)
    it(`theme="${tier}" puts exactly one tier class on the bar`, () => {
      expect(tierClasses(page, pageClasses({ theme: tier }))).toEqual([
        `k-page-${tier === "underlined" ? page.fallback : tier}`,
      ]);
    });

  it("lands beside the shape and size flags", () => {
    const classes = pageClasses({ theme: "solid", shape: "square", size: "small" });
    expect(classes).toContain("k-page-solid");
    expect(classes).toContain("k-page-square");
    expect(classes).toContain("k-page-sm");
  });

  it("forwards the resolved tier to its own sizer and elevator", () => {
    const { container } = render(<Page total={100} showSizer showElevator theme="solid" />);
    expect(container.querySelector(".k-select-solid")).toBeTruthy();
    // The elevator is an `InputNumber`, and the responsive bar renders one per layout that shows an
    // elevator — so every one of them has to carry the tier the bar resolved to, not just the first.
    const boxes = Array.from(container.querySelectorAll(".k-input-number"));
    expect(boxes.length).toBeGreaterThan(0);
    for (const box of boxes) expect(box.classList.contains("k-input-number-solid")).toBe(true);
  });

  // What the bar hands down is what it *resolved to*, not what it was asked for. `underlined` is a tier a
  // pager never paints, so an underlined request has to leave an underlined sizer behind exactly the way
  // it leaves an underlined page cell — the controls inside a bar are the bar's own parts.
  it("never hands a tier it will not paint to the controls inside it", () => {
    const { container } = render(<Page total={100} showSizer showElevator theme="underlined" />);
    expect(container.querySelector(".k-select-fill")).toBeTruthy();
    expect(container.querySelector(".k-select-underlined")).toBeNull();
    const boxes = Array.from(container.querySelectorAll(".k-input-number"));
    expect(boxes.length).toBeGreaterThan(0);
    for (const box of boxes) {
      expect(box.classList.contains("k-input-number-fill")).toBe(true);
      expect(box.classList.contains("k-input-number-underlined")).toBe(false);
    }
  });
});

// 3c-丁d: a board names its tier on the root and paints it on every column — it owns no plate of its own —
// so the DOM contract is one tier class plus one column per entry, and the drop hint (the state the
// stylesheet now has to out-order those plates for) has to land on the column itself.
const kanban = SURFACES.find((surface) => surface.name === "Kanban")!;
const board = (props: Record<string, unknown> = {}) =>
  render(<Kanban columns={BOARD_COLUMNS} data={BOARD_TASKS} {...props} />).container;

describe("a board names its tier once and drops on its columns", () => {
  for (const tier of TIERS)
    it(`theme="${tier}" puts exactly one tier class on the board`, () => {
      expect(
        tierClasses(
          kanban,
          Array.from(board({ theme: tier }).querySelector(".k-kanban")!.classList),
        ),
      ).toEqual([`k-kanban-${tier === "underlined" ? kanban.fallback : tier}`]);
    });

  // A tier that reached nothing but the root would be invisible, so the parts it colours are the ones a
  // caller can see: the column, its title, its count, and the card inside it.
  it("renders one column per entry with the parts a solid plate inverts", () => {
    const columns = Array.from(board({ theme: "solid" }).querySelectorAll(".k-kanban-column"));
    expect(columns).toHaveLength(BOARD_COLUMNS.length);
    expect(columns[0].querySelector(".k-kanban-column-header strong")?.textContent).toBe("Todo");
    expect(columns[0].querySelector(".k-kanban-column-header em")?.textContent).toBe("1");
    expect(columns[0].querySelector(".k-kanban-item")?.textContent).toBe("Define requirements");
    expect(columns[1].querySelector(".k-kanban-column-content")).toBeTruthy();
  });

  // `.k-kanban-column.k-kanban-column-drag-over` paints the hint, so the state class belongs on the column
  // the tier just plated — anywhere else the rule matches nothing and the board stops answering a drag.
  it("marks the column a card is dragged over", () => {
    const columns = board().querySelectorAll(".k-kanban-column");
    // jsdom hands a `DragEvent` no `dataTransfer`, and the board reads `dropEffect` off it, so the case
    // supplies the one property the handler touches.
    const dataTransfer = { dropEffect: "", setData: () => {} };
    fireEvent.dragOver(columns[1], { dataTransfer });
    expect(columns[1].classList.contains("k-kanban-column-drag-over")).toBe(true);
    fireEvent.dragLeave(columns[1], { relatedTarget: null });
    expect(columns[1].classList.contains("k-kanban-column-drag-over")).toBe(false);
  });
});

// 3c-丁d: a transfer names its tier on the root and paints it on both panels, so the DOM contract is one
// tier class beside two lists — and the search box inside a panel is the one control the component hands
// its tier to, which `solid` has to refuse: a primary box on a primary plate is nothing to look at, the
// same reason a solid board hints in its plate's own ink.
const transfer = SURFACES.find((surface) => surface.name === "Transfer")!;
const panels = (props: Record<string, unknown> = {}) =>
  render(<Transfer dataSource={TRANSFER_DATA} targetKeys={TRANSFER_SPLIT} {...props} />).container;

describe("a transfer names its tier once and plates both panels", () => {
  for (const tier of TIERS)
    it(`theme="${tier}" puts exactly one tier class on the transfer`, () => {
      expect(
        tierClasses(
          transfer,
          Array.from(panels({ theme: tier }).querySelector(".k-transfer")!.classList),
        ),
      ).toEqual([`k-transfer-${tier === "underlined" ? transfer.fallback : tier}`]);
    });

  // A tier that reached nothing but the root would be invisible, so the parts it colours are the ones a
  // caller can see: both panels, each with its title, its count, its rows and the row's muted line.
  it("renders two panels with the parts a solid plate inverts", () => {
    const lists = Array.from(panels({ theme: "solid" }).querySelectorAll(".k-transfer-list"));
    expect(lists).toHaveLength(2);
    expect(
      lists.map((list) => list.querySelector(".k-transfer-header .k-checkbox")?.textContent),
    ).toEqual(["Source", "Target"]);
    expect(
      lists.map((list) => list.querySelector(".k-transfer-header > span")?.textContent),
    ).toEqual(["0/1", "0/1"]);
    expect(
      lists.map((list) => list.querySelector(".k-transfer-item-content")?.textContent),
    ).toEqual(["选项一描述一", "选项二描述二"]);
    expect(lists[0].querySelector(".k-transfer-item-content small")?.textContent).toBe("描述一");
    // The two buttons between the panels are the operation, not the surface, so they keep their own look.
    expect(panels({ theme: "solid" }).querySelectorAll(".k-transfer-operations .k-btn")).toHaveLength(
      2,
    );
  });

  // The class belongs on the panel the tier paints, and the split belongs on the root: a tier class that
  // landed on the panels instead would plate each twice and out-specify the arm.
  it("keeps the tier class on the root, not on the panels", () => {
    const { container } = render(
      <Transfer dataSource={TRANSFER_DATA} targetKeys={TRANSFER_SPLIT} theme="solid" searchable />,
    );
    expect(Array.from(container.querySelector(".k-transfer-list")!.classList)).toEqual([
      "k-transfer-list",
    ]);
    expect(container.querySelector(".k-transfer-item")?.classList.contains("is-selected")).toBe(
      false,
    );
  });

  // `searchable` is the flag that puts an input inside a panel, and the tier is handed straight to it —
  // except under `solid`, where the box keeps a light plate so it stays a box the eye can find.
  for (const tier of PAINTED)
    it(`theme="${tier}" hands its search box the ${
      tier === "solid" ? "fill" : tier
    } plate`, () => {
      const input = panels({ theme: tier, searchable: true }).querySelector(
        ".k-transfer-search .k-input",
      );
      expect(input?.classList.contains(`k-input-${tier === "solid" ? "fill" : tier}`)).toBe(true);
    });

  // Disabled is a state of the whole transfer, so it shares the root with the tier class rather than
  // replacing it — the stylesheet needs both to step the plate's ink down.
  it("lands beside the disabled and readonly flags", () => {
    const classes = Array.from(
      panels({ theme: "solid", disabled: true }).querySelector(".k-transfer")!.classList,
    );
    expect(classes).toContain("k-transfer-solid");
    expect(classes).toContain("is-disabled");
    expect(
      Array.from(
        panels({ theme: "dashed", readOnly: true }).querySelector(".k-transfer")!.classList,
      ),
    ).toEqual(expect.arrayContaining(["k-transfer-dashed", "is-readonly"]));
  });

  // `footer` is the one slot that puts content on the plate below the rows, and the tier inverts its line
  // and its text, so the slot has to stay inside the panel it belongs to.
  it("keeps a footer inside the panel it plates", () => {
    const footers = panels({
      theme: "solid",
      footer: () => <button type="button">清空</button>,
    }).querySelectorAll(".k-transfer-footer");
    expect(footers).toHaveLength(2);
    expect(footers[0].parentElement?.classList.contains("k-transfer-list")).toBe(true);
    expect(footers[0].textContent).toBe("清空");
  });
});
