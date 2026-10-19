// `Form`'s `size`, `shape` and `theme` are documented as the appearance of its *child controls*, and a
// Card or an Alert sitting in the same form is not one. vue has always said this with two hooks —
// `useFormAppearance` for controls, `useConfigAppearance` for everything else. react read Form from the single
// hook every component called, so `<Form theme="solid">` plated every panel around its fields and
// `<Form size="small">` shrank them. The two tables below are that split: which components may take a tier from
// the form, and which must not.
// Every surface is also asked to take the same tier from `ConfigProvider`, so "the form was ignored" can never
// be misread as "inheritance broke" — the split is about Form, not about inheriting.
import type { ReactElement } from "react";
import type { ThemeType } from "../components/const/types";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  Alert,
  AutoComplete,
  Button,
  Card,
  Cascader,
  CheckCard,
  Checkbox,
  Collapse,
  CollapsePanel,
  ColorPicker,
  ConfigProvider,
  DatePicker,
  FeatureCard,
  FeedbackPanel,
  Form,
  Input,
  InputGroup,
  InputNumber,
  InputOTP,
  InputTag,
  Kanban,
  KImage,
  ListPanel,
  Mentions,
  Page,
  QRCode,
  Radio,
  Select,
  StatCard,
  Switch,
  Tag,
  TextArea,
  Transfer,
  TreeSelect,
} from "react-kui";

// `QRCode` paints into a canvas as soon as it mounts and jsdom hands back no 2d context; these cases only read
// the class list, so the encoder is stubbed instead of left to throw inside the component's own `try`.
vi.mock("qrcode", () => ({ toCanvas: vi.fn(async () => {}) }));

const OPTIONS = [{ label: "Apple", value: "apple" }];
const TREE = [{ key: "apple", title: "Apple" }];
const TRANSFER_DATA = [
  { key: "a", title: "选项一" },
  { key: "b", title: "选项二" },
];
const BOARD_COLUMNS = [{ key: "todo", title: "Todo", color: "#87909c" }];

// `prefix` is the class that carries the tier, so the two wrappers with no surface of their own name the
// control they delegate to and keep their own name in `label` for the title.
const CONTROLS: {
  prefix: string;
  label?: string;
  tier: ThemeType;
  node: (props: Record<string, unknown>) => ReactElement;
}[] = [
  { prefix: "k-input", tier: "solid", node: (props) => <Input clearable={false} {...props} /> },
  { prefix: "k-textarea", tier: "solid", node: (props) => <TextArea {...props} /> },
  { prefix: "k-input-number", tier: "solid", node: (props) => <InputNumber {...props} /> },
  { prefix: "k-input-otp", tier: "solid", node: (props) => <InputOTP {...props} /> },
  { prefix: "k-input-tag", tier: "solid", node: (props) => <InputTag {...props} /> },
  { prefix: "k-select", tier: "solid", node: (props) => <Select options={OPTIONS} {...props} /> },
  {
    prefix: "k-tree-select",
    tier: "solid",
    node: (props) => <TreeSelect treeData={TREE} {...props} />,
  },
  {
    prefix: "k-cascader",
    tier: "solid",
    node: (props) => <Cascader options={OPTIONS} {...props} />,
  },
  { prefix: "k-datepicker", tier: "solid", node: (props) => <DatePicker {...props} /> },
  { prefix: "k-color-picker", tier: "solid", node: (props) => <ColorPicker {...props} /> },
  {
    prefix: "k-input",
    label: "k-auto-complete",
    tier: "solid",
    node: (props) => <AutoComplete {...props} />,
  },
  {
    prefix: "k-textarea",
    label: "k-mentions",
    tier: "solid",
    node: (props) => <Mentions {...props} />,
  },
  // A checkbox and a radio paint two tiers, so the probe has to be the one their own look is not.
  { prefix: "k-checkbox", tier: "outline", node: (props) => <Checkbox {...props}>选项</Checkbox> },
  { prefix: "k-radio", tier: "outline", node: (props) => <Radio value="a" {...props} /> },
  {
    prefix: "k-transfer",
    tier: "solid",
    node: (props) => <Transfer dataSource={TRANSFER_DATA} targetKeys={["b"]} {...props} />,
  },
  { prefix: "k-check-card", tier: "solid", node: (props) => <CheckCard title="选项" {...props} /> },
];

