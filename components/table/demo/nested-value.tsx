import { Table, type Column } from "react-kui";

/**
 * 嵌套数据不需要先拍平：列 `key`、`rowKey`、`childrenColumnName` 都可以写成 `a.b` 点路径。
 * 整名优先，所以字段名本身带点号时仍按整名取值；下钻途中缺字段只会渲染成空，不会抛错。
 */
interface Member {
  meta: { uid: string };
  profile: { name: string; city?: string };
  tags?: string[];
  rows?: { items: Member[] };
}

const data: Member[] = [
  {
    meta: { uid: "design" },
    profile: { name: "Design Guild", city: "Hangzhou" },
    tags: ["Studio", "Brand"],
    rows: {
      items: [
        { meta: { uid: "ann" }, profile: { name: "Ann", city: "Hangzhou" }, tags: ["Studio"] },
        { meta: { uid: "bob" }, profile: { name: "Bob" } },
      ],
    },
  },
  {
    meta: { uid: "front-end" },
    profile: { name: "Front-end Guild", city: "Shanghai" },
    tags: ["Kui"],
    rows: {
      items: [
        {
          meta: { uid: "cara" },
          profile: { name: "Cara", city: "Shanghai" },
          tags: ["Kui", "Charts"],
        },
      ],
    },
  },
];

const columns: Column<Member>[] = [
  { title: "Name", key: "profile.name", sorter: true },
  { title: "City", key: "profile.city" },
  { title: "Primary tag", key: "tags.0" },
  { title: "Secondary tag", key: "tags.1" },
];

export default function NestedValueDemo() {
  return (
    <Table
      data={data}
      columns={columns}
      rowKey="meta.uid"
      childrenColumnName="rows.items"
      expandAllRows
    />
  );
}
