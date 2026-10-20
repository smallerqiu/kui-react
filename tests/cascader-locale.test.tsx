import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Cascader, ConfigProvider, Select, type CascaderOption } from "react-kui";
import en from "../components/locale/en";
import zhCN from "../components/locale/zh-CN";

const options: CascaderOption[] = [{ label: "Zhejiang", value: "zhejiang" }];

/** 只改 `k.select.placeholder`，用来证明级联读的是选择框家族那一条文案，而不是自己写死的 */
const withPlaceholderText = (locale: typeof en, text: string) => ({
  ...locale,
  k: { ...locale.k, select: { ...locale.k.select, placeholder: text } },
});

const placeholder = (container: HTMLElement) =>
  container.querySelector(".k-cascader-placeholder")?.textContent;

describe("Cascader locale", () => {
  it("follows the language instead of a hardcoded hint", () => {
    const { container, rerender } = render(<Cascader options={options} />);

    // 没有 Provider 时读库级默认，也就是英文；写死的中文在英文界面会原样露出来
    expect(placeholder(container)).toBe("Select");

    rerender(
      <ConfigProvider locale={zhCN}>
        <Cascader options={options} />
      </ConfigProvider>,
    );
    expect(placeholder(container)).toBe("请选择");
  });

  it("shares k.select.placeholder with the other selector controls", () => {
    const locale = withPlaceholderText(en, "PICK ONE");
    const { container } = render(
      <ConfigProvider locale={locale}>
        <Cascader options={options} />
        <Select options={[]} />
      </ConfigProvider>,
    );

    expect(container.querySelector(".k-cascader-placeholder")?.textContent).toBe("PICK ONE");
    expect(container.querySelector(".k-select-placeholder")?.textContent).toBe("PICK ONE");
  });

  it("keeps an explicit placeholder above the locale", () => {
    const { container } = render(
      <ConfigProvider locale={zhCN}>
        <Cascader options={options} placeholder="Choose a region" />
      </ConfigProvider>,
    );

    expect(placeholder(container)).toBe("Choose a region");
  });
});