// Everything else a form may wrap: the tier has to stay the one the component was built to look like. `own` is
// that tier, and `Button` owns none — its default look carries no tier class at all.
const SURFACES: {
  prefix: string;
  label?: string;
  own: ThemeType | null;
  node: (props: Record<string, unknown>) => ReactElement;
}[] = [
  { prefix: "k-card", own: "fill", node: (props) => <Card {...props} /> },
  {
    prefix: "k-feature-card",
    own: "fill",
    node: (props) => <FeatureCard title="标题" {...props} />,
  },
  { prefix: "k-stat-card", own: "fill", node: (props) => <StatCard title="统计" {...props} /> },
  {
    prefix: "k-collapse",
    own: "outline",
    node: (props) => (
      <Collapse {...props}>
        <CollapsePanel key="one" title="面板一">
          内容一
        </CollapsePanel>
      </Collapse>
    ),
  },
  {
    prefix: "k-feedback-panel",
    own: "outline",
    node: (props) => (
      <FeedbackPanel heading="标题" description="描述" {...props}>
        详情
      </FeedbackPanel>
    ),
  },
  {
    prefix: "k-alert",
    own: "fill",
    node: (props) => <Alert type="info" message="提示" {...props} />,
  },
  { prefix: "k-image", own: "plain", node: (props) => <KImage src="pic.png" {...props} /> },
  {
    prefix: "k-qrcode",
    own: "outline",
    node: (props) => <QRCode value="https://example.com" {...props} />,
  },
  { prefix: "k-page", own: "fill", node: (props) => <Page total={100} {...props} /> },
  {
    prefix: "k-kanban",
    own: "fill",
    node: (props) => <Kanban columns={BOARD_COLUMNS} {...props} />,
  },
  {
    prefix: "k-card",
    label: "k-list-panel",
    own: "outline",
    node: (props) => <ListPanel summary="12 条" {...props} />,
  },
  { prefix: "k-tag", own: "fill", node: (props) => <Tag {...props}>标签</Tag> },
  { prefix: "k-btn", own: null, node: (props) => <Button {...props}>按钮</Button> },
];

const TIERS = ["fill", "outline", "plain", "solid", "dashed", "underlined"] as const;

const classesOf = (container: HTMLElement, selector: string) =>
  Array.from(container.querySelector(selector)?.classList ?? []);

const tiersOf = (classes: string[], prefix: string) =>
  classes.filter((cls) => TIERS.some((tier) => cls === `${prefix}-${tier}`));

describe("a Form hands its tier to the controls it wraps", () => {
  for (const control of CONTROLS) {
    const label = control.label ?? control.prefix;
    it(`${label} takes ${control.prefix}-${control.tier} from the form`, () => {
      const { container } = render(<Form theme={control.tier}>{control.node({})}</Form>);
      expect(classesOf(container, `.${control.prefix}`)).toContain(
        `${control.prefix}-${control.tier}`,
      );
    });
  }
});

describe("a Form keeps its tier off everything else", () => {
  for (const surface of SURFACES) {
    const label = surface.label ?? surface.prefix;
    it(`${label} stays on ${surface.own ? `${surface.prefix}-${surface.own}` : "its own look"} under a form`, () => {
      const { container } = render(<Form theme="solid">{surface.node({})}</Form>);
      expect(tiersOf(classesOf(container, `.${surface.prefix}`), surface.prefix)).toEqual(
        surface.own ? [`${surface.prefix}-${surface.own}`] : [],
      );
    });

    it(`${label} still takes ${surface.prefix}-solid from ConfigProvider`, () => {
      // The form is the only source this component has to ignore; a provider still speaks for everything
      // under it, `Button` included — it owns no default tier, but `k-btn-solid` is one it paints.
      const { container } = render(
        <ConfigProvider theme="solid">{surface.node({})}</ConfigProvider>,
      );
      expect(tiersOf(classesOf(container, `.${surface.prefix}`), surface.prefix)).toEqual([
        `${surface.prefix}-solid`,
      ]);
    });
  }

  // Sizes travel over the same two hooks, and a large form over a small provider is how the split shows on
  // something that is not a tier. The three controls spell "large" three ways (`-lg`, `-lg`, `-large`), which
  // is why each is named rather than matched by a pattern.
  it("sizes the controls it wraps and leaves the panels around them to the provider", () => {
    const { container } = render(
      <ConfigProvider size="small">
        <Form size="large" model={{ name: "" }}>
          <Input className="field" />
          <Select className="choice" options={OPTIONS} />
          <TextArea className="note" />
          <Switch className="toggle" />
          <Card className="panel" />
          <Button className="action">按钮</Button>
        </Form>
      </ConfigProvider>,
    );
    expect(classesOf(container, ".field")).toContain("k-input-lg");
    expect(classesOf(container, ".choice")).toContain("k-select-lg");
    expect(classesOf(container, ".note")).toContain("k-textarea-lg");
    // A switch has only the small spelling, so the form's `large` shows up as the provider's `small`
    // not reaching it.
    expect(classesOf(container, ".toggle")).not.toContain("k-switch-sm");
    for (const selector of [".panel", ".action"]) {
      const classes = classesOf(container, selector);
      expect(classes.some((cls) => /-(lg|large)\b/.test(cls))).toBe(false);
    }
    expect(classesOf(container, ".panel")).toContain("k-card-small");
    expect(classesOf(container, ".action")).toContain("k-btn-sm");
  });

  // Shapes travel the same two ways, and a form only normalises the corner of a surface: `circle` reaches
  // an input as the round box the input family ships, while the card and the button beside it keep the
  // square the provider asked for.
  it("shapes the controls it wraps and leaves the panels around them to the provider", () => {
    const { container } = render(
      <ConfigProvider shape="square">
        <Form shape="circle" model={{ name: "" }}>
          <Input className="field" />
          <Card className="panel" />
          <Button className="action">按钮</Button>
        </Form>
      </ConfigProvider>,
    );
    expect(classesOf(container, ".field")).toContain("k-input-circle");
    expect(classesOf(container, ".panel")).toContain("k-card-square");
    expect(classesOf(container, ".action")).toContain("k-btn-square");
  });
});

