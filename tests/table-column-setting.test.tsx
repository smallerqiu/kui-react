import { fireEvent, render, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TableColumnSetting, type Column } from "react-kui";

describe("TableColumnSetting", () => {
  it("lists leaf columns nested under a grouped header", async () => {
    const onHiddenKeysChange = vi.fn();
    const columns: Column[] = [
      { key: "name", title: "Name" },
      {
        key: "profile",
        title: "Profile",
        children: [
          { key: "age", title: "Age" },
          { key: "city", title: "City" },
        ],
      },
    ];
    render(
      <TableColumnSetting
        columns={columns}
        hiddenKeys={[]}
        disabledKeys={["name"]}
        onHiddenKeysChange={onHiddenKeysChange}
      />,
    );
    // 触发按钮的文案归语言包管（见 tests/table-locale.test.tsx），这里只关心点击后面板里列出了什么
    fireEvent.click(document.querySelector("button") as HTMLElement);
    await waitFor(() =>
      expect(document.querySelector(".k-table-column-setting input")).not.toBeNull(),
    );

    // 分组表头本身不可勾选，但它下面的叶子列必须出现在面板里（与 kui-vue 一致）
    expect(
      Array.from(document.querySelectorAll(".k-table-column-setting label")).map((label) =>
        String(label.textContent),
      ),
    ).toEqual(["Age", "City"]);

    fireEvent.click(
      document.querySelectorAll<HTMLInputElement>(".k-table-column-setting input")[0],
    );
    expect(onHiddenKeysChange).toHaveBeenCalledWith(["age"]);
  });
});
