import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ConfigProvider from "../components/config";
import DatePicker from "../components/date-picker";
import Select from "../components/select/select";
import zhCN from "../components/locale/zh-CN";

/**
 * 库级默认语言是英语。
 * 以前这件事没有出处：16 处 `config?.locale || zhCN` 各写各的，文档却写着"默认英语"
 * （而 dayjs 的中文语言包也从没注册过，月份和星期本来就是英文），两头对不上。
 * 现在默认值只有 `DEFAULT_LOCALE` 一个出处，所以这条用例管两件事：
 * 不带 Provider 时组件吐英文，以及没有任何组件源码再把兜底偷偷写回中文。
 */

const componentSources = (() => {
  const files: string[] = [];
  readdirSync(join(process.cwd(), "components"), { recursive: true, withFileTypes: true }).forEach(
    (entry) => {
      if (!entry.isFile() || !/\.(tsx|ts)$/.test(entry.name)) return;
      const relative = entry.parentPath;
      // demo 里引中文语言包是演示用法本身，locale/ 目录就是语言包，都不算兜底。
      if (/\/demo$/.test(relative) || relative.endsWith("components/locale")) return;
      files.push(join(relative, entry.name));
    },
  );
  return files;
})();

describe("Default locale", () => {
  it("renders English text when no ConfigProvider is mounted", () => {
    const { container } = render(
      <>
        <DatePicker />
        <Select options={[]} />
      </>,
    );
    expect(container.querySelector<HTMLInputElement>(".k-datepicker-input")!.placeholder).toBe(
      "Select date",
    );
    expect(container.querySelector(".k-select-selection")!.textContent).toBe("Select");
  });

  it("still follows the locale a ConfigProvider registers", () => {
    const { container } = render(
      <ConfigProvider locale={zhCN}>
        <DatePicker />
        <Select options={[]} />
      </ConfigProvider>,
    );
    expect(container.querySelector<HTMLInputElement>(".k-datepicker-input")!.placeholder).toBe(
      "请选择日期",
    );
    expect(container.querySelector(".k-select-selection")!.textContent).toBe("请选择");
  });

  it("keeps every locale fallback on the shared default", () => {
    const offenders = componentSources
      .map((file) => [file, readFileSync(file, "utf8")] as const)
      .filter(([, source]) => /locale\/zh-CN/.test(source))
      .map(([file]) => file);

    expect(offenders).toEqual([]);
  });
});
