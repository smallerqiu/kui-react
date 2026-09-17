import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { ReactElement } from "react";
import ConfigProvider from "../components/config";
import Button from "../components/button/button";
import ButtonGroup from "../components/button/button-group";
import Input from "../components/input/input";
import TextArea from "../components/input/textarea";
import InputNumber from "../components/input-number";
import Select from "../components/select/select";
import DatePicker from "../components/date-picker";
import Cascader from "../components/cascader";
import Tag from "../components/tag";
import Card from "../components/card";
import Table from "../components/table";
import Collapse from "../components/collapse/collapse";
import Descriptions from "../components/descriptions/descriptions";
import Form from "../components/form/form";
import FormItem from "../components/form/form-item";
import Space from "../components/space";
import Radio from "../components/radio/radio";
import RadioGroup from "../components/radio/radio-group";
import Switch from "../components/switch";
import Spin from "../components/spin";
import Page from "../components/page";
import Image from "../components/image/image";

function expectClasses(container: HTMLElement, selector: string, classes: string[]) {
  const element = container.querySelector(selector);
  expect(element, selector).not.toBeNull();
  for (const name of classes)
    expect(element!.classList.contains(name), `${selector}: ${name}`).toBe(true);
}

const cases: [string, ReactElement, string[]][] = [
  [".k-btn", <Button>Button</Button>, ["k-btn-sm", "k-btn-square", "k-btn-outline"]],
  [".k-input", <Input />, ["k-input-sm", "k-input-square"]],
  [".k-textarea", <TextArea />, ["k-textarea-sm", "k-textarea-square", "k-textarea-outline"]],
  [".k-input-number", <InputNumber />, ["k-input-number-sm", "k-input-number-square"]],
  [".k-select", <Select options={[]} />, ["k-select-sm", "k-select-square"]],
  [".k-datepicker", <DatePicker />, ["k-datepicker-sm", "k-datepicker-square"]],
  [".k-cascader", <Cascader options={[]} />, ["k-cascader-sm", "k-cascader-square"]],
  [".k-tag", <Tag>Tag</Tag>, ["k-tag-sm", "k-tag-square", "k-tag-outline"]],
  [".k-card", <Card>Card</Card>, ["k-card-small", "k-card-square", "k-card-outline"]],
  [".k-table", <Table />, ["k-table-sm", "k-table-square"]],
  [".k-switch", <Switch />, ["k-switch-sm", "k-switch-square"]],
  [".k-spin", <Spin />, ["k-spin-sm"]],
  [".k-page", <Page total={100} />, ["k-page-sm", "k-page-square", "k-page-outline"]],
  [".k-image", <Image />, ["k-image-square", "k-image-outline"]],
];

describe("ConfigProvider appearance", () => {
  it.each(cases)("provides supported appearance to %s", (selector, child, classes) => {
    const { container } = render(
      <ConfigProvider size="small" shape="square" theme="outline">
        {child}
      </ConfigProvider>,
    );
    expectClasses(container, selector, classes);
    expect(container.querySelector(selector)!.className).not.toMatch(
      /k-(input|input-number|select|datepicker|cascader)-fill/,
    );
  });

  it("updates inherited values and lets nested providers override individual properties", () => {
    const tree = (size: "small" | "large") => (
      <ConfigProvider size={size} theme="outline" shape="square">
        <Button className="outer">Outer</Button>
        <ConfigProvider theme="fill">
          <Input className="nested" />
          <Button className="explicit" size="medium" shape="round" theme="plain">
            Local
          </Button>
        </ConfigProvider>
      </ConfigProvider>
    );
    const { container, rerender } = render(tree("small"));
    expectClasses(container, ".outer", ["k-btn-sm", "k-btn-square", "k-btn-outline"]);
    expectClasses(container, ".nested", ["k-input-sm", "k-input-square", "k-input-fill"]);
    rerender(tree("large"));
    expectClasses(container, ".outer", ["k-btn-lg"]);
    expectClasses(container, ".nested", ["k-input-lg", "k-input-fill"]);
    expectClasses(container, ".explicit", ["k-btn-plain"]);
    expect(container.querySelector(".explicit")!.className).not.toMatch(
      /k-btn-(sm|lg|square|circle)/,
    );
  });

  it("keeps Form overrides above global defaults, including items without a field prop", () => {
    const { container } = render(
      <ConfigProvider size="small" shape="square" theme="outline">
        <Form size="large" shape="circle" theme="fill" model={{ name: "" }}>
          <FormItem prop="name">
            <Input className="bound" />
          </FormItem>
          <FormItem>
            <Input className="unbound" />
          </FormItem>
          <Button className="form-button">Submit</Button>
          <Input className="local" size="small" shape="square" theme="plain" />
        </Form>
      </ConfigProvider>,
    );
    for (const selector of [".bound", ".unbound"]) {
      expectClasses(container, selector, ["k-input-lg", "k-input-circle", "k-input-fill"]);
    }
    expectClasses(container, ".form-button", ["k-btn-lg", "k-btn-circle", "k-btn-fill"]);
    expectClasses(container, ".local", ["k-input-sm", "k-input-square", "k-input-plain"]);
  });

  it("preserves group and compact Space overrides without overriding explicit child props", () => {
    const { container } = render(
      <ConfigProvider size="small" shape="square">
        <ButtonGroup size="large" shape="circle">
          <Button className="group-child">Inherited group</Button>
          <Button className="local-child" size="small" shape="square">
            Local
          </Button>
        </ButtonGroup>
        <Space compact size="large">
          <Input className="space-child" />
        </Space>
        <RadioGroup size="large" theme="fill">
          <Radio className="radio-child" value="a" />
          <Radio className="radio-local" value="b" size="small" theme="outline" />
        </RadioGroup>
      </ConfigProvider>,
    );
    expectClasses(container, ".group-child", ["k-btn-lg", "k-btn-circle"]);
    expectClasses(container, ".local-child", ["k-btn-sm", "k-btn-square"]);
    expectClasses(container, ".space-child", ["k-input-lg"]);
    expectClasses(container, ".radio-child", ["k-radio-lg", "k-radio-fill"]);
    expectClasses(container, ".radio-local", ["k-radio-sm"]);
    expect(container.querySelector(".radio-local")!.classList.contains("k-radio-fill")).toBe(false);
  });

  it("normalizes circle to round for surface components", () => {
    const { container } = render(
      <ConfigProvider shape="circle">
        <Table />
        <Descriptions />
        <Collapse />
      </ConfigProvider>,
    );
    for (const component of ["table", "descriptions", "collapse"]) {
      expectClasses(container, `.k-${component}`, [`k-${component}-round`]);
    }
  });

  it("retains component defaults when no provider sets appearance", () => {
    const { container } = render(
      <>
        <Input />
        <Tag>Tag</Tag>
        <Card>Card</Card>
      </>,
    );
    expectClasses(container, ".k-input", ["k-input-fill"]);
    expectClasses(container, ".k-tag", ["k-tag-fill", "k-tag-sm"]);
    expectClasses(container, ".k-card", ["k-card-fill", "k-card-round", "k-card-medium"]);
  });
});
