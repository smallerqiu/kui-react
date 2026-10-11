import { Button, Table, type Column } from "react-kui";
const middle: Column[] = [];
const values: Record<string, string> = {};
for (let i = 0; i < 20; i++) {
  middle.push({ title: `Col${i}`, key: `address${i}`, width: 150 });
  values[`address${i}`] = "Hubei Wuhan SoftBase No.128";
}
const data = Array.from({ length: 10 }, (_, i) => ({
  key: i,
  name: "Han Mei",
  age: 28,
  ...values,
}));
const columns: Column[] = [
  { title: "Name", key: "name", fixed: "left" },
  { title: "Age", key: "age", fixed: "left" },
  ...middle,
  // 分组父列上的 `fixed` 会继承给它的每个叶子列，整组一起固定
  {
    title: "Operate",
    key: "operate",
    fixed: "right",
    children: [
      {
        title: "Edit",
        key: "action",
        render: () => <Button size="small">test</Button>,
      },
      {
        title: "More",
        key: "action1",
        render: () => <Button size="small">test2</Button>,
      },
    ],
  },
];
export default function App() {
  return <Table data={data} columns={columns} scroll={{ y: 300 }} />;
}