// `InputGroup` is the control-family wrapper those two tables do not cover. It owns one visual state —
// `k-input-group-fill`, which merges its addon boxes into the field — and its absence, which borders them,
// so every tier except `fill` paints the bordered state. The contract worth pinning is that the group
// always agrees with the field it wraps, because that is the only thing its border means.
// vue mirrors these cases with the tier arriving through `Input` rather than through the form: its
// `FormItem` hands its field to a marked field component in its own slot, and a wrapper is not one. Same
// visible result, one channel per tree — the cases here are what that side has to keep answering.
describe("InputGroup follows the tier its field is on", () => {
  const groupTiers = (container: HTMLElement) =>
    tiersOf(classesOf(container, ".k-input-group"), "k-input-group");

  const underProvider = (tier: ThemeType | undefined, groupProps: Record<string, unknown> = {}) =>
    render(
      <ConfigProvider {...(tier === undefined ? {} : { theme: tier })}>
        <InputGroup {...groupProps}>
          <Input />
        </InputGroup>
      </ConfigProvider>,
    ).container;

  const fieldWithAddon = (providerProps: Record<string, unknown>, formProps?: Record<string, unknown>) =>
    render(
      <ConfigProvider {...providerProps}>
        {formProps ? (
          <Form model={{ name: "" }} {...formProps}>
            <Input addonBefore="https://" />
          </Form>
        ) : (
          <Input addonBefore="https://" />
        )}
      </ConfigProvider>,
    ).container;

  it("stays on its own fill when nothing asks for a tier", () => {
    expect(groupTiers(underProvider(undefined))).toEqual(["k-input-group-fill"]);
  });

  for (const tier of TIERS.filter((name) => name !== "fill")) {
    it(`ConfigProvider theme="${tier}" borders the addon boxes`, () => {
      expect(groupTiers(underProvider(tier))).toEqual([]);
    });

    it(`ConfigProvider theme="${tier}" borders them on the group an Input builds`, () => {
      const container = fieldWithAddon({ theme: tier });
      expect(classesOf(container, ".k-input")).toContain(`k-input-${tier}`);
      expect(groupTiers(container)).toEqual([]);
    });
  }

  it("an explicit theme outranks the tier it is standing in", () => {
    expect(groupTiers(underProvider("outline", { theme: "fill" }))).toEqual(["k-input-group-fill"]);
    expect(groupTiers(underProvider("fill", { theme: "outline" }))).toEqual([]);
  });

  it("a form tier reaches it through the field it wraps", () => {
    const container = fieldWithAddon({}, { theme: "outline" });
    expect(classesOf(container, ".k-input")).toContain("k-input-outline");
    expect(groupTiers(container)).toEqual([]);
  });

  it("takes its size the same way, and hands it to the controls inside", () => {
    const container = fieldWithAddon({ size: "small" }, { size: "large" });
    expect(classesOf(container, ".k-input")).toContain("k-input-lg");
    expect(classesOf(container, ".k-input-group")).toContain("k-input-group-lg");

    // A provider sizes a bare group exactly as it sizes the control that would sit in it.
    const inherited = render(
      <ConfigProvider size="small">
        <InputGroup>
          <Button className="action">按钮</Button>
        </InputGroup>
      </ConfigProvider>,
    ).container;
    expect(classesOf(inherited, ".k-input-group")).toContain("k-input-group-sm");
    expect(classesOf(inherited, ".action")).toContain("k-btn-sm");

    // A size written on the group outranks the provider, and it is that resolved size the children inherit.
    const explicit = render(
      <ConfigProvider size="large">
        <InputGroup size="small">
          <Button className="action">按钮</Button>
        </InputGroup>
      </ConfigProvider>,
    ).container;
    expect(classesOf(explicit, ".k-input-group")).toContain("k-input-group-sm");
    expect(classesOf(explicit, ".action")).toContain("k-btn-sm");
  });
});
