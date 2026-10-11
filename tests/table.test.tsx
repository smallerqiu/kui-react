import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Table, type Column, type TableKey } from "react-kui";

interface Row {
  key: number;
  name: string;
  age: number;
}

interface TreeRow {
  id: string;
  name: string;
  children?: TreeRow[];
}

const data: Row[] = [
  { key: 1, name: "Alice", age: 28 },
  { key: 2, name: "Bob", age: 32 },
  { key: 3, name: "Carol", age: 36 },
];

describe("Table Vue parity", () => {
  it("keeps grouped headers consistent when a child column is hidden", () => {
    const columns: Column<Row>[] = [
      {
        key: "profile",
        title: "Profile",
        children: [
          { key: "name", title: "Name" },
          { key: "age", title: "Age" },
        ],
      },
    ];
    const { container } = render(
      <Table data={data} columns={columns} hiddenColumnKeys={["age"]} />,
    );

    expect(container.querySelectorAll("thead tr")).toHaveLength(2);
    expect(container.querySelector("thead")?.textContent).toContain("Profile");
    expect(container.querySelector("thead")?.textContent).toContain("Name");
    expect(container.querySelector("thead")?.textContent).not.toContain("Age");
    expect(container.querySelector("thead th")?.getAttribute("colspan")).toBe("1");
  });

  it("marks virtual rows so striped backgrounds stay aligned", () => {
    const columns: Column<Row>[] = [
      { key: "name", title: "Name" },
      { key: "age", title: "Age", fixed: "right" },
    ];
    const { container } = render(
      <Table virtual striped data={data} columns={columns} scroll={{ y: 200 }} />,
    );

    expect(container.querySelector(".k-table")?.classList.contains("k-table-virtual")).toBe(true);
    expect(container.querySelectorAll("tbody .k-table-row-even")).toHaveLength(1);
  });

  it("does not render cells whose rowSpan or colSpan is zero", () => {
    const columns: Column<Row>[] = [
      { key: "name", title: "Name", colSpan: (_, index) => (index === 0 ? 0 : 1) },
      { key: "age", title: "Age" },
    ];
    const { container } = render(<Table data={data} columns={columns} />);
    const firstRow = container.querySelector("tbody tr");

    expect(firstRow?.textContent).not.toContain("Alice");
    expect(firstRow?.textContent).toContain("28");
  });

  it("keeps the header in its own table while the body scrolls", () => {
    const columns: Column<Row>[] = [
      { key: "name", title: "Name" },
      { key: "age", title: "Age" },
    ];
    const { container, rerender } = render(<Table data={data} columns={columns} />);
    const body = container.querySelector(".k-table-body");

    // 没有 scroll.y 时整张表还是一个 table，表头就在滚动容器里——不该多出容器、id 或滚动条宽度变量
    expect(container.querySelectorAll("table")).toHaveLength(1);
    expect(body?.querySelector("thead")).not.toBeNull();
    expect(container.querySelector(".k-table-thead")).toBeNull();
    expect(container.querySelector(".k-table-thead-inner")).toBeNull();
    expect(container.querySelector(".k-table")?.classList.contains("k-table-split-header")).toBe(
      false,
    );
    expect([...container.querySelectorAll("thead th")].every((th) => !th.id)).toBe(true);
    expect(
      [...container.querySelectorAll("tbody td")].every(
        (td) => !td.hasAttribute("aria-labelledby"),
      ),
    ).toBe(true);
    expect(
      container
        .querySelector<HTMLElement>(".k-table")
        ?.style.getPropertyValue("--k-table-scrollbar-width"),
    ).toBe("");

    rerender(<Table data={data} columns={columns} scroll={{ y: 200 }} />);
    const head = container.querySelector(".k-table-thead");
    const rows = container.querySelectorAll(".k-table-body tbody tr");

    expect(container.querySelectorAll("table")).toHaveLength(2);
    expect(head?.querySelector("thead")).not.toBeNull();
    expect(head?.querySelector("tbody")).toBeNull();
    // 分栏表头分内外两层：外层用 `padding-inline-end` 让出表体滚动条的槽位，裁剪只能放在内层
    // （`overflow: hidden` 只裁到 padding box，裁在外层会连槽位一起被表头内容画穿）。
    // 这一层结构变了，`styles/index.less` 里 `> .k-table-thead-inner` 和同步 `scrollLeft` 的目标就同时失效。
    expect(head?.querySelector(":scope > .k-table-thead-inner > table")).not.toBeNull();
    expect(container.querySelector(".k-table-body thead")).toBeNull();
    expect(container.querySelector(".k-table")?.classList.contains("k-table-split-header")).toBe(
      true,
    );
    expect(rows).toHaveLength(data.length);

    // 两张 table 共用同一份 colgroup，列宽与固定列偏移才可能逐像素对齐
    expect(
      [...container.querySelectorAll<HTMLElement>("colgroup col")].map((col) => col.style.width),
    ).toEqual(["auto", "auto", "auto", "auto"]);

    // 表体格和表头格之间不再有结构关系，列名靠 id 关联回去。
    // 断言只认"这一格指过去的那一格确实存在、而且标题就是这个列"，不锁具体 id 字符串。
    const firstRowCells = [
      ...container.querySelectorAll<HTMLTableCellElement>(".k-table-body tbody tr:first-child td"),
    ];
    expect(firstRowCells).toHaveLength(columns.length);
    firstRowCells.forEach((cell, index) => {
      const labelledBy = cell.getAttribute("aria-labelledby");
      expect(labelledBy).toBeTruthy();
      // id 只含 [a-zA-Z0-9_-]（组件里洗过），属性选择器可以直接用
      const headerCell = container.querySelector(`[id="${labelledBy}"]`);
      expect(headerCell?.tagName).toBe("TH");
      expect(headerCell?.textContent).toBe(columns[index].title);
    });

    // 多个 table 时 id 必须还在整个文档里唯一，否则 aria-labelledby 会指到别的表上
    const ids = [...container.querySelectorAll("[id]")].map((node) => node.id);
    expect(new Set(ids).size).toBe(ids.length);

    // 槽位宽度是实测出来的：jsdom 里没有真实滚动条，只要求"写成 px 且非空"，
    // 真机上这条决定表头容器和表体内容盒等宽。
    expect(
      container
        .querySelector<HTMLElement>(".k-table")
        ?.style.getPropertyValue("--k-table-scrollbar-width"),
    ).toMatch(/^[\d.]+px$/);
  });

  it("keeps default fixed column widths aligned with sticky offsets", () => {
    const columns: Column<Row>[] = [
      { key: "name", title: "Name", fixed: "left" },
      { key: "age", title: "Age", fixed: "left" },
      { key: "action", title: "Operate", fixed: "right", render: () => "Edit" },
      { key: "action2", title: "More", fixed: "right", render: () => "More" },
    ];
    const { container } = render(<Table data={data} columns={columns} scroll={{ y: 200 }} />);
    const cols = container.querySelectorAll<HTMLTableColElement>(".k-table-body col");
    const headers = container.querySelectorAll<HTMLTableCellElement>(".k-table-thead th");

    expect(cols[0].style.width).toBe("150px");
    expect(cols[1].style.width).toBe("150px");
    expect(headers[0].style.left).toBe("0px");
    expect(headers[1].style.left).toBe("150px");
    expect(container.querySelectorAll(".k-table-thead .k-table-cell-fix-right-first")).toHaveLength(
      1,
    );
  });

  it("uses one width basis for colgroup and sticky offsets", () => {
    const columns: Column<Row>[] = [
      { key: "name", title: "Name", fixed: "left" },
      { key: "age", title: "Age", fixed: "left", width: 220 },
      { key: "key", title: "Id" },
    ];
    const { container } = render(
      <Table data={data} columns={columns} checkable scroll={{ x: 1_200, y: 200 }} />,
    );
    const cols = container.querySelectorAll<HTMLTableColElement>(".k-table-body col");
    const headers = container.querySelectorAll<HTMLTableCellElement>(".k-table-thead th");

    // 勾选列、固定列的确切宽度、非固定列交给 auto 吸收多余宽度
    expect(cols[0].style.width).toBe("50px");
    expect(cols[1].style.width).toBe("150px");
    expect(cols[2].style.width).toBe("220px");
    expect(cols[3].style.width).toBe("auto");
    // 偏移必须逐段等于上一列的渲染宽度，否则横向滚动时固定列之间会露缝/重叠
    expect(headers[1].style.left).toBe("50px");
    expect(headers[2].style.left).toBe("200px");
  });

  // 真机回归：普通列声明了宽度却被写成 auto，会在 table-layout: fixed 下被固定列挤成 0 宽，
  // 横向可滚范围一起消失，固定列就"看着没生效"。
  it("keeps declared widths on non-fixed columns so fixed columns keep a scroll range", () => {
    const columns: Column<Row>[] = [
      { key: "name", title: "Name", fixed: "left", width: 120 },
      { key: "age", title: "Age", width: 150 },
      { key: "key", title: "Id" },
      { key: "action", title: "Operate", fixed: "right", render: () => "Edit" },
    ];
    const { container } = render(
      <Table data={data} columns={columns} checkable scroll={{ x: 1_200, y: 200 }} />,
    );
    const cols = container.querySelectorAll<HTMLTableColElement>(".k-table-body col");

    // 勾选列 50、声明过宽度的列照原值、只有没写宽度的普通列才是 auto
    expect([...cols].map((col) => col.style.width)).toEqual([
      "50px",
      "120px",
      "150px",
      "auto",
      "150px",
    ]);

    const headers = container.querySelectorAll<HTMLTableCellElement>(".k-table-thead th");
    // 左偏移把勾选列也算进去，右固定列贴着右边缘
    expect(headers[1].style.left).toBe("50px");
    expect(headers[4].style.right).toBe("0px");
  });

  it("makes a grouped parent column's fixed cover its whole leaf range", () => {
    const columns: Column<Row>[] = [
      {
        key: "group",
        title: "Group",
        fixed: "left",
        children: [
          { key: "name", title: "Name" },
          { key: "age", title: "Age", width: 100 },
        ],
      },
      { key: "key", title: "Id" },
      {
        key: "right",
        title: "Right",
        fixed: "right",
        children: [
          { key: "action", title: "Operate", render: () => "Edit" },
          { key: "more", title: "More", width: 80 },
        ],
      },
    ];
    const { container } = render(<Table data={data} columns={columns} scroll={{ y: 200 }} />);
    const headerRows = container.querySelectorAll<HTMLTableRowElement>(".k-table-thead tr");
    // 每格同时看方向、偏移和固定类：少一格偏移或父格没被标成固定列都说明继承没生效
    const cellsOf = (row: HTMLTableRowElement) =>
      [...row.children].map((node) => {
        const cell = node as HTMLTableCellElement;
        return {
          text: cell.textContent ?? "",
          position: cell.style.position,
          left: cell.style.left,
          right: cell.style.right,
          classes: [...cell.classList].filter((name) => name.startsWith("k-table-cell-fix")),
        };
      });

    expect(headerRows).toHaveLength(2);
    expect(cellsOf(headerRows[0])).toEqual([
      {
        text: "Group",
        position: "sticky",
        left: "0px",
        right: "",
        classes: ["k-table-cell-fix-left", "k-table-cell-fix-left-last"],
      },
      { text: "Id", position: "", left: "", right: "", classes: [] },
      {
        text: "Right",
        position: "sticky",
        left: "",
        right: "0px",
        classes: ["k-table-cell-fix-right", "k-table-cell-fix-right-first"],
      },
    ]);
    expect(cellsOf(headerRows[1])).toEqual([
      {
        text: "Name",
        position: "sticky",
        left: "0px",
        right: "",
        classes: ["k-table-cell-fix-left"],
      },
      {
        text: "Age",
        position: "sticky",
        left: "150px",
        right: "",
        classes: ["k-table-cell-fix-left", "k-table-cell-fix-left-last"],
      },
      {
        text: "Operate",
        position: "sticky",
        left: "",
        right: "80px",
        classes: ["k-table-cell-fix-right", "k-table-cell-fix-right-first"],
      },
      {
        text: "More",
        position: "sticky",
        left: "",
        right: "0px",
        classes: ["k-table-cell-fix-right"],
      },
    ]);

    // 叶子列拿到继承的宽度与方向，所以 colgroup 和表体单元格一起跟着固定
    expect(
      [...container.querySelectorAll<HTMLTableColElement>(".k-table-body col")].map(
        (col) => col.style.width,
      ),
    ).toEqual(["150px", "100px", "auto", "150px", "80px"]);
    const bodyCells = [
      ...container.querySelectorAll<HTMLTableCellElement>(".k-table-body tbody tr:first-child td"),
    ];
    expect(bodyCells.map((cell) => cell.style.left)).toEqual(["0px", "150px", "", "", ""]);
    expect(bodyCells.map((cell) => cell.style.right)).toEqual(["", "", "", "80px", "0px"]);
  });

  it("keeps the bordered right edge on cells that only end their own row", () => {
    const columns: Column<Row>[] = [
      { key: "name", title: "Name", width: 120, fixed: "left" },
      {
        key: "other",
        title: "Other",
        children: [
          {
            key: "address",
            title: "Address",
            children: [
              { key: "street", title: "Street" },
              // 合并让第二行的行末格停在中间列上：它仍然是 `:last-child`，但并不是最后一列
              { key: "block", title: "Block", rowSpan: (_record, row) => (row === 0 ? 2 : 1) },
            ],
          },
        ],
      },
      {
        key: "gender",
        title: "Gender",
        width: 100,
        fixed: "right",
        rowSpan: (_record, row) => (row === 0 ? 2 : 1),
      },
    ];
    const { container } = render(<Table data={data} columns={columns} bordered />);
    const marked = (cell: Element) => cell.classList.contains("k-table-cell-last-column");
    // bordered 的右边框只由"真的盖到最后一列"的格子让出，外侧那条由滚动容器补。
    // 分组表头每一行的格数不同，行末那一格（Address / Block）必须保留分隔线。
    const headerRows = container.querySelectorAll<HTMLTableRowElement>(".k-table-body thead tr");
    expect([...headerRows].map((row) => [...row.children].map(marked))).toEqual([
      [false, false, true],
      [false],
      [false, false],
    ]);
    const bodyRows = container.querySelectorAll<HTMLTableRowElement>(".k-table-body tbody tr");
    expect([...bodyRows].map((row) => [...row.children].map(marked))).toEqual([
      [false, false, false, true],
      [false, false],
      [false, false, false, true],
    ]);
  });

  it("does not show the empty state while loading", () => {
    const columns: Column<Row>[] = [{ key: "name", title: "Name" }];
    const { container, rerender } = render(<Table data={[]} columns={columns} loading />);

    expect(container.querySelector(".k-empty")).toBeNull();
    expect(container.querySelector(".k-table-loading-placeholder")).not.toBeNull();

    rerender(<Table data={[]} columns={columns} loading={false} />);
    expect(container.querySelector(".k-empty")).not.toBeNull();
    expect(container.querySelector(".k-table-loading-placeholder")).toBeNull();
  });

  it("supports keyboard sorting and exposes the current sort direction", () => {
    const rows: Row[] = [
      { key: 1, name: "Beta", age: 30 },
      { key: 2, name: "Alpha", age: 25 },
    ];
    const columns: Column<Row>[] = [
      { key: "name", title: "Name", sorter: true },
      { key: "age", title: "Age" },
    ];
    const { container } = render(<Table data={rows} columns={columns} />);
    const [sortable, plain] = Array.from(container.querySelectorAll("thead th"));
    const names = () =>
      Array.from(container.querySelectorAll("tbody tr")).map(
        (tr) => tr.querySelector("td")?.textContent,
      );

    expect(sortable.getAttribute("tabindex")).toBe("0");
    expect(sortable.getAttribute("aria-sort")).toBe("none");
    // 不可排序的表头既不能聚焦也不该声明 aria-sort
    expect(plain.hasAttribute("tabindex")).toBe(false);
    expect(plain.hasAttribute("aria-sort")).toBe(false);

    fireEvent.keyDown(sortable, { key: "Enter" });
    expect(sortable.getAttribute("aria-sort")).toBe("ascending");
    expect(names()).toEqual(["Alpha", "Beta"]);

    fireEvent.keyDown(sortable, { key: " " });
    expect(sortable.getAttribute("aria-sort")).toBe("descending");
    expect(names()).toEqual(["Beta", "Alpha"]);

    // 三态循环：descending 之后再排一次回到 none
    fireEvent.keyDown(sortable, { key: "Enter" });
    expect(sortable.getAttribute("aria-sort")).toBe("none");

    // 不可排序的表头上按键盘不会改动排序
    fireEvent.click(plain);
    fireEvent.keyDown(plain, { key: "Enter" });
    expect(sortable.getAttribute("aria-sort")).toBe("none");
  });

  it("sorts with the shared comparator so both frameworks agree", () => {
    const rows = [
      { key: 1, n: "10" },
      { key: 2, n: "9" },
      { key: 3, n: 1 },
      { key: 4, n: null },
    ] as never[];
    const { container } = render(
      <Table data={rows} columns={[{ key: "n", title: "N", sorter: true }] as Column[]} />,
    );
    const order = () =>
      Array.from(container.querySelectorAll("tbody td")).map((td) => td.textContent);

    fireEvent.click(container.querySelector("thead th")!);
    expect(order()).toEqual(["", "1", "9", "10"]);

    fireEvent.click(container.querySelector("thead th")!);
    expect(order()).toEqual(["10", "9", "1", ""]);
  });

  it("reads cell values and sort values through dotted column keys", () => {
    // 单元格取值与排序取值都走同一个 getRecordValue：整名优先，其次按 `.` 下钻，中途遇到 null 不抛错。
    interface NestedRow {
      key: string;
      user: { name: string } | null;
      tags?: string[];
    }
    const nested: NestedRow[] = [
      { key: "r1", user: { name: "Carol" }, tags: ["t1", "z"] },
      { key: "r2", user: { name: "Ann" }, tags: ["t1"] },
      { key: "r3", user: null },
    ];
    const columns: Column<NestedRow>[] = [
      { key: "user.name", title: "Name", sorter: true },
      { key: "tags.1", title: "Tag" },
      { key: "constructor.name", title: "Proto" },
    ];
    const { container } = render(<Table data={nested} columns={columns} rowKey="key" />);
    const cells = () =>
      Array.from(container.querySelectorAll("tbody tr")).map((tr) =>
        Array.from(tr.querySelectorAll("td")).map((td) => td.textContent),
      );

    expect(cells()).toEqual([
      ["Carol", "z", ""],
      ["Ann", "", ""],
      ["", "", ""],
    ]);

    // 排序同样按路径取值：r3 的 user 是 null，取到空串排在最前
    fireEvent.click(container.querySelector("thead th")!);
    expect(cells()).toEqual([
      ["", "", ""],
      ["Ann", "", ""],
      ["Carol", "z", ""],
    ]);
  });

  it("uses the same dotted reader for rowKey and childrenColumnName", () => {
    interface NestedTreeRow {
      meta: { uid: string };
      name: string;
      rows?: { items: NestedTreeRow[] };
    }
    const parent: NestedTreeRow = {
      meta: { uid: "p1" },
      name: "Parent 1",
      rows: { items: [{ meta: { uid: "p1c" }, name: "Child 1" }] },
    };
    const columns: Column<NestedTreeRow>[] = [{ key: "name", title: "Name" }];
    const renderTable = (data: NestedTreeRow[]) => (
      <Table
        data={data}
        columns={columns}
        rowKey="meta.uid"
        childrenColumnName="rows.items"
        expandAllRows
      />
    );
    const { container, rerender } = render(renderTable([parent]));
    const rows = () =>
      Array.from(container.querySelectorAll("tbody tr")).map((tr) => tr.textContent);

    expect(rows()).toEqual(["Parent 1", "Child 1"]);

    fireEvent.click(container.querySelector(".k-table-tree-toggle")!);
    expect(rows()).toEqual(["Parent 1"]);

    // 换一份"路径相同、取值相同"的新记录重新渲染：rowKey 按路径解析出的 key 仍然稳定，
    // 折叠过的父行不会被当成新增父行重新展开（路径走不通会退回 WeakMap 合成 key，这里就会失败）。
    rerender(renderTable([{ ...parent }]));
    expect(rows()).toEqual(["Parent 1"]);
  });

  it("ignores scroll events bubbled up from a scroller inside a cell", async () => {
    const many = Array.from({ length: 200 }, (_, index) => ({
      key: `k${index}`,
      name: `Row ${index}`,
    }));
    const { container } = render(
      <Table
        data={many}
        columns={[{ key: "name", title: "Name" }] as Column[]}
        virtual
        scroll={{ y: 200 }}
        itemHeight={40}
        overscan={2}
      />,
    );
    const body = container.querySelector(".k-table-body") as HTMLDivElement;
    Object.defineProperty(body, "clientHeight", { value: 200, configurable: true });
    const visibleRows = () =>
      Array.from(container.querySelectorAll("tbody tr:not(.k-table-virtual-spacer)")).map(
        (row) => row.textContent,
      );
    fireEvent.scroll(body);
    const before = visibleRows();
    expect(before.length).toBeGreaterThan(0);

    const inner = document.createElement("div");
    for (const [property, value] of Object.entries({
      scrollTop: 4000,
      scrollLeft: 4000,
      scrollWidth: 5000,
      clientWidth: 100,
    })) {
      Object.defineProperty(inner, property, { value, configurable: true });
    }
    body.appendChild(inner);
    inner.dispatchEvent(new Event("scroll", { bubbles: true }));
    await new Promise((resolve) => requestAnimationFrame(resolve));

    // 内层滚动条的位置不能改写虚拟窗口
    expect(visibleRows()).toEqual(before);
  });

  it("keeps rendering the tail window when the virtual body scrolls past its content", async () => {
    // jsdom 没有布局：挂载前把 clientHeight 固定成 200，表格才能量到视口高度
    Object.defineProperty(HTMLElement.prototype, "clientHeight", {
      configurable: true,
      value: 200,
    });
    try {
      const many = Array.from({ length: 200 }, (_, index) => ({
        key: `k${index}`,
        name: `Row ${index}`,
      }));
      const { container } = render(
        <Table
          data={many}
          columns={[{ key: "name", title: "Name" }] as Column[]}
          virtual
          scroll={{ y: 200 }}
          itemHeight={40}
          overscan={2}
        />,
      );
      const body = container.querySelector(".k-table-body") as HTMLDivElement;
      Object.defineProperty(body, "scrollTop", { configurable: true, value: 1_000_000 });
      const visibleRows = () =>
        Array.from(container.querySelectorAll("tbody tr:not(.k-table-virtual-spacer)")).map(
          (row) => row.textContent,
        );

      fireEvent.scroll(body);
      await new Promise((resolve) => requestAnimationFrame(resolve));

      // 越界滚动只能贴到最后一屏，不能把 tbody 清空
      expect(visibleRows().length).toBeGreaterThan(0);
      expect(visibleRows().join(" ")).toContain("Row 199");
    } finally {
      Reflect.deleteProperty(HTMLElement.prototype, "clientHeight");
    }
  });

  it("locks the known limitation that a virtual window drops merged cells whose anchor row scrolled out", async () => {
    // 文档写明虚拟模式不与行合并同时使用，这里锁定实际行为而不是崩溃：
    // 锚点行落在窗口外时，被它覆盖的那一行会少渲染一格（整行左移一列）。
    // kui-vue 有同名用例断言同一份结果，两边行为必须一致。
    Object.defineProperty(HTMLElement.prototype, "clientHeight", {
      configurable: true,
      value: 200,
    });
    try {
      const rows = Array.from({ length: 20 }, (_, index) => ({
        key: index,
        name: `Row ${index}`,
      })) as never[];
      const columns: Column[] = [
        {
          key: "key",
          title: "Group",
          rowSpan: (_record, index) => (index % 3 === 0 ? 3 : 0),
        },
        { key: "name", title: "Name" },
      ];
      const { container } = render(
        <Table
          data={rows}
          columns={columns}
          virtual
          scroll={{ y: 200 }}
          itemHeight={40}
          overscan={2}
        />,
      );
      const body = container.querySelector(".k-table-body") as HTMLDivElement;

      // 窗口顶部：锚点行 0 在窗口内，每行都是两格或一格（被覆盖的行）
      const cellCounts = () =>
        Array.from(container.querySelectorAll("tbody tr:not(.k-table-virtual-spacer)")).map(
          (row) => row.querySelectorAll("td").length,
        );
      expect(cellCounts().slice(0, 3)).toEqual([2, 1, 1]);

      Object.defineProperty(body, "scrollTop", { configurable: true, value: 400 });
      fireEvent.scroll(body);
      await new Promise((resolve) => requestAnimationFrame(resolve));

      const counts = cellCounts();
      // 窗口起点是第 8 行，它被第 6 行的锚点覆盖，而锚点已经不在窗口里 → 这一行只剩一格，
      // 名称格顶到了分组列的位置（整行左移一列），窗口里第一个合并格出现在第二行。
      expect(counts[0]).toBe(1);
      expect(counts[1]).toBe(2);
      const windowRows = Array.from(
        container.querySelectorAll("tbody tr:not(.k-table-virtual-spacer)"),
      );
      expect(windowRows[0].firstElementChild?.textContent).toBe("Row 8");
      expect(windowRows[0].querySelector("[rowspan]")).toBeNull();
      expect(windowRows[1].querySelector("[rowspan]")?.getAttribute("rowspan")).toBe("3");
    } finally {
      Reflect.deleteProperty(HTMLElement.prototype, "clientHeight");
    }
  });

  it("gives rows without a usable rowKey distinct, stable keys", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const rows = [{ name: "Alice" }, { name: "Bob" }, { name: "Carol" }] as never[];
    const columns: Column[] = [{ key: "name", title: "Name" }];
    const { container, rerender } = render(<Table data={rows} columns={columns} checkable />);
    const boxes = () =>
      Array.from(container.querySelectorAll<HTMLInputElement>("tbody input[type=checkbox]"));

    expect(boxes()).toHaveLength(3);
    fireEvent.click(boxes()[1]);

    // 兜底 key 必须逐行不同，否则勾选一行等于勾选全部
    expect(boxes().map((box) => box.checked)).toEqual([false, true, false]);
    expect(error.mock.calls.flat().join(" ")).not.toContain("the same key");
    // 缺 rowKey 只提示一次，避免大表格刷屏
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls.flat().join(" ")).toContain("rowKey");

    // 同一批记录对象换个数组引用重新渲染，key 不变，勾选状态不漂移
    rerender(<Table data={[...rows]} columns={columns} checkable />);
    expect(boxes().map((box) => box.checked)).toEqual([false, true, false]);

    warn.mockRestore();
    error.mockRestore();
  });

  it("uses a rowKey function for selection and tree expansion", () => {
    const data: TreeRow[] = [
      { id: "p1", name: "Parent row", children: [{ id: "c1", name: "Child row" }] },
    ];
    const columns: Column<TreeRow>[] = [{ key: "name", title: "Name" }];
    const expanded: TableKey[][] = [];
    const selected: TableKey[][] = [];
    const { container } = render(
      <Table
        data={data}
        columns={columns}
        checkable
        rowKey={(record) => record.id}
        onExpandedKeysChange={(keys) => expanded.push(keys)}
        onSelectedKeysChange={(keys) => selected.push(keys)}
      />,
    );

    expect(container.textContent).not.toContain("Child row");
    fireEvent.click(container.querySelector(".k-table-tree-toggle")!);
    expect(container.textContent).toContain("Child row");
    expect(expanded.at(-1)).toEqual(["p1"]);

    fireEvent.click(container.querySelector("tbody input")!);
    expect(selected.at(-1)).toEqual(["p1"]);
  });

  it("expands parent rows that arrive later without undoing manual collapses", () => {
    const parent1: TreeRow = {
      id: "p1",
      name: "Parent 1",
      children: [{ id: "p1c", name: "Child 1" }],
    };
    const parent2: TreeRow = {
      id: "p2",
      name: "Parent 2",
      children: [{ id: "p2c", name: "Child 2" }],
    };
    const columns: Column<TreeRow>[] = [{ key: "name", title: "Name" }];
    const { container, rerender } = render(
      <Table data={[parent1]} columns={columns} expandAllRows rowKey="id" />,
    );
    const rows = () =>
      Array.from(container.querySelectorAll("tbody tr")).map((tr) => tr.textContent);

    expect(rows()).toEqual(["Parent 1", "Child 1"]);

    // 用户手动折叠第一行
    fireEvent.click(container.querySelector(".k-table-tree-toggle")!);
    expect(rows()).toEqual(["Parent 1"]);

    // 异步数据到达：新增的父行自动展开，用户折叠过的行保持折叠
    rerender(<Table data={[parent1, parent2]} columns={columns} expandAllRows rowKey="id" />);
    expect(rows()).toEqual(["Parent 1", "Parent 2", "Child 2"]);

    // 同样的内容换一个新数组引用重新渲染，不应该再把 p1 展开
    rerender(<Table data={[parent1, parent2]} columns={columns} expandAllRows rowKey="id" />);
    expect(rows()).toEqual(["Parent 1", "Parent 2", "Child 2"]);

    // 作者定的语义：p1 从数据里消失再回来算"新增父行"，不记住它曾被手动折叠过
    rerender(<Table data={[parent2]} columns={columns} expandAllRows rowKey="id" />);
    expect(rows()).toEqual(["Parent 2", "Child 2"]);
    rerender(<Table data={[parent2, parent1]} columns={columns} expandAllRows rowKey="id" />);
    expect(rows()).toEqual(["Parent 2", "Child 2", "Parent 1", "Child 1"]);
  });

  it("does not re-walk the whole data set when an unrelated prop changes", () => {
    // 树形数据：rows 每次重算要给 200 个父行取 key，全选状态每次重算要遍历 400 条记录，
    // 所以只要 memo 链断一环，getKey 的调用次数就会跳到几百以上。
    const many: TreeRow[] = Array.from({ length: 200 }, (_, index) => ({
      id: `p${index}`,
      name: `Parent ${index}`,
      children: [{ id: `c${index}`, name: `Child ${index}` }],
    }));
    const columns: Column<TreeRow>[] = [{ key: "name", title: "Name" }];
    const getKey = vi.fn((record: TreeRow) => record.id);
    const props = {
      data: many,
      columns,
      rowKey: getKey,
      virtual: true,
      checkable: true,
      scroll: { y: 200 },
      itemHeight: 40,
    } as const;
    const { container, rerender } = render(<Table {...props} />);
    const rendered = () =>
      container.querySelectorAll("tbody tr:not(.k-table-virtual-spacer)").length;

    // 虚拟窗口只铺一小截，400 条记录不可能都渲染
    expect(rendered()).toBeLessThanOrEqual(20);
    // 挂载时确实把整棵树走了一遍（扁平化 + 全选状态）
    expect(getKey.mock.calls.length).toBeGreaterThan(500);

    const afterMount = getKey.mock.calls.length;
    rerender(<Table {...props} className="unrelated" />);

    // 无关重渲染只许按窗口里那十几行取 key（每行 key + 勾选 + 展开按钮各一次）
    expect(getKey.mock.calls.length - afterMount).toBeLessThan(120);
  });

  it("does not rebuild the merge matrix on unrelated re-renders", () => {
    const rows: Row[] = [
      { key: 1, name: "Alice", age: 28 },
      { key: 2, name: "Bob", age: 32 },
      { key: 3, name: "Carol", age: 36 },
    ];
    const rowSpan = vi.fn(() => 1);
    const columns: Column<Row>[] = [
      { key: "name", title: "Name", rowSpan },
      { key: "age", title: "Age" },
    ];
    const { rerender } = render(<Table data={rows} columns={columns} />);

    expect(rowSpan).toHaveBeenCalledTimes(rows.length);

    rerender(<Table data={rows} columns={columns} className="unrelated" />);
    // 合并矩阵以 rows 的引用为键，rows 一旦每次渲染都新建，这里就会被重铺一遍
    expect(rowSpan).toHaveBeenCalledTimes(rows.length);
  });
});
